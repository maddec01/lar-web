import '../board.css';

import { composeStories } from '@storybook/react-vite';
import { render } from '@testing-library/react';
import { expect, it } from 'vite-plus/test';
import { page } from 'vite-plus/test/browser/context';

import { DesignSystemProvider } from '../foundations/DesignSystemProvider';
import * as stories from './PartsList.stories';

const { ConceptParts } = composeStories(stories);

/** The lines a box's text takes, from its height and line height. */
const lines = (element: Element) =>
    Math.round(element.getBoundingClientRect().height / parseFloat(getComputedStyle(element).lineHeight));

it.each([1280, 720, 420])(
    'keeps every part title and status at a readable width beside a labelled action at %ipx',
    async (width) => {
        await page.viewport(width, 900);

        const { container } = render(
            <DesignSystemProvider>
                <ConceptParts />
            </DesignSystemProvider>,
        );
        const parts = [...container.querySelectorAll('[data-part]')];

        expect(parts).toHaveLength(4);

        for (const part of parts) {
            const title = part.querySelector('[data-part-title]')!;
            const status = part.querySelector('[data-part-meta]')!;
            const usage = part.querySelector('[data-part-usage]')!;
            const action = part.querySelector('[data-part-action]')!;

            // A title never shrinks to its reference and a letter, and the status never breaks a word a line.
            expect(title.getBoundingClientRect().width).toBeGreaterThanOrEqual(140);
            expect(status.getBoundingClientRect().width).toBeGreaterThanOrEqual(170);
            expect(lines(status)).toBe(1);
            // Usage sits under the identity; the quiet thread icon retains its accessible label and tooltip.
            expect(usage.getBoundingClientRect().top).toBeGreaterThan(status.getBoundingClientRect().top);
            expect(action.textContent).toBe('');
            expect(action.querySelector('[aria-label="Open thread"]')?.getAttribute('title')).toBe('Open thread');
            expect(action.querySelector('[data-kind="control"]')).not.toBeNull();
        }
    },
);
