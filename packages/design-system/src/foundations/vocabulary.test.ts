// Components speak the semantic layer (tokens.ts), never the primitives under it: no base-ramp utility (text-base-700,
// bg-base-200), no per-component dark: colour override (the semantic tokens already change with the theme) and no
// colour mixed in place with color-mix() (a mix that a component needs is a token, with its contrast checked). The
// board's role colours (board/tokens.css) colour glyphs, dots and bars, never text. Each rule fails on a new use
// unless the allow-list below names it with its reason.
import { readdirSync, readFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import { expect, it } from 'vite-plus/test';

const src = join(import.meta.dirname, '..');

/** Every component and story outside the foundations, and every product layer's sheet (read from disk: the test
 *  runner hands a stylesheet's import back empty). */
const sources = [
    ...Object.entries(
        import.meta.glob<string>(['../**/*.{ts,tsx}', '!./**', '!../**/*.test.{ts,tsx}'], {
            query: '?raw',
            import: 'default',
            eager: true,
        }),
    ).map(([path, text]) => [relative(src, join(import.meta.dirname, path)), text] as const),
    ...readdirSync(src, { recursive: true, encoding: 'utf8' })
        .filter((file) => file.endsWith('.css') && !file.startsWith('foundations/'))
        .map((file) => [file, readFileSync(join(src, file), 'utf8')] as const),
];

/** Genuine exceptions, by file: none today. */
const allowed: Record<string, string[]> = {};

const rules = {
    'a base-ramp primitive':
        /(?<![\w-])(?:[\w[\]&>=*@/.()'-]+:)*[\w-]*-base-(?:content|\d+)(?:\/\d+)?(?![\w-])|--color-base-[\w-]+/g,
    'a dark: colour override':
        /(?<![\w-])(?:[\w[\]@-]+:)*dark:(?:[\w[\]@=&>-]+:)*(?:bg|text|border|ring|outline|fill|stroke|divide|from|via|to|shadow|decoration|placeholder|caret|accent)-[\w[\]()/.,%#-]+/g,
    'a colour mixed in place': /color-mix\(/g,
    // A tone's edge or tint is a token (--color-{tone}-edge, -ring, -surface), never the hue at an alpha of the moment.
    'a status hue at an ad-hoc alpha':
        /(?<![\w-])(?:[\w[\]&>=*@-]+:)*[\w-]+-(?:primary|success|warning|danger|info)\/(?:\d+|\[[^\]]+\])(?![\w-])/g,
    'a board role colour on text': /(?<![\w-])(?:[\w[\]&>=*@-]+:)*text-(?:board-[\w-]+|\(--color-board-[\w-]+\))/g,
} as const;

it('reads every component and sheet', () => {
    expect(sources.map(([file]) => file)).toEqual(expect.arrayContaining(['actions/Button.tsx', 'board/tokens.css']));
});

it.each(Object.entries(rules))('no component uses %s', (_, pattern) => {
    const found = sources.flatMap(([file, text]) =>
        // Product sheets may mix colours (that is where a role is derived): the rule against color-mix() is for TS.
        file.endsWith('.css') && pattern === rules['a colour mixed in place']
            ? []
            : [...text.matchAll(pattern)]
                  .map(([match]) => match)
                  .filter((match) => !allowed[file]?.includes(match))
                  .map((match) => `${file}: ${match}`),
    );

    expect(found).toEqual([]);
});
