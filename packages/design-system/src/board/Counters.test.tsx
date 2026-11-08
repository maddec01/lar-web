// The title bar counters' geometry, which jsdom can't lay out, so these read the classes behind it: one icon box, a
// value slot that keeps its width from dash to number, the folds by the bar's width, and a panel padded as a menu whose
// list scrolls between its head and foot.

import { fireEvent, render, screen } from '@testing-library/react';
import { expect, it } from 'vite-plus/test';

import { TooltipProvider } from '../overlays/Tooltip';
import { BoardCounter, CounterItem, CounterList } from './Counters';

const counter = (props: Partial<Parameters<typeof BoardCounter>[0]> = {}) => (
    <TooltipProvider>
        <BoardCounter icon={<svg />} value="4" label="building" hint="4 builds at work" title="Building" {...props}>
            <CounterList>
                <CounterItem
                    item="I_1"
                    label="#1 First"
                    leading={null}
                    title="#1 First"
                    trailing="3d ago"
                    onOpen={() => {}}
                />
            </CounterList>
        </BoardCounter>
    </TooltipProvider>
);

const classes = (el: Element | null) => el!.className.split(' ');

it('a counter keeps one icon box and a value slot as wide as its kind of value, and names both', () => {
    const { rerender } = render(counter());
    const button = screen.getByRole('button', { name: 'building: 4' });

    expect(button).toHaveAccessibleDescription('4 builds at work');
    expect(classes(button.querySelector('.counter-icon'))).toEqual(expect.arrayContaining(['size-4', 'shrink-0']));
    expect([button.dataset.width, classes(button.querySelector('.counter-value'))]).toEqual([
        'count',
        expect.arrayContaining(['min-w-[2ch]', 'tabular-nums']),
    ]);
    rerender(counter({ width: 'limit' }));
    expect(classes(button.querySelector('.counter-value'))).toContain('min-w-[4ch]');
    rerender(counter({ width: 'spend' }));
    expect(classes(button.querySelector('.counter-value'))).toContain('min-w-[8ch]');
});

it('a counter folds away below its width and says which fold it has', () => {
    const { rerender } = render(counter());
    const button = () => screen.getByRole('button', { name: /^building/ });

    expect([button().dataset.fold, classes(button()).filter((c) => c.startsWith('@') || c === 'hidden')]).toEqual([
        'never',
        [],
    ]);
    rerender(counter({ fold: 'medium' }));
    expect([button().dataset.fold, classes(button())]).toEqual([
        'medium',
        expect.arrayContaining(['hidden', '@4xl:inline-flex']),
    ]);
    rerender(counter({ fold: 'wide' }));
    expect([button().dataset.fold, classes(button())]).toEqual([
        'wide',
        expect.arrayContaining(['hidden', '@6xl:inline-flex']),
    ]);
});

it("a counter's panel is padded as a menu, its rows as menu rows, and only its list scrolls", () => {
    render(counter({ sub: '4/2', foot: 'At the build limit.' }));
    fireEvent.click(screen.getByRole('button', { name: /^building/ }));

    const head = document.querySelector('[data-counter-head]')!;
    const list = document.querySelector('[data-counter-list]')!;
    const foot = document.querySelector('[data-counter-foot]')!;

    expect([head.textContent, foot.textContent]).toEqual(['Building4/2', 'At the build limit.']);
    // The panel is flush, so the header's divider runs edge to edge; its list is padded as a menu.
    expect(classes(head.closest('[data-slot="popover-content"]'))).toContain('p-0');
    expect(classes(list)).toEqual(expect.arrayContaining(['min-h-0', 'flex-1', 'overflow-y-auto', 'p-1']));
    expect([list.contains(head), list.contains(foot)]).toEqual([false, false]);
    expect(classes(list.querySelector('ul'))).toContain('grid-cols-[minmax(0,1fr)]');
    expect(classes(list.querySelector('li button'))).toEqual(
        expect.arrayContaining([
            'min-h-7',
            'max-lg:min-h-11',
            'pointer-coarse:min-h-11',
            'py-1',
            'text-sm',
            'rounded-sm',
        ]),
    );
});

it('keeps a header count beside its title independently of the detail', () => {
    render(counter({ count: 4, sub: 'Automatic limit 2' }));
    fireEvent.click(screen.getByRole('button', { name: /^building/ }));

    const head = document.querySelector('[data-counter-head]')!;

    expect(head.querySelector('h2')!.textContent).toBe('Building4');
    expect(head.textContent).toBe('Building4Automatic limit 2');
});
