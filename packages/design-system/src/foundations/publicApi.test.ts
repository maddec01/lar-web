// The public API boundary: apps never style a component, so no component the main entry exports takes a `className`
// or a `style` (the styleable `…Base` building blocks live in `/primitives`, for apps' own UI layers).
// The type check (`vp check`) enforces it: a component that takes either shows up as a missing key of `styled` below.
import type { JSXElementConstructor } from 'react';
import { expect, it } from 'vite-plus/test';

import type * as Main from '../index';

type Styled<Api> = {
    [Name in keyof Api]-?: Api[Name] extends JSXElementConstructor<infer Props>
        ? [Extract<keyof Props, 'className' | 'style'>] extends [never]
            ? never
            : Name
        : never;
}[keyof Api];

const styled: Record<Styled<typeof Main>, never> = {};

it('no public component takes a class or a style', () => {
    expect(styled).toEqual({});
});
