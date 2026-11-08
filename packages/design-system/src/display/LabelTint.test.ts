import { expect, test } from 'vite-plus/test';

import { CONTRAST_FLOOR, PALETTE, chipFill, chipText, contrastRatio, tint } from './LabelTint';

test('the contrast ratio is the WCAG one', () => {
    expect(contrastRatio('#000000', '#ffffff')).toBeCloseTo(21);
    expect(contrastRatio('#777777', '#ffffff')).toBeCloseTo(4.48, 1);
});

test("every chip's name clears the contrast floor in both modes", () => {
    // GitHub's default label colours, and the extremes.
    const colors = '#C2E0C6 #000000 #FFFFFF #FBCA04 #EDEDED #BFDADC #D73A4A #0E8A16 #5319E7 #1D76DB #808080 #123456';
    const below = colors
        .split(' ')
        .flatMap((color) =>
            (['light', 'dark'] as const)
                .filter((mode) => contrastRatio(chipText(color, mode), chipFill(color, mode)) < CONTRAST_FLOOR)
                .map((mode) => `${color} in ${mode}`),
        );

    expect(below).toEqual([]);
});

test('a colour with room to spare keeps its hue, and a pale one moves towards the foreground', () => {
    expect(chipText('#D73A4A', 'light')).not.toBe(PALETTE.light.foreground);

    const before = contrastRatio('#7c8a7e', chipFill('#C2E0C6', 'light'));

    expect(before).toBeLessThan(CONTRAST_FLOOR);
    expect(contrastRatio(chipText('#C2E0C6', 'light'), chipFill('#C2E0C6', 'light'))).toBeGreaterThan(before);
});

test('anything but a colour keeps the neutral style', () => {
    expect(tint('#C2E0C6')).toBeDefined();
    expect(tint(undefined)).toBeUndefined();
    expect(tint('red; background: url(x)')).toBeUndefined();
});
