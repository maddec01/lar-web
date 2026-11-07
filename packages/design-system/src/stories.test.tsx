// Renders every story in jsdom, so a story that throws, or a component that breaks one, fails the tests and not
// only the Storybook build.
import { composeStories, type composeStory } from '@storybook/react-vite';
import { render } from '@testing-library/react';
import { describe, expect, it } from 'vite-plus/test';

import preview from '../.storybook/preview';

type StoryModule = Parameters<typeof composeStories>[0];
type ComposedStory = ReturnType<typeof composeStory>;

const modules = import.meta.glob<StoryModule>('./**/*.stories.tsx', { eager: true });

describe.each(Object.entries(modules))('%s', (_, module) => {
    const stories: [string, ComposedStory][] = Object.entries(composeStories(module, preview));

    it.each(stories)('%s renders', async (_, Story) => {
        const { container } = render(<Story />);

        await Story.play?.({ canvasElement: container });
        expect(container).not.toBeEmptyDOMElement();
    });
});
