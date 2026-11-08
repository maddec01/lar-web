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
