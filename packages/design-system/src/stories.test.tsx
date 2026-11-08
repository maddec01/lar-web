// Markup smoke tests in jsdom. CSS and both themes (including contrast) are tested in stories.browser.test.tsx.
import { composeStories, type composeStory } from '@storybook/react-vite';
import { render } from '@testing-library/react';
import axe from 'axe-core';
import { describe, expect, it } from 'vite-plus/test';

import preview from '../.storybook/preview';

type StoryModule = Parameters<typeof composeStories>[0];
type ComposedStory = ReturnType<typeof composeStory>;

const modules = import.meta.glob<StoryModule>('./**/*.stories.tsx', { eager: true });

/** Rules about a whole page (its title, language, landmarks, a skip link), which a story is not. */
const pageRules = ['document-title', 'html-has-lang', 'html-lang-valid', 'bypass', 'landmark-one-main', 'region'];

const axeOptions: axe.RunOptions = {
    runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'] },
    rules: Object.fromEntries(['color-contrast', ...pageRules].map((rule) => [rule, { enabled: false }])),
    resultTypes: ['violations'],
};

/** The story's own a11y parameters may switch rules off, each with its reason beside it in the story. */
function storyRules(story: ComposedStory): axe.RunOptions['rules'] {
    const rules = (story.parameters as { a11y?: { config?: { rules?: { id: string; enabled: boolean }[] } } }).a11y
        ?.config?.rules;

    return Object.fromEntries((rules ?? []).map(({ id, enabled }) => [id, { enabled }]));
}

async function violations(story: ComposedStory) {
    const { violations } = await axe.run(document.body, {
        ...axeOptions,
        rules: { ...axeOptions.rules, ...storyRules(story) },
    });

    return violations.map(
        ({ id, nodes }) =>
            `${id}: ${nodes.map((node) => node.target.join(' ') + ' ' + node.failureSummary).join('; ')}`,
    );
}

describe.each(Object.entries(modules))('%s', (_, module) => {
    const stories: [string, ComposedStory][] = Object.entries(composeStories(module, preview));

    it.each(stories)('%s renders and passes markup axe', async (_, Story) => {
        const { container } = render(<Story />);

        await Story.play?.({ canvasElement: container });
        expect(container).not.toBeEmptyDOMElement();

        expect(await violations(Story)).toEqual([]);
    });
});
