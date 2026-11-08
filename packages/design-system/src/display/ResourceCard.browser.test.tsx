import '../styles.css';

import { composeStories } from '@storybook/react-vite';
import { render, screen } from '@testing-library/react';
import { expect, it } from 'vite-plus/test';
import { page } from 'vite-plus/test/browser/context';

import { DesignSystemProvider } from '../foundations/DesignSystemProvider';
import * as stories from './ResourceCard.stories';

const { LongContent } = composeStories(stories);

const box = (element: Element) => element.getBoundingClientRect();

it.each([
    // A settings dialog's card, then a phone's.
    { width: 620, beside: true },
    { width: 340, beside: false },
])('keeps a long status clear of the details in a $width px card', async ({ width, beside }) => {
    await page.viewport(1280, 900);
    render(
        <DesignSystemProvider>
            <div style={{ width }}>
                <LongContent />
            </div>
        </DesignSystemProvider>,
    );

    const article = box(document.querySelector('article')!);
    const status = document.querySelector('[data-slot="resource-card-status"]')!;
    const details = screen.getByRole('heading', { name: 'Field Recordings' }).parentElement!.parentElement!;
    const path = screen.getByText(/uncompressed masters/);
    const statusLine = status.querySelector('[data-slot="progress-status-row"]')!;

    // Nothing reaches past the card or over the details: beside them, the status starts after the path ends; below
    // them, under it.
    for (const element of [status, statusLine, path]) {
        expect(box(element).left).toBeGreaterThanOrEqual(article.left);
        expect(box(element).right).toBeLessThanOrEqual(article.right + 0.5);
    }

    if (beside) {
        expect(box(status).left).toBeGreaterThanOrEqual(box(details).right);
        expect(Math.abs(box(status).top - box(details).top)).toBeLessThan(4);
    } else {
        expect(box(status).top).toBeGreaterThanOrEqual(box(details).bottom);
        // From the details' text start, not under the icon.
        expect(Math.abs(box(statusLine).left - box(details).left)).toBeLessThan(10);
    }

    // Cut, with the whole of it in the hover title.
    expect(path.scrollWidth).toBeGreaterThan(path.clientWidth);
    expect(path).toHaveAttribute('title', expect.stringContaining('uncompressed masters'));
    expect(statusLine.querySelector('[title]')).toHaveAttribute(
        'title',
        expect.stringContaining('Last scanned Sep 29'),
    );
});
