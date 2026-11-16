import { expect, test } from 'vite-plus/test';

import { CONTRAST_FLOOR, chipFill, chipText, contrastRatio, tint } from './LabelTint';

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

test('anything but a colour keeps the neutral style', () => {
    expect(tint('#C2E0C6')).toBeDefined();
    expect(tint(undefined)).toBeUndefined();
    expect(tint('red; background: url(x)')).toBeUndefined();
});
