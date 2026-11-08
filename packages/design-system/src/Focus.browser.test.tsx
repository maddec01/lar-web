// Focus through overlays, with real keyboard and pointer input: where focus lands as one opens, that the page behind
// it is inert, that Tab stays inside, where focus returns as it closes, and the question before unsaved edits are lost.
import './styles.css';

import { composeStories } from '@storybook/react-vite';
import { render, screen } from '@testing-library/react';
import { PencilIcon } from 'lucide-react';
import { useState } from 'react';
import { fn } from 'storybook/test';
import { afterEach, expect, it } from 'vite-plus/test';
import { page, userEvent } from 'vite-plus/test/browser/context';

import { Button } from './actions/Button';
import { IconButton } from './actions/IconButton';
import { Select, SelectItem } from './forms/Select';
import { DesignSystemProvider } from './foundations/DesignSystemProvider';
import { SiteHeader, SiteShell } from './layout/Site';
import { Drawer } from './overlays/Drawer';
import { DropdownMenu } from './overlays/DropdownMenu';
import { Modal } from './overlays/Modal';
import * as modalStories from './overlays/Modal.stories';

afterEach(async () => {
    await page.viewport(1280, 900);
});

it.each([
    [
        'menu',
        () => (
            <DropdownMenu>
                <DropdownMenu.Trigger asChild>
                    <Button>Actions</Button>
                </DropdownMenu.Trigger>
                <DropdownMenu.Content>
                    <DropdownMenu.Item>Inspect</DropdownMenu.Item>
                </DropdownMenu.Content>
            </DropdownMenu>
        ),
        () => page.getByRole('button', { name: 'Actions' }),
    ],
    [
        'select',
        () => (
            <Select aria-label="Library" defaultValue="music">
                <SelectItem value="music">Music</SelectItem>
                <SelectItem value="movies">Movies</SelectItem>
            </Select>
        ),
        () => page.getByRole('combobox', { name: 'Library' }),
    ],
] as const)('holds the background inert behind an open %s and returns focus on Escape', async (_, Overlay, trigger) => {
    const { container } = render(<Overlay />);

    await trigger().click();
    await expect.poll(() => container.inert).toBe(true);
    await userEvent.keyboard('{Escape}');
    await expect.poll(() => container.inert).toBe(false);
    await expect.poll(() => document.activeElement).toBe(trigger().element());
});

it('opens a drawer with no field on the drawer itself, not on its first icon button', async () => {
    render(
        <Drawer open onOpenChange={() => {}}>
            <Drawer.Content title="Episode 5" actions={<IconButton aria-label="Edit" icon={<PencilIcon />} />}>
                <Drawer.Body>Details</Drawer.Body>
            </Drawer.Content>
        </Drawer>,
    );

    const dialog = await screen.findByRole('dialog', { name: 'Episode 5' });

    await expect.poll(() => document.activeElement).toBe(dialog);
});

function MenuDialog() {
    const [open, setOpen] = useState(false);

    return (
        <>
            <DropdownMenu>
                <DropdownMenu.Trigger asChild>
                    <Button>More actions</Button>
                </DropdownMenu.Trigger>
                <DropdownMenu.Content>
                    <DropdownMenu.Item onSelect={() => setOpen(true)}>Technical details</DropdownMenu.Item>
                </DropdownMenu.Content>
            </DropdownMenu>
            {open ? (
                <Modal onClose={() => setOpen(false)}>
                    <Modal.Content title="Technical details">
                        <Modal.Body>Stored record</Modal.Body>
                    </Modal.Content>
                </Modal>
            ) : null}
        </>
    );
}

it('opens a read-only dialog from a menu on its content, and returns focus to the menu trigger', async () => {
    render(<MenuDialog />);
    await page.getByRole('button', { name: 'More actions' }).click();
    await page.getByRole('menuitem', { name: 'Technical details' }).click();

    const dialog = await screen.findByRole('dialog', { name: 'Technical details' });

    await expect.poll(() => document.activeElement).toBe(dialog);
    expect(screen.getByRole('button', { name: 'Close' })).not.toHaveFocus();
    await userEvent.keyboard('{Tab}');
    expect(screen.getByRole('button', { name: 'Close' })).toHaveFocus();
    await userEvent.keyboard('{Escape}');
    await expect.poll(() => document.activeElement).toBe(screen.getByRole('button', { name: 'More actions' }));
});

