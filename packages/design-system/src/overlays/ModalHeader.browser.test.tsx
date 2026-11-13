import '../styles.css';

import { composeStories } from '@storybook/react-vite';
import { render, screen } from '@testing-library/react';
import { expect, it } from 'vite-plus/test';
import { page } from 'vite-plus/test/browser/context';

import { DesignSystemProvider } from '../foundations/DesignSystemProvider';
import * as stories from './Modal.stories';

const { WrappingWorkspaceTitle, UnbrokenWorkspaceTitle } = composeStories(stories);

it.each([320, 390, 768, 1440])('keeps the full title, details and controls separate at %ipx', async (width) => {
    await page.viewport(width, 900);
    render(
        <DesignSystemProvider>
            <WrappingWorkspaceTitle />
        </DesignSystemProvider>,
    );

    const dialog = await screen.findByRole('dialog');
    const header = dialog.querySelector<HTMLElement>('header')!;
    const title = header.querySelector<HTMLElement>('h2 > span')!;
    const expand = header.querySelector<HTMLElement>('[data-expand]')!;
    const details = header.querySelector<HTMLElement>('p')!;
    const box = (element: Element) => element.getBoundingClientRect();

    await expect.poll(() => box(expand).top).toBeLessThan(box(title).bottom);
    expect(box(title).right).toBeLessThanOrEqual(box(expand).left);
    expect(box(details).top).toBeGreaterThanOrEqual(box(title).bottom);
    expect(title.scrollWidth).toBeLessThanOrEqual(title.clientWidth);
    expect(title.scrollHeight).toBeLessThanOrEqual(title.clientHeight);
    expect(header.scrollHeight).toBeLessThanOrEqual(header.clientHeight);
    expect(dialog.scrollWidth).toBeLessThanOrEqual(dialog.clientWidth);
});

it.each([390, 1440])('keeps a long unbroken title contained before and after expanding at %ipx', async (width) => {
    await page.viewport(width, 900);
    render(
        <DesignSystemProvider>
            <UnbrokenWorkspaceTitle />
        </DesignSystemProvider>,
    );

    const dialog = await screen.findByRole('dialog');
    const title = dialog.querySelector<HTMLElement>('header h2 > span')!;
    const expand = dialog.querySelector<HTMLButtonElement>('[data-expand]')!;

    expect(title.scrollWidth).toBeLessThanOrEqual(title.clientWidth);
    expect(title.scrollHeight).toBeLessThanOrEqual(title.clientHeight);
    expand.click();
    await expect.poll(() => dialog.hasAttribute('data-expanded')).toBe(true);
    expect(title.scrollWidth).toBeLessThanOrEqual(title.clientWidth);
    expect(dialog.scrollWidth).toBeLessThanOrEqual(dialog.clientWidth);
});
