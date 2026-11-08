import '../styles.css';

import { composeStories } from '@storybook/react-vite';
import { render, screen } from '@testing-library/react';
import { expect, it } from 'vite-plus/test';
import { page } from 'vite-plus/test/browser/context';

import { DesignSystemProvider } from '../foundations/DesignSystemProvider';
import * as stories from './TimeSeriesChart.stories';

const { Cpu } = composeStories(stories);

const sources = import.meta.glob<string>(['../**/*.tsx', '!../**/*.test.tsx'], {
    query: '?raw',
    import: 'default',
    eager: true,
});

it.each([1440, 390])('takes no more room than its card at %i px, readings table included', async (width) => {
    await page.viewport(width, 900);
    render(
        <DesignSystemProvider>
            <Cpu />
        </DesignSystemProvider>,
    );

    const figure = screen.getByRole('figure');
    const table = screen.getByRole('table', { hidden: true });

    // The 60-row readings table is there for screen readers but lays out in a 1px box: neither the card nor the page
    // scrolls past the chart.
    expect(table.closest('figure')).toBe(figure);
    expect(figure.scrollHeight).toBeLessThanOrEqual(Math.ceil(figure.getBoundingClientRect().height));
    expect(table.parentElement!.getBoundingClientRect().height).toBeLessThanOrEqual(1);
    expect(document.documentElement.scrollHeight).toBeLessThanOrEqual(
        Math.max(window.innerHeight, Math.ceil(figure.getBoundingClientRect().bottom + 64)),
    );
});

it('reads its scale off the top gridline and the baseline', async () => {
    await page.viewport(1440, 900);
    render(
        <DesignSystemProvider>
            <Cpu />
        </DesignSystemProvider>,
    );

    const plot = screen.getByRole('group', { name: 'CPU' }).getBoundingClientRect();
    const top = screen.getByText('100%').getBoundingClientRect();
    const zero = screen.getByText('0%').getBoundingClientRect();
    const centre = (box: DOMRect) => box.top + box.height / 2;

    // The gridlines sit at 5% and 95% of the plot; each label centres on its line, beside the plot.
    expect(Math.abs(centre(top) - (plot.top + plot.height * 0.05))).toBeLessThanOrEqual(1);
    expect(Math.abs(centre(zero) - (plot.top + plot.height * 0.95))).toBeLessThanOrEqual(1);
    expect(top.left).toBeGreaterThanOrEqual(plot.right);
});

it('no component hides a table element with sr-only, which a table ignores', () => {
    const tableTags = /<(?:table|caption|thead|tbody|tfoot|tr|th|td)\b[^>]*className="[^"]*\bsr-only\b/g;
    const found = Object.entries(sources).flatMap(([path, text]) =>
        [...text.matchAll(tableTags)].map(([match]) => `${path}: ${match}`),
    );

    expect(found).toEqual([]);
});
