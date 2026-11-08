import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vite-plus/test';

import { CommandPalette } from './CommandPalette';

describe('command palette results overflow', () => {
    const observers = new Set<ControlledResizeObserver>();

    class ControlledResizeObserver {
        elements = new Set<Element>();
        private callback: ResizeObserverCallback;

        constructor(callback: ResizeObserverCallback) {
            this.callback = callback;
            observers.add(this);
        }
        observe(element: Element) {
            this.elements.add(element);
        }
        unobserve(element: Element) {
            this.elements.delete(element);
        }
        disconnect() {
            this.elements.clear();
        }
        resize(element: Element) {
            if (this.elements.has(element)) this.callback([], this);
        }
    }

    beforeEach(() => {
        observers.clear();
        vi.stubGlobal('ResizeObserver', ControlledResizeObserver);
    });

    afterEach(() => vi.unstubAllGlobals());

    it('follows the results scroll boundaries while leaving the field and footer outside the fade', () => {
        render(palette(['Music', 'Movies', 'Books']));

        const viewport = screen.getByRole('listbox').closest<HTMLElement>('.overflow-y-auto')!;
        const metrics = { scrollTop: 0, scrollHeight: 100, clientHeight: 100 };

        for (const key of ['scrollTop', 'scrollHeight', 'clientHeight'] as const) {
            Object.defineProperty(viewport, key, { configurable: true, get: () => metrics[key] });
        }

        const expectDistances = (top: number, bottom: number) => {
            expect(viewport.style.getPropertyValue('--scroll-fade-top')).toBe(`${top}px`);
            expect(viewport.style.getPropertyValue('--scroll-fade-bottom')).toBe(`${bottom}px`);
        };

        fireEvent.scroll(viewport);
        expectDistances(0, 0);

        metrics.scrollHeight = 300;
        fireEvent.scroll(viewport);
        expectDistances(0, 200);

        metrics.scrollTop = 80;
        fireEvent.scroll(viewport);
        expectDistances(80, 120);

        metrics.scrollTop = 200;
        fireEvent.scroll(viewport);
        expectDistances(200, 0);

        expect(screen.getByRole('combobox')).toHaveFocus();
        expect(viewport).not.toContainElement(screen.getByRole('combobox'));
        expect(viewport).not.toContainElement(
            document.querySelector<HTMLElement>('[data-slot="command-palette-hints"]'),
        );
    });

    it('updates when results arrive, filtering empties the list and the viewport resizes without scrolling', () => {
        const view = render(palette(['Music']));
        const list = screen.getByRole('listbox');
        const viewport = list.closest<HTMLElement>('.overflow-y-auto')!;
        const metrics = { scrollTop: 0, scrollHeight: 100, clientHeight: 100 };

        for (const key of ['scrollTop', 'scrollHeight', 'clientHeight'] as const) {
            Object.defineProperty(viewport, key, { configurable: true, get: () => metrics[key] });
        }

        const content = [...observers]
            .flatMap((observer) => [...observer.elements])
            .find((element) => element !== viewport && element.contains(list));

        expect(content).toBeDefined();

        const resize = (element: Element) => {
            act(() => {
                for (const observer of observers) observer.resize(element);
            });
        };

        view.rerender(palette(['Music', 'Movies', 'Books']));
        metrics.scrollHeight = 300;
        resize(content!);
        expect(viewport.style.getPropertyValue('--scroll-fade-bottom')).toBe('200px');

        metrics.clientHeight = 200;
        resize(viewport);
        expect(viewport.style.getPropertyValue('--scroll-fade-bottom')).toBe('100px');

        view.rerender(palette([]));
        metrics.scrollHeight = 200;
        resize(content!);
        expect(screen.getByText('No results')).toBeInTheDocument();
        expect(screen.queryAllByRole('option')).toHaveLength(0);
        expect(viewport.style.getPropertyValue('--scroll-fade-top')).toBe('0px');
        expect(viewport.style.getPropertyValue('--scroll-fade-bottom')).toBe('0px');
    });
});

function palette(options: string[]) {
    return (
        <CommandPalette
            label="Go to"
            description="Find a destination"
            placeholder="Search"
            query=""
            onQueryChange={() => undefined}
            options={options}
            onSelect={() => undefined}
            onClose={() => undefined}
            listLabel="Destinations"
            empty="No results"
        >
            {options.map((option) => (
                <div key={option} role="option" aria-selected={false}>
                    {option}
                </div>
            ))}
        </CommandPalette>
    );
}
