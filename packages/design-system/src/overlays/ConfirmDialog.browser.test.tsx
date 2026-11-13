import '../styles.css';

import { composeStories } from '@storybook/react-vite';
import { render, screen } from '@testing-library/react';
import { expect, it } from 'vite-plus/test';
import { page } from 'vite-plus/test/browser/context';

import { DesignSystemProvider } from '../foundations/DesignSystemProvider';
import * as stories from './ConfirmDialog.stories';

const { ThreeChoices, UnbrokenName } = composeStories(stories);

it('stacks narrow confirmation choices in safe-answer order and keeps them together on desktop', async () => {
    await page.viewport(390, 844);
    render(
        <DesignSystemProvider>
            <ThreeChoices />
        </DesignSystemProvider>,
    );

    const dialog = await screen.findByRole('alertdialog');
    const buttons = [...dialog.querySelectorAll<HTMLButtonElement>('[data-slot="modal-footer"] button')];
    const boxes = () => buttons.map((button) => button.getBoundingClientRect());

    await expect.poll(() => document.activeElement).toBe(buttons[0]);
    expect(boxes()[1]!.top).toBeGreaterThan(boxes()[0]!.bottom);
    expect(boxes()[2]!.top).toBeGreaterThan(boxes()[1]!.bottom);
    expect(boxes().map((box) => box.width)).toEqual([boxes()[0]!.width, boxes()[0]!.width, boxes()[0]!.width]);

    await page.viewport(1440, 900);
    await expect.poll(() => new Set(boxes().map((box) => box.top)).size).toBe(1);
});

it('contains an unbroken title and consequence at the smallest supported width', async () => {
    await page.viewport(320, 844);
    render(
        <DesignSystemProvider>
            <UnbrokenName />
        </DesignSystemProvider>,
    );

    const dialog = await screen.findByRole('alertdialog');
    const heading = dialog.querySelector<HTMLElement>('header h2')!;

    expect(heading.scrollWidth).toBeLessThanOrEqual(heading.clientWidth);
    expect(dialog.scrollWidth).toBeLessThanOrEqual(dialog.clientWidth);
});
