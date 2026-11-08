import { expect, test } from 'vite-plus/test';

import { semanticColors } from '../foundations/tokens';
import { CONTRAST_FLOOR, PALETTE, chipFill, chipText, contrastRatio, tint } from './LabelTint';

test('the contrast ratio is the WCAG one', () => {
    expect(contrastRatio('#000000', '#ffffff')).toBeCloseTo(21);
    expect(contrastRatio('#777777', '#ffffff')).toBeCloseTo(4.48, 1);
});

for (const color of [
    '#C2E0C6',
    '#000000',
    '#FFFFFF',
    '#FBCA04',
    '#EDEDED',
    '#BFDADC',
    '#D73A4A',
    '#0E8A16',
    '#5319E7',
    '#1D76DB',
    '#808080',
    '#123456',
]) {
    for (const mode of ['light', 'dark'] as const) {
        test(`a ${color} chip's name clears the floor in ${mode} mode`, () => {
            expect(contrastRatio(chipText(color, mode), chipFill(color, mode))).toBeGreaterThanOrEqual(CONTRAST_FLOOR);
        });
    }
}

test('a colour with room to spare keeps its hue, and the pale ones the review measured move towards the foreground', () => {
    expect(chipText('#D73A4A', 'light')).not.toBe(PALETTE.light.foreground);

    const before = contrastRatio('#7c8a7e', chipFill('#C2E0C6', 'light'));

    expect(before).toBeLessThan(CONTRAST_FLOOR);
    expect(contrastRatio(chipText('#C2E0C6', 'light'), chipFill('#C2E0C6', 'light'))).toBeGreaterThan(before);
});

test('the style names both modes, and anything but a colour keeps the neutral style', () => {
    expect(tint('#C2E0C6')!.color).toMatch(/^light-dark\(#[0-9a-f]{6}, #[0-9a-f]{6}\)$/);
    expect(tint('#C2E0C6')!.backgroundColor).toBe('rgb(194 224 198 / 16%)');
    expect(tint(undefined)).toBeUndefined();
    expect(tint('red; background: url(x)')).toBeUndefined();
});

test('the palette is the semantic tokens a picked row draws with', () => {
    // tokens.test.ts holds theme.css to these values.
    expect(PALETTE.light).toEqual({
        foreground: semanticColors.fg.light,
        surface: semanticColors['fill-selected'].light,
    });
    expect(PALETTE.dark).toEqual({ foreground: semanticColors.fg.dark, surface: semanticColors['fill-selected'].dark });
});
