import { expect, test } from 'vite-plus/test';

import { buttonKind } from './ButtonKinds';

test("each kind draws over one recipe of the design system's Button, at `sm`, and names itself", () => {
    expect((['main', 'start', 'open', 'control', 'other'] as const).map((kind) => buttonKind(kind))).toEqual([
        { variant: 'primary', size: 'sm', 'data-kind': 'main' },
        { variant: 'tinted', size: 'sm', 'data-kind': 'start' },
        { variant: 'secondary', size: 'sm', 'data-kind': 'open' },
        { variant: 'quiet', size: 'sm', 'data-kind': 'control' },
        { variant: 'secondary', size: 'sm', 'data-kind': 'other' },
    ]);
});

test('a destructive Main action is filled in the danger colour', () => {
    expect(buttonKind('main', 'danger')).toEqual({ variant: 'destructive', size: 'sm', 'data-kind': 'main' });
});

test('a destructive choice beside others is the quiet-destructive ghost', () => {
    expect(buttonKind('other', 'danger')).toEqual({ variant: 'destructive-quiet', size: 'sm', 'data-kind': 'other' });
});
