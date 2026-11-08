import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vite-plus/test';

import { Link, LinkOverlay } from './Link';

describe.each([
    ['Link', Link],
    ['LinkOverlay', LinkOverlay],
] as const)('%s navigation', (_name, Component) => {
    it('navigates ordinary clicks without triggering the containing row', () => {
        const navigate = vi.fn();
        const selectRow = vi.fn();

        render(
            <div onClick={selectRow}>
                <Component href="/catalog" onNavigate={navigate}>
                    Catalog
                </Component>
            </div>,
        );
        fireEvent.click(screen.getByRole('link'));

        expect(navigate).toHaveBeenCalledWith('/catalog');
        expect(selectRow).not.toHaveBeenCalled();
    });

    it.each([{ ctrlKey: true }, { metaKey: true }, { shiftKey: true }, { altKey: true }, { button: 1 }])(
        'preserves browser navigation for modified clicks: %j',
        (modifiers) => {
            const navigate = vi.fn();
            const selectRow = vi.fn();

            render(
                <div onClick={selectRow}>
                    <Component href="#catalog" onNavigate={navigate}>
                        Catalog
                    </Component>
                </div>,
            );

            const event = new MouseEvent('click', { bubbles: true, cancelable: true, ...modifiers });

            fireEvent(screen.getByRole('link'), event);

            expect(event.defaultPrevented).toBe(false);
            expect(navigate).not.toHaveBeenCalled();
            expect(selectRow).not.toHaveBeenCalled();
        },
    );

    it.each([{ external: true }, { target: '_blank' }, { download: '' }, { download: 'catalog.json' }])(
        'preserves native navigation for %j',
        (props) => {
            const navigate = vi.fn();

            render(
                <Component {...props} href="#catalog" onNavigate={navigate}>
                    Catalog
                </Component>,
            );

            const event = new MouseEvent('click', { bubbles: true, cancelable: true });

            fireEvent(screen.getByRole('link'), event);

            expect(event.defaultPrevented).toBe(false);
            expect(navigate).not.toHaveBeenCalled();
        },
    );

    it('respects a click cancelled by the caller', () => {
        const navigate = vi.fn();

        render(
            <Component href="/catalog" onNavigate={navigate} onClick={(event) => event.preventDefault()}>
                Catalog
            </Component>,
        );
        fireEvent.click(screen.getByRole('link'));

        expect(navigate).not.toHaveBeenCalled();
    });
});

it('a navigation instruction supplies one decorative arrow without changing its accessible name', () => {
    const { rerender } = render(
        <Link arrow href="/activity">
            Go to the dashboard
        </Link>,
    );
    const link = screen.getByRole('link', { name: 'Go to the dashboard' });

    expect(link.textContent).toBe('Go to the dashboard →');
    expect(link.querySelector('[aria-hidden="true"]')).toHaveTextContent('→');
    rerender(<Link href="/activity">Dashboard</Link>);
    expect(screen.getByRole('link').textContent).toBe('Dashboard');
});
