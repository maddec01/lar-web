import { fireEvent, render, screen, within } from '@testing-library/react';
import { expect, it, vi } from 'vite-plus/test';

import { DesignSystemProvider } from '../foundations/DesignSystemProvider';
import { TitleBar } from './TitleBar';

function bar(onNavigate = vi.fn(), statusPlacement?: 'start' | 'end') {
    render(
        <DesignSystemProvider>
            <TitleBar
                product="Factory"
                home={{ href: '/board', label: 'Lar Factory, home', onNavigate }}
                search={<button type="button">Search</button>}
                status={<button type="button">Need you: 6</button>}
                statusLabel="Board status"
                statusPlacement={statusPlacement}
                actions={<button type="button">Add item</button>}
                settings={<button type="button">Settings</button>}
                identity={<button type="button">Account</button>}
            />
        </DesignSystemProvider>,
    );

    return onNavigate;
}

it('the lockup is a link home that a plain click routes and a modified click leaves to the browser', () => {
    const onNavigate = bar();
    const home = screen.getByRole('link', { name: 'Lar Factory, home' });

    expect(home).toHaveAttribute('href', '/board');

    fireEvent.click(home, { metaKey: true });
    expect(onNavigate).not.toHaveBeenCalled();

    fireEvent.click(home);
    expect(onNavigate).toHaveBeenCalledWith('/board');
});

it('puts status on the left and keeps the end group in one order: search, the app’s actions, Settings, identity', () => {
    bar();

    const names = within(screen.getByRole('banner'))
        .getAllByRole('button')
        .map((button) => button.getAttribute('aria-label') ?? button.textContent);

    expect(names).toEqual(['Need you: 6', 'Board status', 'Search', 'Add item', 'Settings', 'Account']);
});

it('puts status at the end, after search, where the app places it there', () => {
    bar(vi.fn(), 'end');

    const names = within(screen.getByRole('banner'))
        .getAllByRole('button')
        .map((button) => button.getAttribute('aria-label') ?? button.textContent);

    expect(names).toEqual(['Search', 'Need you: 6', 'Board status', 'Add item', 'Settings', 'Account']);
});

it('a narrow bar folds status into a popover named by its label', () => {
    bar();
    fireEvent.click(screen.getByRole('button', { name: 'Board status' }));

    expect(screen.getByRole('dialog', { name: 'Board status' })).toHaveTextContent('Need you: 6');
});
