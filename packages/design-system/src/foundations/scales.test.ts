// Sizes come from the scales in theme.css: the type steps (text-2xs…text-display), the spacing scale (p-2.75,
// max-w-160), the radii and the named container breakpoints (@pane, @split). An arbitrary length in a class, such as
// text-[13px] or @min-[40rem], fails here unless the allow-list below names it with its reason.
import { readdirSync, readFileSync } from 'node:fs';
import { relative, join } from 'node:path';
import { expect, it } from 'vite-plus/test';

const sources = import.meta.glob<string>(['../**/*.{ts,tsx}', '!../**/*.test.{ts,tsx}'], {
    query: '?raw',
    import: 'default',
    eager: true,
});

/** Pixel-exact glyph art, finer than any scale step. */
const allowed: Record<string, string[]> = {
    // A project's monogram inside a 14 or 16px square: 7, 8 and 9px letters, below the type scale's 10px floor.
    'board/ProjectIcon.tsx': ['text-[7px]', 'text-[8px]', 'text-[9px]'],
    // The "?" inside a 16px slice mark, and the mark's 1.5px ring.
    'board/Slices.tsx': ['text-[9px]', 'border-[1.5px]'],
    // A 1.5px ring around the activity glyph, between the 1px and 2px border widths.
    'board/ActivityLine.tsx': ['border-[1.5px]'],
    // The route diagram's 1.5px connector lines.
    'showcase/RouteDiagram.tsx': ['h-[1.5px]', 'w-[1.5px]'],
};

const arbitraryLength = /(?<![\w-])@?[\w-]*-\[-?\d*\.?\d+(?:px|rem)\]/g;

it('no class sets an arbitrary length outside the allow-list', () => {
    const found = Object.entries(sources).flatMap(([path, text]) => {
        const file = relative(join(import.meta.dirname, '..'), join(import.meta.dirname, path));

        return [...text.matchAll(arbitraryLength)]
            .map(([match]) => match.replace(/^.*:/, ''))
            .filter((match) => !allowed[file]?.includes(match))
            .map((match) => `${file}: ${match}`);
    });

    expect(found).toEqual([]);
});

// Colours come from the tokens too: a hex colour in a class (text-[#a3a3aa], [--x:#fff]) or an SVG fill/stroke
// attribute fails here, so a new colour becomes a semantic token (tokens.ts) rather than a one-off.
const literalColour = /-\[#[\da-f]{3,8}\]|:#[\da-f]{3,8}\]|\b(?:fill|stroke)="#[\da-f]{3,8}"/gi;

// A shadow is an elevation role (theme.css's --shadow-*), never one mixed in a class: shadow-[…], drop-shadow-[…] or
// inset-shadow-[…] with a colour of its own (rgb, hsl, oklch or hex) fails here.
const mixedShadow =
    /(?<![\w-])(?:[\w[\]&>=*@/.()'-]+:)*(?:inset-|drop-)?shadow-\[[^\]\s'"`]*(?:rgba?\(|hsla?\(|oklch\(|#[\da-f]{3,8})[^\]\s'"`]*\]/gi;

it('no component mixes a shadow of its own', () => {
    const found = Object.entries(sources)
        .filter(([path]) => !path.endsWith('.stories.tsx'))
        .flatMap(([path, text]) => {
            const file = relative(join(import.meta.dirname, '..'), join(import.meta.dirname, path));

            return [...text.matchAll(mixedShadow)].map(([match]) => `${file}: ${match}`);
        });

    expect(found).toEqual([]);
});

it('no component hard-codes a colour', () => {
    // Stories may draw sample artwork in literal colours; components may not.
    const found = Object.entries(sources)
        .filter(([path]) => !path.endsWith('.stories.tsx'))
        .flatMap(([path, text]) => {
            const file = relative(join(import.meta.dirname, '..'), join(import.meta.dirname, path));

            return [...text.matchAll(literalColour)].map(([match]) => `${file}: ${match}`);
        });

    expect(found).toEqual([]);
});

// Tailwind's default shadow scale bypasses the role tokens. `none` and token shadows remain valid.
const defaultShadow =
    /(?<![\w-])(?:shadow(?:-(?:2xs|xs|sm|md|lg|xl|2xl))?|(?:inset|drop)-shadow-(?:2xs|xs|sm|md|lg|xl|2xl))(?:\/\d+)?(?=[\s'"`}]|$)/g;

