import '../styles.css';

import { composeStories } from '@storybook/react-vite';
import { render, screen } from '@testing-library/react';
import { expect, it } from 'vite-plus/test';
import { page } from 'vite-plus/test/browser/context';

import { DesignSystemProvider } from '../foundations/DesignSystemProvider';
import * as stories from './Modal.stories';

const { LongPaneWithOpenedDisclosure } = composeStories(stories);

const inWindow = (element: Element) => {
    const box = element.getBoundingClientRect();

    return box.height > 0 && box.top >= 0 && box.bottom <= innerHeight;
};

it('keeps the title, close, sidebar and footer in view when a status deep in a long pane is revealed', async () => {
    await page.viewport(1280, 720);
    render(
        <DesignSystemProvider>
            <LongPaneWithOpenedDisclosure />
        </DesignSystemProvider>,
    );

    const dialog = await screen.findByRole('dialog', { name: 'Server settings' });
    const frame = dialog.closest<HTMLElement>('[data-slot="modal-content"]') ?? dialog;

    screen.getByText('Server addresses').scrollIntoView({ block: 'start' });
    screen.getByRole('button', { name: 'Test connection' }).click();

    const status = await screen.findByTestId('connection-status');

    await expect.poll(() => inWindow(status)).toBe(true);

    for (const element of [
        screen.getByRole('heading', { name: 'Remote access' }),
        screen.getByRole('button', { name: 'Close' }),
        screen.getByRole('button', { name: 'Server' }),
        screen.getByRole('button', { name: 'Save' }),
    ])
        expect({
            element: element.textContent || element.getAttribute('aria-label'),
            inWindow: inWindow(element),
        }).toEqual({
            element: element.textContent || element.getAttribute('aria-label'),
            inWindow: true,
        });

    // The frame is not a scroll container, so nothing inside it can scroll it.
    expect(getComputedStyle(frame).overflowY).toBe('clip');
    expect(frame.scrollTop).toBe(0);
    expect(frame.scrollHeight).toBeLessThanOrEqual(frame.clientHeight);

    const body = dialog.querySelector('[data-slot="modal-body"]')!;

    expect(body.scrollTop).toBeGreaterThan(0);
});

const { ReadingWorkspace, Workspace, Paned, FitsContent } = composeStories(stories);

const frameOf = async (name: string) => {
    const dialog = await screen.findByRole('dialog', { name });

    return (dialog.closest<HTMLElement>('[data-slot="modal-content"]') ?? dialog).getBoundingClientRect();
};

it('takes its content’s height by default, a read-only workspace included, with no empty half', async () => {
    await page.viewport(1440, 900);
    render(
        <DesignSystemProvider>
            <ReadingWorkspace />
        </DesignSystemProvider>,
    );

    const frame = await frameOf('#61 Arr instances, catalog bindings and content requests');

    expect(frame.height).toBeLessThan(900 / 2);
});

it('holds the window’s height for a workspace whose body fills it, such as an editor', async () => {
    await page.viewport(1440, 900);
    render(
        <DesignSystemProvider>
            <Workspace />
        </DesignSystemProvider>,
    );

    const frame = await frameOf('Edit metadata: Kind of Blue');

    expect(frame.height).toBeGreaterThan(900 - 40);
});

it('holds one height across a tabbed dialog’s panes, and fits a short pane when asked', async () => {
    await page.viewport(1440, 900);

    const { unmount } = render(
        <DesignSystemProvider>
            <Paned />
        </DesignSystemProvider>,
    );

    const general = await frameOf('Server settings');

    screen.getByRole('button', { name: 'Libraries' }).click();
    await expect.poll(async () => (await frameOf('Server settings')).height).toBe(general.height);
    expect(general.height).toBeGreaterThan(600);
    unmount();

    render(
        <DesignSystemProvider>
            <FitsContent />
        </DesignSystemProvider>,
    );

    expect((await frameOf('Add item')).height).toBeLessThan(400);
});
