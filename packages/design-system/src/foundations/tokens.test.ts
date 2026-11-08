// The semantic colour layer: theme.css sets exactly the values tokens.ts lists, every text pair reaches WCAG AA and
// every control edge 3:1 in both themes, and no generic component reads a custom property the foundations don't set.
import { readFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import { describe, expect, it } from 'vite-plus/test';

import { nonTextPairs, type SemanticColor, semanticColors, textPairs } from './tokens';

const src = join(import.meta.dirname, '..');
const read = (path: string) => readFileSync(path, 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
const theme = read(join(import.meta.dirname, 'theme.css'));

type Declarations = Record<string, string>;

const declarations = (block: string): Declarations =>
    Object.fromEntries(
        [...block.matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)].map(([, name, value]) => [name, value!.trim()]),
    );

const block = (opening: string) => {
    const start = theme.indexOf(opening);

    if (start === -1) throw new Error(`theme.css has no ${opening}`);

    return theme.slice(start, theme.indexOf('}', start));
};

const themeBlocks = [...theme.matchAll(/@theme static \{([^}]*)\}/g)].map(([, body]) => declarations(body!));
const light: Declarations = Object.assign({}, ...themeBlocks, declarations(block('@utility lar-light-palette {')));
const dark: Declarations = { ...light, ...declarations(block('@utility lar-dark-palette {')) };

// No exceptions: all colour roles (including ninna-ui compatibility aliases) point straight at a fixed primitive.
// Check every declaration, not only the final cascade value, so an overridden raw colour cannot slip through.
it('every semantic colour declaration references one fixed palette primitive', () => {
    const primitives = new Set(Object.keys(declarations(theme)).filter((name) => name.startsWith('--color-palette-')));
    const aliases = [...theme.matchAll(/(--color-(?!palette-)[\w-]+)\s*:\s*([^;]+);/g)];

    expect(primitives.size).toBeGreaterThan(0);
    expect(aliases.length).toBeGreaterThan(Object.keys(semanticColors).length);

    for (const [, name, value] of aliases) {
        const reference = value!.trim().match(/^var\((--color-palette-[\w-]+)\)$/);

        expect(reference, `${name}: ${value}`).not.toBeNull();
        expect(primitives.has(reference![1]!), `${name} references a missing primitive`).toBe(true);
    }
});

function resolve(env: Declarations, name: string): string {
    const value = env[name];

    if (value === undefined) throw new Error(`${name} is not set`);

    const reference = value.match(/^var\((--[\w-]+)\)$/);

    return reference ? resolve(env, reference[1]!) : value.toLowerCase();
}

const channel = (hex: string, index: number) => {
    const value = Number.parseInt(hex.slice(1 + index * 2, 3 + index * 2), 16) / 255;

    return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
};
const luminance = (hex: string) => 0.2126 * channel(hex, 0) + 0.7152 * channel(hex, 1) + 0.0722 * channel(hex, 2);
const contrast = (a: string, b: string) => {
    const [high, low] = [luminance(a), luminance(b)].sort((x, y) => y - x);

    return (high! + 0.05) / (low! + 0.05);
};

describe.each([
    ['light', light],
    ['dark', dark],
] as const)('the %s theme', (mode, env) => {
    const value = (name: SemanticColor) => semanticColors[name][mode];

    it.each(Object.keys(semanticColors) as SemanticColor[])('sets --color-%s as tokens.ts lists it', (name) => {
        expect(resolve(env, `--color-${name}`)).toBe(value(name));
    });

    it.each(textPairs.map(([fg, bg]) => [fg, bg]))('%s on %s reaches 4.5:1', (fg, bg) => {
        expect(contrast(value(fg), value(bg))).toBeGreaterThanOrEqual(4.5);
    });

    it.each(nonTextPairs.map(([mark, bg]) => [mark, bg]))('%s on %s reaches 3:1', (mark, bg) => {
        expect(contrast(value(mark), value(bg))).toBeGreaterThanOrEqual(3);
    });
});

it.each(['primary', 'success', 'warning', 'danger', 'info'] as const)(
    'gives %s an edge stronger than its ring, in its own hue, in both themes',
    (tone) => {
        for (const mode of ['light', 'dark'] as const) {
            const edge = semanticColors[`${tone}-edge`][mode];
            const ring = semanticColors[`${tone}-ring`][mode];
            const alpha = (hex: string) => Number.parseInt(hex.slice(7, 9), 16);

            expect(edge.slice(0, 7)).toBe(semanticColors[tone][mode]);
            expect(ring.slice(0, 7)).toBe(semanticColors[tone][mode]);
            expect(alpha(edge)).toBeGreaterThan(alpha(ring));
        }
    },
);

it('sets no colour of its own outside the palette: the palettes only point at primitives', () => {
    const raw = [...theme.matchAll(/(--(?:lar|color)-(?!palette-)[\w-]+)\s*:\s*([^;]*(?:#|rgb\(|hsl\()[^;]*);/g)].map(
        ([, name]) => name,
    );

    expect(raw).toEqual([]);
});

/** Every source outside the product layers (board/, showcase/) and their tests. */
const generic = Object.entries(
    import.meta.glob<string>(['../**/*.{ts,tsx}', '!../board/**', '!../showcase/**', '!../**/*.test.{ts,tsx}'], {
        query: '?raw',
        import: 'default',
        eager: true,
    }),
).map(([path, text]) => [relative(src, join(import.meta.dirname, path)), text] as const);

/** What the foundations, Tailwind's theme and ninna-ui's define, and what a generic source sets itself (an inline
 *  style's `'--x':`, an arbitrary property's `[--x:…]` or a `setProperty('--x', …)`). */
const defined = new Set([
    ...Object.keys(declarations(theme)),
    ...Object.keys(declarations(read(join(src, '../node_modules/tailwindcss/theme.css')))),
    ...Object.keys(declarations(read(join(src, '../node_modules/@ninna-ui/core/dist/theme/tailwind.css')))),
    ...Object.keys(declarations(read(join(src, '../node_modules/@ninna-ui/core/dist/theme/presets/minimal.css')))),
    ...generic.flatMap(([, text]) => [...text.matchAll(/['"`[](--[\w-]+)['"`]?\s*[:,]/g)].map(([, name]) => name!)),
]);
/** Set at runtime by Radix (popover and menu sizes) and by Tailwind's own utilities. */
const runtime = /^--(radix|tw)-/;

it('no generic component reads a custom property the foundations do not define', () => {
    const leaks = generic.flatMap(([path, text]) =>
        [...text.matchAll(/(?:var\(|[\w\]:-]\()(--[\w-]+)/g)]
            .map(([, name]) => name!)
            .filter((name) => !defined.has(name) && !runtime.test(name))
            .map((name) => `${path}: ${name}`),
    );

    expect([...new Set(leaks)]).toEqual([]);
});
