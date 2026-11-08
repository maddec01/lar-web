import { act, fireEvent, render, screen } from '@testing-library/react';
import { expect, it, vi } from 'vite-plus/test';

import { SiteHeader } from './Site';

function header() {
    render(
        <>
            <SiteHeader
                brand={<span>Lar</span>}
                links={[{ label: 'Factory', href: '/factory' }]}
                actions={<a href="/download">Download</a>}
                menuLabel="Open menu"
                closeMenuLabel="Close menu"
                navigationLabel="Main"
                onNavigate={vi.fn()}
            />
            <main>
                <a href="/open-source">Open source</a>
            </main>
        </>,
    );
}

it('the open menu holds the page’s call to action', () => {
    header();
    fireEvent.click(screen.getByRole('button', { name: 'Open menu' }));

    expect(screen.getAllByRole('link', { name: 'Download' })).toHaveLength(2);
});

it('Escape closes the menu and focus returns to its button', () => {
    header();
    fireEvent.click(screen.getByRole('button', { name: 'Open menu' }));
    screen.getAllByRole('link', { name: 'Factory' }).at(-1)!.focus();

    act(() => {
        fireEvent.keyDown(document, { key: 'Escape' });
    });

    const trigger = screen.getByRole('button', { name: 'Open menu' });

    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(trigger).toHaveFocus();
});

it('a press outside the header closes the menu', () => {
    header();
    fireEvent.click(screen.getByRole('button', { name: 'Open menu' }));
    fireEvent.pointerDown(document.body);

    expect(screen.getByRole('button', { name: 'Open menu' })).toHaveAttribute('aria-expanded', 'false');
});

it('the open menu makes the page behind it inert, and closing it gives the page back', () => {
    header();

    const page = screen.getByRole('main');

    fireEvent.click(screen.getByRole('button', { name: 'Open menu' }));
    expect(page).toHaveAttribute('inert');

    act(() => {
        fireEvent.keyDown(document, { key: 'Escape' });
    });
    expect(page).not.toHaveAttribute('inert');
});
