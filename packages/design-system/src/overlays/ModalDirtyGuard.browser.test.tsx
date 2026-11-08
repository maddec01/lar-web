import '../styles.css';

import { composeStories } from '@storybook/react-vite';
import { render, screen } from '@testing-library/react';
import { fn } from 'storybook/test';
import { expect, it } from 'vite-plus/test';
import { page, userEvent } from 'vite-plus/test/browser/context';

import { DesignSystemProvider } from '../foundations/DesignSystemProvider';
import * as stories from './Modal.stories';

const { DirtyDismissGuard, DiscardThenNavigate } = composeStories(stories);

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
    ['Cancel', () => page.getByRole('button', { name: 'Cancel' }).click()],
    [
        'a click outside',
        async () => {
            // The overlay, beside the dialog's frame.
            await userEvent.click(document.body, { position: { x: 4, y: 4 } });
        },
    ],
] as const)('asks before discarding unsaved changes on %s, and keeps editing on request', async (_, dismiss) => {
    const onClose = await openEditor();

    await page.getByRole('textbox', { name: 'Name' }).fill('Family photos 2004–2024');
    await dismiss();
    await expect.poll(question).not.toBeNull();

    const asking = screen.getByRole('alertdialog', { name: 'Discard changes?' });

    // A question has no close button and opens on its safe answer, never on the action it asks about.
    await expect.poll(() => document.activeElement?.textContent).toBe('Keep editing');
    expect(asking.querySelector('[data-slot="modal-close"]')).toBeNull();
    expect(onClose).not.toHaveBeenCalled();

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
    expect(screen.getByRole('dialog', { name: 'Edit catalog' })).toBeInTheDocument();

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
    await page.getByRole('button', { name: 'Keep editing' }).click();
    await expect.poll(question).toBeNull();
    expect(screen.getByRole('textbox', { name: 'Name' })).toHaveValue('Holidays');

    await page.getByRole('button', { name: 'Open Family photos' }).click();
    await expect.poll(question).not.toBeNull();
    await page.getByRole('button', { name: 'Discard changes' }).click();
    await expect.poll(() => screen.queryByRole('dialog', { name: 'Edit Family photos' })).not.toBeNull();
    expect(onClose).not.toHaveBeenCalled();
});
