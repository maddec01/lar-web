import '../styles.css';

import { composeStories } from '@storybook/react-vite';
import { render } from '@testing-library/react';
import { expect, it } from 'vite-plus/test';
import { page } from 'vite-plus/test/browser/context';

import { DesignSystemProvider } from '../foundations/DesignSystemProvider';
import * as stories from './ProgressStatusRow.stories';

const { LineKeepsItsNumbers } = composeStories(stories);

it('keeps a card summary’s numbers whole while its words give way', async () => {
    await page.viewport(1280, 900);
    render(
        <DesignSystemProvider>
            <LineKeepsItsNumbers />
        </DesignSystemProvider>,
    );

    const lines = [...document.querySelectorAll('[data-layout="line"] [data-slot="progress-meta"] [title]')];

    expect(lines).toHaveLength(2);
    for (const line of lines) {
        const [words, numbers] = [...line.children] as HTMLElement[];

        // The words are cut; the numbers fit, so they draw no ellipsis.
        expect(words!.scrollWidth).toBeGreaterThan(words!.clientWidth);
        expect(numbers!.scrollWidth).toBeLessThanOrEqual(Math.ceil(numbers!.getBoundingClientRect().width));
        expect(line).toHaveAttribute('title', expect.stringContaining(numbers!.textContent!.replace(/^\s*·\s*/, '')));
    }
});
