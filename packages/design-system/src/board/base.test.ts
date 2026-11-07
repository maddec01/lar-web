// The board's base styles sit in Tailwind's base layer where a component's own utilities must win over them.

import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { expect, test } from 'vite-plus/test';

const base = readFileSync(join(import.meta.dirname, 'base.css'), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
const baseLayer = base.match(/@layer base \{([\s\S]*?)\n\}/)?.[1] ?? '';

test("the board's focus outline sits in the base layer, so a design-system control's outline-none wins", () => {
    expect(baseLayer).toMatch(/^\s*:focus-visible \{/m);
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
        'board/loading-screen.css',
        'board/button-kinds.css',
    ])
        expect(entry).toContain(`@import './${sheet}';`);
});
