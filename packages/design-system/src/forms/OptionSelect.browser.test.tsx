import '../styles.css';

import { render, screen } from '@testing-library/react';
import { expect, it } from 'vite-plus/test';
import { page } from 'vite-plus/test/browser/context';

import { DesignSystemProvider } from '../foundations/DesignSystemProvider';
import { OptionSelect } from './OptionSelect';
import { SettingsRow } from './SettingsRow';

const options = [
    { value: 'sol', label: 'Codex · Personal GPT-6.1 Sol' },
    { value: 'long', label: 'Codex · Personal GPT-6.1 Sol with an extended context window' },
];

const picker = (label: string, value = 'sol') => (
    <OptionSelect label={label} presentation="setting" value={value} options={options} onChange={() => {}} />
);
const width = (element: Element) => element.getBoundingClientRect().width;
const labelOf = (element: Element) => element.firstElementChild as HTMLElement;

it('lets a wide settings row widen the setting select and show its long selected label', async () => {
    await page.viewport(1280, 900);
    render(
        <DesignSystemProvider>
            <div style={{ width: 768 }}>
                <SettingsRow label="Default">{picker('Default')}</SettingsRow>
                <SettingsRow label="Wide" controlWidth="wide">
                    {picker('Wide')}
                </SettingsRow>
            </div>
            {picker('Standalone')}
        </DesignSystemProvider>,
    );

    const normal = screen.getByRole('combobox', { name: 'Default' });
    const wide = screen.getByRole('combobox', { name: 'Wide' });
    const standalone = screen.getByRole('combobox', { name: 'Standalone' });

    await expect.poll(() => width(wide)).toBe(320);
    expect(width(normal)).toBe(208);
    expect(width(standalone)).toBe(208);
    // The wrapper must grow too: otherwise it constrains (or overflows under) the wide trigger.
    expect(width(wide.parentElement!)).toBe(320);
    expect(labelOf(wide).scrollWidth).toBeLessThanOrEqual(labelOf(wide).clientWidth);
});

it('shrinks wide setting selects to their available column and truncates without overflowing narrow rows', async () => {
    await page.viewport(1280, 900);

    const row = (rowWidth: number) => (
        <DesignSystemProvider>
            <div style={{ width: rowWidth }}>
                <SettingsRow label="Model" controlWidth="wide">
                    {picker('Model', 'long')}
                </SettingsRow>
            </div>
        </DesignSystemProvider>
    );
    const { rerender } = render(row(500));
    const trigger = screen.getByRole('combobox', { name: 'Model' });
    const column = trigger.closest<HTMLElement>('[data-slot="settings-row-control"]')!;
    const fits = () => trigger.getBoundingClientRect().right <= column.getBoundingClientRect().right + 1;

    await expect.poll(() => width(trigger) < 320 && fits()).toBe(true);
    expect(labelOf(trigger).scrollWidth).toBeGreaterThan(labelOf(trigger).clientWidth);

    await page.viewport(320, 844);
    rerender(row(288));
    await expect.poll(() => width(trigger)).toBe(width(column));
    expect(fits()).toBe(true);
    expect(trigger.getBoundingClientRect().right).toBeLessThanOrEqual(320);
    expect(document.documentElement.scrollWidth).toBeLessThanOrEqual(320);
    expect(labelOf(trigger).scrollWidth).toBeGreaterThan(labelOf(trigger).clientWidth);
    expect(getComputedStyle(labelOf(trigger)).textOverflow).toBe('ellipsis');
});
