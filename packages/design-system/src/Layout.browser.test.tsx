// What only a real layout engine shows: a dialog's frame that holds its header and footer in view.
import './styles.css';

import { composeStories } from '@storybook/react-vite';
import { render, screen } from '@testing-library/react';
import { expect, it } from 'vite-plus/test';
import { page } from 'vite-plus/test/browser/context';

import { DesignSystemProvider } from './foundations/DesignSystemProvider';
import * as modalStories from './overlays/Modal.stories';

const { LongPaneWithOpenedDisclosure } = composeStories(modalStories);

const inWindow = (element: Element) => {
    const box = element.getBoundingClientRect();

    return box.height > 0 && box.top >= 0 && box.bottom <= innerHeight;
};

const frameOf = async (name: string) => {
    const dialog = await screen.findByRole('dialog', { name });

    return dialog.closest<HTMLElement>('[data-slot="modal-content"]') ?? dialog;
};

it('keeps the title, close, sidebar and footer in view when a status deep in a long pane is revealed', async () => {
    await page.viewport(1280, 720);
    render(
        <DesignSystemProvider>
            <LongPaneWithOpenedDisclosure />
        </DesignSystemProvider>,
    );

    const frame = await frameOf('Server settings');

    screen.getByText('Server addresses').scrollIntoView({ block: 'start' });
    screen.getByRole('button', { name: 'Test connection' }).click();
    await expect.poll(() => inWindow(screen.getByTestId('connection-status'))).toBe(true);

    const hidden = [
        screen.getByRole('heading', { name: 'Remote access' }),
        screen.getByRole('button', { name: 'Close' }),
        screen.getByRole('button', { name: 'Server' }),
        screen.getByRole('button', { name: 'Save' }),
    ]
        .filter((element) => !inWindow(element))
        .map((element) => element.textContent || element.getAttribute('aria-label'));

    expect(hidden).toEqual([]);
    // The frame is not a scroll container, so nothing inside it can scroll it; the body scrolls instead.
    expect(frame.scrollTop).toBe(0);
    expect(frame.scrollHeight).toBeLessThanOrEqual(frame.clientHeight);
    expect(frame.querySelector('[data-slot="modal-body"]')!.scrollTop).toBeGreaterThan(0);
});
