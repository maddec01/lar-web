import '../board.css';

import { composeStories } from '@storybook/react-vite';
import { render, screen } from '@testing-library/react';
import { expect, it } from 'vite-plus/test';
import { page, userEvent } from 'vite-plus/test/browser/context';

import { DesignSystemProvider } from '../foundations/DesignSystemProvider';
import { TicketSearch } from './AddItem';
import * as stories from './AddItem.stories';

const { LongContent, Tabbed } = composeStories(stories);

it.each([1440, 390])('holds one height when switching Add item panes at %ipx', async (width) => {
    await page.viewport(width, 900);
    render(
        <DesignSystemProvider>
            <Tabbed />
        </DesignSystemProvider>,
    );

    const dialog = await screen.findByRole('dialog', { name: 'Add item' });
    const frame = dialog.closest('[data-slot="modal-content"]') ?? dialog;
    const height = frame.getBoundingClientRect().height;
    const footerBottom = screen.getByRole('button', { name: 'Cancel' }).getBoundingClientRect().bottom;

    expect(height).toBeGreaterThan(600);
    await userEvent.click(screen.getByRole('button', { name: 'Find a ticket' }));
    await screen.findByRole('searchbox', { name: 'Search open tickets' });
    expect(frame.getBoundingClientRect().height).toBe(height);
    expect(visibleInWindow(screen.getByRole('button', { name: 'Cancel' }))).toBe(true);
    expect(screen.getByRole('button', { name: 'Cancel' }).getBoundingClientRect().bottom).toBe(footerBottom);
    await userEvent.click(screen.getByRole('button', { name: 'New work' }));
    await screen.findByRole('textbox', { name: 'Title' });
    expect(frame.getBoundingClientRect().height).toBe(height);
});

it('aligns ticket search controls and disables both in read-only mode', async () => {
    await page.viewport(1280, 900);

    render(
        <DesignSystemProvider>
            <TicketSearch
                id="search"
                query=""
                onQueryChange={() => {}}
                onSearch={() => {}}
                fieldLabel="Search tickets"
                placeholder="Number or title"
                searchLabel="Search"
                tickets={[]}
                listLabel="Matches"
                onPick={() => {}}
                result=""
                disabled
            />
        </DesignSystemProvider>,
    );

    const field = screen.getByRole('searchbox', { name: 'Search tickets' });
    const button = screen.getByRole('button', { name: 'Search' });

    expect(field.getBoundingClientRect().height).toBe(button.getBoundingClientRect().height);
    expect(field).toBeDisabled();
    expect(button).toBeDisabled();
});

const visibleInWindow = (element: Element) => {
    const box = element.getBoundingClientRect();

    return (
        box.width > 0 &&
        box.height > 0 &&
        box.top >= 0 &&
        box.bottom <= innerHeight &&
        box.left >= 0 &&
        box.right <= innerWidth
    );
};

it.each([
    { width: 1280, height: 720 },
    { width: 1024, height: 640 },
    { width: 600, height: 640 },
])('keeps Project, Kind and submit reachable with a very long description at %j', async (size) => {
    await page.viewport(size.width, size.height);

    render(
        <DesignSystemProvider>
            <LongContent />
        </DesignSystemProvider>,
    );

    const project = await screen.findByRole('combobox', { name: 'Project' });
    const kind = screen.getByRole('combobox', { name: 'Kind' });
    const submit = screen.getByRole('button', { name: 'Add item' });
    const editor = screen.getByRole('textbox', { name: 'Description' });

    await expect.poll(() => editor.textContent).toContain('Paragraph 120');
    for (const control of [project, kind, submit]) {
        control.focus();
        await expect.poll(() => document.activeElement).toBe(control);
        await expect.poll(() => visibleInWindow(control)).toBe(true);
    }

    if (size.width >= 1024) {
        expect(visibleInWindow(project)).toBe(true);
        expect(visibleInWindow(kind)).toBe(true);
    }

    project.focus();
    await userEvent.keyboard('{Tab}');
    expect(document.activeElement).toBe(kind);
    expect(visibleInWindow(kind)).toBe(true);
    await userEvent.keyboard('{Tab}');
    expect(document.activeElement).toBe(submit);
    expect(visibleInWindow(submit)).toBe(true);
});
