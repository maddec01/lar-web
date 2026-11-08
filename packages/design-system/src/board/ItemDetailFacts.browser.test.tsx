import '../board.css';

import { composeStories } from '@storybook/react-vite';
import { render } from '@testing-library/react';
import { expect, it } from 'vite-plus/test';
import { page } from 'vite-plus/test/browser/context';

import * as stories from './ItemDetails.stories';

const { KindDisagreement } = composeStories(stories);

it.each([1440, 390])('keeps kind disagreement below every fact on a full-width row at %ipx', async (width) => {
    await page.viewport(width, 900);

    for (const theme of ['light', 'dark']) {
        document.documentElement.className = theme;

        const { container, unmount } = render(<KindDisagreement />);
        const facts = container.querySelector('[data-meta-facts]')!;
        const notice = facts.nextElementSibling!;
        const factBox = facts.getBoundingClientRect();
        const noticeBox = notice.getBoundingClientRect();

        expect(noticeBox.top).toBeGreaterThan(factBox.bottom);
        expect(noticeBox.width).toBeCloseTo(factBox.width, 0);
        expect(noticeBox.left).toBeCloseTo(factBox.left, 0);
        expect(notice.scrollWidth).toBeLessThanOrEqual(notice.clientWidth);
        expect(document.documentElement.scrollWidth).toBeLessThanOrEqual(width);
        unmount();
    }
});