it('components use elevation roles instead of Tailwind default shadows', () => {
    const allowedDefaults: Record<string, string[]> = {
        // A boolean prop for the device illustration’s contact shadow, not an elevation class.
        'showcase/Devices.tsx': ['shadow'],
    };
    const found = Object.entries(sources)
        .filter(([path]) => !path.endsWith('.stories.tsx'))
        .flatMap(([path, source]) => {
            const file = relative(join(import.meta.dirname, '..'), join(import.meta.dirname, path));
            const code = source.replace(/\/\*[\s\S]*?\*\/|\/\/[^\n]*/g, '');

            return [...code.matchAll(defaultShadow)]
                .filter(([match]) => !allowedDefaults[file]?.includes(match))
                .map(([match]) => `${file}: ${match}`);
        });

    expect(found).toEqual([]);
});

// Radii come from the radius scale (theme.css's --radius-*: xs, sm, md, lg, xl, 2xl, 3xl) or are full or none: a
// bare `rounded`, Tailwind's own 4xl, an arbitrary rounded-[…] or a border-radius in rem fails here. The marketing
// devices' frames (showcase/devices.css, server-unit.css) draw hardware whose corners scale with the drawing.
const radius =
    /(?<![\w-])(?:[\w[\]&>=*@/.()'-]+:)*rounded(?:-(?:t|b|l|r|s|e|tl|tr|bl|br|ss|se|es|ee))?(?:-([\w[\]().-]+))?(?=[\s'"`}]|$)/g;
const radii = new Set(['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', 'full', 'none', 'inherit', '[inherit]']);

it('every radius is a step of the radius scale', () => {
    const found = Object.entries(sources).flatMap(([path, source]) => {
        const file = relative(join(import.meta.dirname, '..'), join(import.meta.dirname, path));
        const code = source.replace(/\/\*[\s\S]*?\*\/|\/\/[^\n]*|^\s*\*.*$/gm, '');

        return [...code.matchAll(radius)]
            .filter(([, step]) => step === undefined || !radii.has(step))
            .map(([match]) => `${file}: ${match}`);
    });

    expect(found).toEqual([]);
});

/** The sheets, read from disk (the test runner hands a stylesheet's import back empty). */
const src = join(import.meta.dirname, '..');
const sheets = readdirSync(src, { recursive: true, encoding: 'utf8' })
    .filter((file) => file.endsWith('.css') && !['showcase/devices.css', 'showcase/server-unit.css'].includes(file))
    .map((file) => [file, readFileSync(join(src, file), 'utf8')] as const);

it('every stylesheet radius is a scale token', () => {
    expect(sheets.find(([file]) => file === 'foundations/theme.css')?.[1]).toContain('--radius-xs');

    const found = sheets.flatMap(([path, source]) =>
        [...source.matchAll(/border-radius:\s*([^;]+);/g)]
            .map(([, value]) => value!.trim())
            .filter((value) => !/^(?:var\(--radius-[\w-]+\)|9999px|999px|50%|inherit|0)$/.test(value))
            .map((value) => `${path}: ${value}`),
    );

    expect(found).toEqual([]);
});

// Letter-spacing comes from the four tracking steps (theme.css's --tracking-*: display, title, heading, caps) or is
// normal: an arbitrary tracking-[…], Tailwind's own tight/wide steps or a raw letter-spacing fails here.
const tracking = /(?<![\w-])tracking-([\w[\]().-]+)/g;
const trackingSteps = new Set(['display', 'title', 'heading', 'caps', 'normal']);

it('every letter-spacing is a tracking step', () => {
    const classes = Object.entries(sources).flatMap(([path, source]) => {
        const file = relative(join(import.meta.dirname, '..'), join(import.meta.dirname, path));

        return [...source.matchAll(tracking)]
            .filter(([, step]) => !trackingSteps.has(step!))
            .map(([match]) => `${file}: ${match}`);
    });
    const styles = sheets.flatMap(([file, source]) =>
        [...source.matchAll(/letter-spacing:\s*([^;]+);/g)]
            .map(([, value]) => value!.trim())
            .filter((value) => !/^(?:var\(--tracking-[\w-]+\)|0|normal)$/.test(value))
            .map((value) => `${file}: ${value}`),
    );

    expect([...classes, ...styles]).toEqual([]);
});
