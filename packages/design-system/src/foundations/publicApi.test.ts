// The public API boundary: apps never style a component, so no component an entry point exports takes a `className`
// or a `style` (the design system's own compositions use the internal `…Base` exports, which no entry point exports).
// The type check (`vp check`) enforces it: a component that takes either shows up as a missing key of `styled` below.
import type { JSXElementConstructor } from 'react';
import { expect, it } from 'vite-plus/test';

import type * as Board from '../board';
import type * as Main from '../index';
import type * as Showcase from '../showcase';

type Styled<Api> = {
    [Name in keyof Api]-?: Api[Name] extends JSXElementConstructor<infer Props>
        ? [Extract<keyof Props, 'className' | 'style'>] extends [never]
            ? never
            : Name
        : never;
}[keyof Api];

const styled: Record<Styled<typeof Main & typeof Board & typeof Showcase>, never> = {};

it('no public component takes a class or a style', () => {
    expect(styled).toEqual({});
});