it('wraps Tab and Shift+Tab inside the site’s menu, and Escape hands focus back to its button', async () => {
    await page.viewport(390, 844);
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
            <a href="/open-source">Open source</a>
        </SiteShell>,
    );

    const trigger = screen.getByRole('button', { name: 'Open menu' });

    trigger.focus();
    await userEvent.keyboard('{Enter}');

    const menu = await screen.findByRole('dialog', { name: 'Menu' });

    await expect.poll(() => document.activeElement?.textContent).toBe('Factory');

    for (const key of [...Array<string>(8).fill('{Tab}'), ...Array<string>(8).fill('{Shift>}{Tab}{/Shift}')]) {
        await userEvent.keyboard(key);
        expect(menu.contains(document.activeElement), `${key} reached ${document.activeElement?.outerHTML}`).toBe(true);
    }

    await userEvent.keyboard('{Escape}');
    await expect.poll(() => document.activeElement).toBe(trigger);
});

// The dirty guard

const { DirtyDismissGuard, DiscardThenNavigate } = composeStories(modalStories);

async function openEditor(onClose = fn()) {
    render(
        <DesignSystemProvider>
            <DirtyDismissGuard onClose={onClose} />
        </DesignSystemProvider>,
    );
    await screen.findByRole('dialog', { name: 'Edit catalog' });

    return onClose;
}

const question = () => document.querySelector('[role="alertdialog"]');

it('closes a clean editor on Escape without asking', async () => {
    const onClose = await openEditor();

    await userEvent.keyboard('{Escape}');
    await expect.poll(() => onClose.mock.calls.length).toBe(1);
    expect(question()).toBeNull();
});

it.each([
    ['Escape', () => userEvent.keyboard('{Escape}')],
    ['the close button', () => page.getByRole('button', { name: 'Close' }).click()],
    // The overlay, beside the dialog's frame.
    ['a click outside', () => userEvent.click(document.body, { position: { x: 4, y: 4 } })],
] as const)('asks before discarding unsaved changes on %s, and keeps editing on request', async (_, dismiss) => {
    const onClose = await openEditor();

    await page.getByRole('textbox', { name: 'Name' }).fill('Family photos 2004–2024');
    await dismiss();
    await expect.poll(question).not.toBeNull();
    // A question opens on its safe answer, never on the action it asks about.
    await expect.poll(() => document.activeElement?.textContent).toBe('Keep editing');

    await page.getByRole('button', { name: 'Keep editing' }).click();
    await expect.poll(question).toBeNull();
    expect(onClose).not.toHaveBeenCalled();
    expect(screen.getByRole('textbox', { name: 'Name' })).toHaveValue('Family photos 2004–2024');
});

it('closes once the reader discards, and Escape on the question keeps editing', async () => {
    const onClose = await openEditor();

    await page.getByRole('textbox', { name: 'Name' }).fill('Holiday photos');
    await userEvent.keyboard('{Escape}');
    await expect.poll(question).not.toBeNull();
    await userEvent.keyboard('{Escape}');
    await expect.poll(question).toBeNull();
    expect(onClose).not.toHaveBeenCalled();

    await userEvent.keyboard('{Escape}');
    await expect.poll(question).not.toBeNull();
    await page.getByRole('button', { name: 'Discard changes' }).click();
    await expect.poll(() => onClose.mock.calls.length).toBe(1);
});

it('asks before leaving a dirty editor for another dialog, then goes there instead of closing', async () => {
    const onClose = fn();

    render(
        <DesignSystemProvider>
            <DiscardThenNavigate onClose={onClose} />
        </DesignSystemProvider>,
    );
    await screen.findByRole('dialog', { name: 'Edit Family photos' });

    await page.getByRole('button', { name: 'Open Holiday photos' }).click();
    await expect.poll(() => screen.queryByRole('dialog', { name: 'Edit Holiday photos' })).not.toBeNull();
    expect(question()).toBeNull();

    await page.getByRole('textbox', { name: 'Name' }).fill('Holidays');
    await page.getByRole('button', { name: 'Open Family photos' }).click();
    await expect.poll(question).not.toBeNull();
    await page.getByRole('button', { name: 'Discard changes' }).click();
    await expect.poll(() => screen.queryByRole('dialog', { name: 'Edit Family photos' })).not.toBeNull();
    expect(onClose).not.toHaveBeenCalled();
});
