import { render, screen } from '@testing-library/react';
import { PencilIcon } from 'lucide-react';
import { useState } from 'react';
import { expect, it } from 'vite-plus/test';
import { page, userEvent } from 'vite-plus/test/browser/context';

import { Button } from '../actions/Button';
import { IconButton } from '../actions/IconButton';
import { Select, SelectItem } from '../forms/Select';
import { Drawer } from './Drawer';
import { DropdownMenu } from './DropdownMenu';
import { Modal } from './Modal';

it('holds the menu background inert and restores focus after Escape', async () => {
    const { container } = render(
        <DropdownMenu>
            <DropdownMenu.Trigger asChild>
                <Button>Actions</Button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content>
                <DropdownMenu.Item>Inspect</DropdownMenu.Item>
            </DropdownMenu.Content>
        </DropdownMenu>,
    );
    const trigger = screen.getByRole('button', { name: 'Actions' });

    await page.getByRole('button', { name: 'Actions' }).click();
    await expect.poll(() => container.inert).toBe(true);
    await userEvent.keyboard('{Escape}');
    await expect.poll(() => container.inert).toBe(false);
    await expect.poll(() => document.activeElement).toBe(trigger);
});

it('holds the select background inert and restores focus after Escape', async () => {
    const { container } = render(
        <Select aria-label="Library" defaultValue="music">
            <SelectItem value="music">Music</SelectItem>
            <SelectItem value="movies">Movies</SelectItem>
        </Select>,
    );
    const trigger = screen.getByRole('combobox', { name: 'Library' });

    await page.getByRole('combobox', { name: 'Library' }).click();
    await expect.poll(() => container.inert).toBe(true);
    await userEvent.keyboard('{Escape}');
    await expect.poll(() => container.inert).toBe(false);
    await expect.poll(() => document.activeElement).toBe(trigger);
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
