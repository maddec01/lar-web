import '../styles.css';

import { render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { afterEach, expect, it } from 'vite-plus/test';
import { page, userEvent } from 'vite-plus/test/browser/context';

import { SiteHeader, SiteShell } from './Site';

function site(content: ReactNode = <a href="/open-source">Open source</a>) {
    render(
        <SiteShell
            skipLabel="Skip to content"
            header={
                <SiteHeader
                    brand={<a href="/">Lar</a>}
                    links={[
                        { label: 'Factory', href: '/factory' },
                        { label: 'Server', href: '/server' },
                    ]}
                    actions={<a href="/download">Download</a>}
                    menuLabel="Open menu"
                    closeMenuLabel="Close menu"
                    menuTitle="Menu"
                    navigationLabel="Main"
                    onNavigate={() => {}}
                />
            }
            footer={<footer>Footer</footer>}
        >
            {content}
        </SiteShell>,
    );
}

afterEach(async () => {
    await page.viewport(1280, 800);
});

it('is a named modal dialog: Tab and Shift+Tab wrap inside it, never behind it or out of the page, and Escape hands focus back to its button', async () => {
    await page.viewport(390, 844);
    site();

    const trigger = screen.getByRole('button', { name: 'Open menu' });

    trigger.focus();
    await userEvent.keyboard('{Enter}');
    await expect.poll(() => trigger.getAttribute('aria-expanded')).toBe('true');

    const menu = screen.getByRole('dialog', { name: 'Menu' });

    expect(menu).toHaveAttribute('aria-modal', 'true');
    // Opening moves focus into the menu, to its first link.
    await expect.poll(() => document.activeElement?.textContent).toBe('Factory');

    const visited = new Set<string>();

    // Tab and Shift+Tab wrap inside the dialog: never behind it, never out to the document or the browser's chrome.
    for (const key of [...Array<string>(8).fill('{Tab}'), ...Array<string>(8).fill('{Shift>}{Tab}{/Shift}')]) {
        await userEvent.keyboard(key);

        const focused = document.activeElement!;

        expect(menu.contains(focused), `${key} reached ${focused.outerHTML}`).toBe(true);
        visited.add(focused.textContent || focused.getAttribute('aria-label') || '');
    }

    expect([...visited]).toEqual(expect.arrayContaining(['Lar', 'Factory', 'Server', 'Download', 'Close menu']));
    expect(screen.getByRole('link', { name: 'Open source', hidden: true }).closest('[inert]')).not.toBeNull();

    await userEvent.keyboard('{Escape}');
    await expect.poll(() => document.activeElement).toBe(screen.getByRole('button', { name: 'Open menu' }));
    expect(screen.getByRole('link', { name: 'Open source' }).closest('[inert]')).toBeNull();
});

it('closes the menu, giving the page back, once the window is wide enough for the bar’s links', async () => {
    await page.viewport(390, 844);
    site();
    await userEvent.click(screen.getByRole('button', { name: 'Open menu' }));
    await expect.poll(() => document.querySelector('main')?.closest('[inert]') ?? null).not.toBeNull();

    await page.viewport(1024, 800);
    await expect.poll(() => document.querySelector('main')?.closest('[inert]') ?? null).toBeNull();
});

it('holds the page still while the menu is open and leaves it where it was once the menu closes', async () => {
    await page.viewport(390, 844);
    site(<div style={{ height: '4000px' }}>A long page</div>);

    window.scrollTo({ top: 200, behavior: 'instant' });
    await userEvent.click(screen.getByRole('button', { name: 'Open menu' }));
    await expect.poll(() => screen.queryByRole('dialog', { name: 'Menu' })).not.toBeNull();

    expect(getComputedStyle(document.documentElement).overflow).toBe('hidden');

    // A wheel over the dimmed page, as a reader would scroll.
    await userEvent.wheel(document.body, { delta: { y: 650 } });
    await new Promise((resolve) => setTimeout(resolve, 100));

    expect(window.scrollY).toBe(200);

    await userEvent.keyboard('{Escape}');
    await expect.poll(() => screen.queryByRole('dialog', { name: 'Menu' })).toBeNull();

    expect(window.scrollY).toBe(200);
    expect(document.documentElement.style.overflow).toBe('');

    window.scrollBy({ top: 100, behavior: 'instant' });
    expect(window.scrollY).toBe(300);
});
