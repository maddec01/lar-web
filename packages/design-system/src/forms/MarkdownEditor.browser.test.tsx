import '../styles.css';

import { render } from '@testing-library/react';
import { expect, it } from 'vite-plus/test';

import { TooltipProvider } from '../overlays/Tooltip';
import { MarkdownEditor } from './MarkdownEditor';

const long = Array.from({ length: 60 }, (_, index) => `Paragraph ${index + 1} of a long description.`).join('\n\n');
const mask = (element: Element) => getComputedStyle(element).maskImage || getComputedStyle(element).webkitMaskImage;
const area = () => document.querySelector<HTMLElement>('[data-description-area]')!;
const caretLine = () => {
    const range = getSelection()!.getRangeAt(0).cloneRange();

    range.collapse(false);

    return range.getClientRects()[0] ?? range.getBoundingClientRect();
};

it('fades its overflowing text area under a toolbar that stays visible', async () => {
    render(<MarkdownEditor label="Description" placeholder="Describe the work" value={long} onChange={() => {}} />, {
        wrapper: TooltipProvider,
    });

    await expect.poll(() => area().dataset.scrollFade).toBe('overflow');

    const region = area();
    const toolbar = document.querySelector('[data-description-editor] [role="toolbar"]')!;

    expect(region.contains(toolbar)).toBe(false);
    expect(toolbar.getBoundingClientRect().bottom).toBeLessThanOrEqual(region.getBoundingClientRect().top + 1);
    expect(mask(region)).toContain('linear-gradient');
    expect(Number.parseFloat(region.style.getPropertyValue('--scroll-fade-bottom'))).toBeGreaterThan(0);
    expect(region.style.getPropertyValue('--scroll-fade-top')).toBe('0px');
});

it('keeps the caret line clear of the fade while text continues below', async () => {
    render(<MarkdownEditor label="Description" placeholder="Describe the work" value={long} onChange={() => {}} />, {
        wrapper: TooltipProvider,
    });

    await expect.poll(() => area().dataset.scrollFade).toBe('overflow');

    const region = area();
    const view = region.getBoundingClientRect();
    // The paragraph whose line sits under the bottom fade at the top of the scroll.
    const under = [...region.querySelectorAll('p')].find((p) => {
        const { bottom } = p.getBoundingClientRect();

        return bottom > view.bottom - 24 && bottom <= view.bottom;
    })!;

    expect(under).toBeDefined();
    region.querySelector<HTMLElement>('[contenteditable]')!.focus();

    const range = document.createRange();

    range.setStart(under.firstChild!.firstChild!, 5);
    getSelection()!.removeAllRanges();
    getSelection()!.addRange(range);

    await expect.poll(() => caretLine().bottom).toBeLessThanOrEqual(region.getBoundingClientRect().bottom - 24 + 1);
    expect(region.scrollTop).toBeGreaterThan(0);
    expect(Number.parseFloat(region.style.getPropertyValue('--scroll-fade-bottom'))).toBeGreaterThan(0);
    expect(mask(region)).toContain('linear-gradient');
});
