import { composeStories, type composeStory } from '@storybook/react-vite';
import { render } from '@testing-library/react';
import { describe, expect, it } from 'vite-plus/test';

import preview from '../../.storybook/preview';

type StoryModule = Parameters<typeof composeStories>[0];
type ComposedStory = ReturnType<typeof composeStory>;

const modules = import.meta.glob<StoryModule>('./*.stories.tsx', { eager: true });

describe.each(Object.entries(modules))('%s', (_, module) => {
    const stories: [string, ComposedStory][] = Object.entries(composeStories(module, preview));

    it.each(stories)('%s keeps its centred story frames wider than their text', async (_, Story) => {
        const { container } = render(<Story />);

        await document.fonts.ready;

        // Test the actual global centring decorator and the story's max-width wrappers. A max-width without a width
        // can collapse to zero in the centred grid while its overflowing descendants still paint text.
        const frames = [
            ...container.children,
            ...container.querySelectorAll('.justify-items-center > *'),
            ...document.querySelectorAll('[data-slot="modal-content"]'),
        ].filter((element): element is HTMLElement => element instanceof HTMLElement);

        for (const frame of frames) {
            if (getComputedStyle(frame).display === 'none') continue;

            expect(frame.getBoundingClientRect().width).toBeGreaterThan(0);

            if (!frame.innerText.trim()) continue;

            const measure = document.createElement('canvas').getContext('2d')!;

            measure.font = getComputedStyle(frame).font;

            const longestWord = Math.max(
                ...frame.innerText.split(/\s+/).map((word) => measure.measureText(word).width),
            );

            expect(frame.getBoundingClientRect().width).toBeGreaterThanOrEqual(Math.min(160, longestWord));
        }
    });
});
