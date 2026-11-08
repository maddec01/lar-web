import '../styles.css';

import { render } from '@testing-library/react';
import { expect, it } from 'vite-plus/test';
import { page, userEvent } from 'vite-plus/test/browser/context';

import { DesignSystemProvider } from '../foundations/DesignSystemProvider';
import { Select, SelectItem } from './Select';

it('grows the list past a narrow trigger to its longest option, without clipping a label', async () => {
    render(
        <div style={{ width: '4.5rem' }}>
            <Select aria-label="Kind" defaultValue="bug">
                <SelectItem value="bug">Bug</SelectItem>
                <SelectItem value="improvement">Improvement</SelectItem>
                <SelectItem value="feature">Feature request from a customer</SelectItem>
            </Select>
        </div>,
    );

    await page.getByRole('combobox', { name: 'Kind' }).click();

    await expect.poll(() => document.querySelector('[role="listbox"]')).not.toBeNull();

    const trigger = document.querySelector<HTMLElement>('[role="combobox"]')!;
    const list = document.querySelector<HTMLElement>('[role="listbox"]')!;

    expect(list.getBoundingClientRect().width).toBeGreaterThan(trigger.getBoundingClientRect().width);

    for (const option of document.querySelectorAll<HTMLElement>('[role="option"]')) {
        expect(option.scrollWidth).toBeLessThanOrEqual(option.clientWidth);
        expect(option.getBoundingClientRect().right).toBeLessThanOrEqual(list.getBoundingClientRect().right);
    }
});

it('shows eight rows at most and opens below a trigger low in a dialog-sized window', async () => {
    await page.viewport(1280, 900);
    render(
        <DesignSystemProvider>
            <div style={{ paddingTop: '520px', width: '16rem' }}>
                <Select aria-label="Storage limit" defaultValue="32">
                    {Array.from({ length: 14 }, (_, index) => (
                        <SelectItem key={index} value={String(2 ** index)}>{`${2 ** index} GiB`}</SelectItem>
                    ))}
                </Select>
            </div>
        </DesignSystemProvider>,
    );

    await page.getByRole('combobox', { name: 'Storage limit' }).click();

    await expect.poll(() => document.querySelector('[role="listbox"]')).not.toBeNull();

    const trigger = document.querySelector<HTMLElement>('[role="combobox"]')!.getBoundingClientRect();
    const list = document.querySelector<HTMLElement>('[role="listbox"]')!.getBoundingClientRect();
    const row = document.querySelector<HTMLElement>('[role="option"]')!.getBoundingClientRect().height;

    expect(list.height).toBeLessThanOrEqual(row * 8 + 12);
    expect(list.top).toBeGreaterThanOrEqual(trigger.bottom);
});

it.each(['14', '28'])('opens scrolled to %s on a whole row below the scroll control', async (value) => {
    render(
        <Select aria-label="Days to keep logs" defaultValue={value}>
            {Array.from({ length: 30 }, (_, index) => (
                <SelectItem key={index} value={String(index + 1)}>
                    {index + 1} days
                </SelectItem>
            ))}
        </Select>,
    );
    await page.getByRole('combobox', { name: 'Days to keep logs' }).click();

    const viewport = () => document.querySelector<HTMLElement>('[data-radix-select-viewport]')!;
    const wholeFirstRow = () => {
        const box = viewport().getBoundingClientRect();
        const rows = [...document.querySelectorAll<HTMLElement>('[role="option"]')];
        const first = rows.find((row) => row.getBoundingClientRect().bottom > box.top + 1)!;

        return first.getBoundingClientRect().top >= box.top - 1;
    };

    await expect.poll(() => viewport()?.scrollTop).toBeGreaterThan(0);
    await expect.poll(wholeFirstRow).toBe(true);

    const selected = document.querySelector<HTMLElement>('[role="option"][data-state="checked"]')!;
    const box = viewport().getBoundingClientRect();

    expect(selected.getBoundingClientRect().top).toBeGreaterThanOrEqual(box.top);
    expect(selected.getBoundingClientRect().bottom).toBeLessThanOrEqual(box.bottom);
    await userEvent.keyboard('{ArrowUp}{ArrowUp}');
    await expect.poll(wholeFirstRow).toBe(true);
});
