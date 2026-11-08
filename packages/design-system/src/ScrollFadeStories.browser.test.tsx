// Every scroller in every story, measured in a real layout engine: wherever content runs past a scrolling edge, the
// region's computed mask fades that edge. A region that is the page itself, or a single wide figure, says so with
// `data-scroll-fade="exempt"` and its reason beside it in the component.
import { composeStories, type composeStory } from '@storybook/react-vite';
import { render } from '@testing-library/react';
import { describe, expect, it } from 'vite-plus/test';

import preview from '../.storybook/preview';
import * as drawerStories from './overlays/Drawer.stories';
import * as modalStories from './overlays/Modal.stories';

type StoryModule = Parameters<typeof composeStories>[0];
type ComposedStory = ReturnType<typeof composeStory>;

const modules = import.meta.glob<StoryModule>('./**/*.stories.tsx', { eager: true });

const scrolls = (value: string) => value === 'auto' || value === 'scroll';
const frame = () => new Promise<void>((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));

/** The regions that scroll past an edge without a fading mask along that axis. */
function hardCuts() {
    return [...document.body.querySelectorAll<HTMLElement>('*')].flatMap((element) => {
        if (element.closest('[data-scroll-fade="exempt"]') || element.matches('textarea, pre, code, pre *')) return [];

        const style = getComputedStyle(element);
        const mask = style.maskImage || style.webkitMaskImage;
        const cut = [
            scrolls(style.overflowY) &&
            element.scrollHeight > element.clientHeight + 1 &&
            !/to bottom|linear-gradient\((?!to right|90deg)/.test(mask)
                ? 'vertical'
                : null,
            scrolls(style.overflowX) && element.scrollWidth > element.clientWidth + 1 && !/to right|90deg/.test(mask)
                ? 'horizontal'
                : null,
        ].filter(Boolean);

        return cut.length
            ? [
                  `${cut.join('+')} (${element.scrollWidth}x${element.scrollHeight} in ${element.clientWidth}x${element.clientHeight}): <${element.tagName.toLowerCase()} class="${element.className}">`.slice(
                      0,
                      220,
                  ),
              ]
            : [];
    });
}

describe.each(Object.entries(modules))('%s', (_, module) => {
    const stories: [string, ComposedStory][] = Object.entries(composeStories(module, preview));

    it.each(stories)('%s fades every edge it scrolls past', async (_, Story) => {
        const { container } = render(<Story />);

        await Story.play?.({ canvasElement: container });
        await document.fonts.ready;
        await frame();

        expect(hardCuts()).toEqual([]);
    });
});

/** Where the body's computed mask turns from opaque to its bottom fade, in px from the bottom edge. */
const bottomFade = (element: HTMLElement) =>
    Number(/calc\(100% - ([\d.]+)px\)/.exec(getComputedStyle(element).maskImage)?.[1] ?? Number.NaN);

/** Where the body's computed mask turns opaque after its top fade, in px from the top edge. */
const topFade = (element: HTMLElement) =>
    Number(
        /^linear-gradient\([^,]+\([^)]*\), rgb\(0, 0, 0\) ([\d.]+)px/.exec(getComputedStyle(element).maskImage)?.[1] ??
            Number.NaN,
    );

const bodies = [
    ['Modal LongContent', composeStories(modalStories).LongContent, '[data-slot="modal-body"]'],
    ['Modal OverflowingPaned', composeStories(modalStories).OverflowingPaned, '[data-slot="modal-body"]'],
    ['Drawer LongContent', composeStories(drawerStories).LongContent, '[data-slot="drawer-body"]'],
] as const;

// A dialog's body ends at the frame or the footer: its last row dissolves over 3rem there, never a row sliced by the
// edge, which a 1.5rem fade still read as.
it.each(bodies)('%s dissolves its last row over 3rem at the bottom edge', async (_, Story, selector) => {
    const { container } = render(<Story />);

    await Story.play?.({ canvasElement: container });
    await expect.poll(() => document.querySelector<HTMLElement>(selector)?.dataset.scrollFade).toBe('overflow');

    expect(bottomFade(document.querySelector<HTMLElement>(selector)!)).toBe(48);
});

// Under the header the same: once the body has scrolled, the row cut by the header dissolves over 3rem; unscrolled,
// the first row shows whole.
it.each(bodies)('%s dissolves the row under its header over 3rem once scrolled', async (_, Story, selector) => {
    const { container } = render(<Story />);

    await Story.play?.({ canvasElement: container });
    await expect.poll(() => document.querySelector<HTMLElement>(selector)?.dataset.scrollFade).toBe('overflow');

    const body = document.querySelector<HTMLElement>(selector)!;

    expect(topFade(body)).toBe(0);
    body.scrollTop = 200;
    await expect.poll(() => topFade(body)).toBe(48);
});
