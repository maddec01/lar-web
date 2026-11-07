import { expect, test } from 'vite-plus/test';

import { buttonKind } from './ButtonKinds';

test("each kind draws over one recipe of the design system's Button, compact, and names itself", () => {
    expect((['main', 'start', 'open', 'control', 'other'] as const).map((kind) => buttonKind(kind))).toEqual([
        { variant: 'primary', compact: true, 'data-kind': 'main' },
        { variant: 'tinted', compact: true, 'data-kind': 'start' },
        { variant: 'secondary', compact: true, 'data-kind': 'open' },
        { variant: 'quiet', compact: true, 'data-kind': 'control' },
        { variant: 'secondary', compact: true, 'data-kind': 'other' },
    ]);
});

test('a destructive Main action is filled in the danger colour', () => {
    expect(buttonKind('main', 'danger')).toEqual({ variant: 'destructive', compact: true, 'data-kind': 'main' });
});
