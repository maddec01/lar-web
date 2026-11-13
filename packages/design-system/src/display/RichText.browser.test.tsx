import '../styles.css';

import { composeStories } from '@storybook/react-vite';
import { render } from '@testing-library/react';
import { expect, it } from 'vite-plus/test';
import { page } from 'vite-plus/test/browser/context';

import * as stories from './RichText.stories';

const { LongTokensInGrid } = composeStories(stories);

it.each([390, 800, 1440])(
    'keeps proof paths, inline hashes and code inside an auto-sized grid at %ipx',
    async (width) => {
        await page.viewport(width, 844);

        const { container } = render(<LongTokensInGrid />);
        const grid = container.firstElementChild!;
        const right = grid.getBoundingClientRect().right;

        for (const element of grid.querySelectorAll<HTMLElement>('div, p, pre')) {
            expect(element.getBoundingClientRect().right).toBeLessThanOrEqual(right);
            expect(element.scrollWidth).toBeLessThanOrEqual(element.clientWidth);
        }
    },
);
