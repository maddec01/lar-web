// The board's base styles sit in Tailwind's base layer where a component's own utilities must win over them.

import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { expect, test } from 'vite-plus/test';

const base = readFileSync(join(import.meta.dirname, 'base.css'), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
const baseLayer = base.match(/@layer base \{([\s\S]*?)\n\}/)?.[1] ?? '';

test("the board takes the design system's one focus ring rather than a focus rule of its own", () => {
    const theme = readFileSync(join(import.meta.dirname, '../foundations/theme.css'), 'utf8');

    expect(base).not.toMatch(/:focus-visible/);
    expect(theme).toMatch(/@layer base \{\s*:where\(:focus-visible\) \{/);
});

test("the board's link rules sit in the base layer, so a link styled as a button keeps its button's colours", () => {
    expect(baseLayer).toMatch(/^\s*a \{\s*color: inherit;/m);
});

test('the board.css entry imports the theme and every board sheet', () => {
    const entry = readFileSync(join(import.meta.dirname, '../board.css'), 'utf8');

    for (const sheet of [
        'foundations/theme.css',
        'board/tokens.css',
        'board/base.css',
        'board/title-bar.css',
        'feedback/app-splash.css',
        'board/items.css',
        'board/rows.css',
    ])
        expect(entry).toContain(`@import './${sheet}';`);
});

test('reduced motion stops both status spin and pulse without hiding their icons', () => {
    const reduced = base.match(/@media \(prefers-reduced-motion: reduce\) \{\s*\.status-spin([\s\S]*?)\n\}/)?.[1] ?? '';

    expect(reduced).toMatch(/\.status-pulse[^}]*animation: none/);
    expect(reduced).toMatch(/^[^}]*animation: none/);
    expect(reduced).not.toMatch(/display:|visibility:|opacity:/);
});
