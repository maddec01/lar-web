// The colour layer's integrity: theme.css sets each semantic colour as tokens.ts lists it, every pair tokens.ts names
// reaches its contrast in both themes (an alpha colour composited over its theme's page), each status's fill is its
// hue (one status source), the glass ladder matches tokens.ts, and no component reads a custom property that nothing
// defines.
import { readFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import { expect, it } from 'vite-plus/test';

import { glassTiers, nonTextPairs, type SemanticColor, semanticColors, textPairs } from './tokens';

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

function resolve(env: Declarations, name: string): string | undefined {
    const value = env[name];
    const reference = value?.match(/^var\((--[\w-]+)\)$/);

    return reference ? resolve(env, reference[1]!) : value?.toLowerCase();
}

const channel = (hex: string, index: number) => {
    const value = Number.parseInt(hex.slice(1 + index * 2, 3 + index * 2), 16) / 255;

    return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
};
const luminance = (hex: string) => 0.2126 * channel(hex, 0) + 0.7152 * channel(hex, 1) + 0.0722 * channel(hex, 2);
/** A colour with an alpha (#rrggbbaa) as it shows over an opaque one. */
const over = (hex: string, under: string) => {
    if (hex.length !== 9) return hex;

    const alpha = Number.parseInt(hex.slice(7, 9), 16) / 255;

    return `#${[0, 1, 2]
        .map((index) => {
            const [top, bottom] = [hex, under].map((value) =>
                Number.parseInt(value.slice(1 + index * 2, 3 + index * 2), 16),
            );

            return Math.round(top! * alpha + bottom! * (1 - alpha))
                .toString(16)
                .padStart(2, '0');
        })
        .join('')}`;
};
const contrast = (a: string, b: string, page: string) => {
    const back = over(b, page);
    const [high, low] = [luminance(over(a, back)), luminance(back)].sort((x, y) => y - x);

    return (high! + 0.05) / (low! + 0.05);
};

it('sets every semantic colour as tokens.ts lists it, and each listed pair reaches its contrast, in both themes', () => {
    const problems = (
        [
            ['light', light],
            ['dark', dark],
        ] as const
    ).flatMap(([mode, env]) => {
        const value = (name: SemanticColor) => semanticColors[name][mode];
        const page = value('surface-page');

        return [
            ...(Object.keys(semanticColors) as SemanticColor[])
                .filter((name) => resolve(env, `--color-${name}`) !== value(name))
                .map((name) => `${mode}: --color-${name} is ${resolve(env, `--color-${name}`)}, not ${value(name)}`),
            ...[
                ...textPairs.map(([fg, bg]) => ({ fg, bg, floor: 4.5 })),
                ...nonTextPairs.map(([fg, bg]) => ({ fg, bg, floor: 3 })),
            ]
                .filter(({ fg, bg, floor }) => contrast(value(fg), value(bg), page) < floor)
                .map(({ fg, bg, floor }) => `${mode}: ${fg} on ${bg} is below ${floor}:1`),
        ];
    });

    expect(problems).toEqual([]);
});

it('draws each status from one source: its solid fill is its hue, in both themes', () => {
    const disagreements = (['success', 'warning', 'danger', 'info'] as const).flatMap((status) =>
        (['light', 'dark'] as const)
            .filter((mode) => semanticColors[`${status}-fill`][mode] !== semanticColors[status][mode])
            .map((mode) => `${mode}: ${status}-fill is not ${status}`),
    );

    expect(disagreements).toEqual([]);
});

it('sets the glass ladder as tokens.ts lists it', () => {
    const problems = (['light', 'dark'] as const).flatMap((mode) => {
        const env = mode === 'light' ? light : dark;

        return (['bar', 'menu', 'dialog', 'zone'] as const).flatMap((tier) => {
            const { tint, alpha } = glassTiers[tier][mode];
            // The zone sits under the dialog's own blur.
            const blur = tier === 'zone' ? '--lar-glass-dialog-blur' : `--lar-glass-${tier}-blur`;

            return [
                [`--lar-glass-${tier}-tint`, resolve(env, `--lar-glass-${tier}-tint`), tint],
                [`--lar-glass-${tier}-alpha`, env[`--lar-glass-${tier}-alpha`], alpha],
                [blur, env[blur], glassTiers[tier].blur],
            ]
                .filter(([, actual, expected]) => actual !== expected)
                .map(([name, actual, expected]) => `${mode}: ${name} is ${actual}, not ${expected}`);
        });
    });

    expect(problems).toEqual([]);
});

/** Every generic source (not a test). */
const generic = Object.entries(
    import.meta.glob<string>(['../**/*.{ts,tsx}', '!../**/*.test.{ts,tsx}'], {
        query: '?raw',
        import: 'default',
        eager: true,
    }),
).map(([path, text]) => [relative(src, join(import.meta.dirname, path)), text] as const);

/** What the foundations, Tailwind's theme and ninna-ui's define, and what a source sets itself (an inline style's
 *  `'--x':`, an arbitrary property's `[--x:…]` or a `setProperty('--x', …)`). */
const defined = new Set([
    ...Object.keys(declarations(theme)),
    ...Object.keys(declarations(read(join(src, '../node_modules/tailwindcss/theme.css')))),
    ...Object.keys(declarations(read(join(src, '../node_modules/@ninna-ui/core/dist/theme/tailwind.css')))),
    ...Object.keys(declarations(read(join(src, '../node_modules/@ninna-ui/core/dist/theme/presets/minimal.css')))),
    ...generic.flatMap(([, text]) => [...text.matchAll(/['"`[](--[\w-]+)['"`]?\s*[:,]/g)].map(([, name]) => name!)),
]);
/** Set at runtime by Radix (popover and menu sizes) and by Tailwind's own utilities. */
const runtime = /^--(radix|tw)-/;

it('no component reads a custom property that nothing defines', () => {
    const undefinedReads = generic.flatMap(([path, text]) =>
        [...text.matchAll(/(?:var\(|[\w\]:-]\()(--[\w-]+)/g)]
            .map(([, name]) => name!)
            .filter((name) => !defined.has(name) && !runtime.test(name))
            .map((name) => `${path}: ${name}`),
    );

    expect([...new Set(undefinedReads)]).toEqual([]);
});
