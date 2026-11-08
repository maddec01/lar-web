// The prop vocabulary (docs/Introduction.mdx) at the type level: every public component's `tone` is a status colour
// (StatusTone, or `accent` for a highlight that is not a status); the text components may add the text's own roles
// (default, muted, lead, soft, and a link's inherit), which colour words, never a surface. A look among equals is a `variant`, a scale is
// `size` (or a part's `…Size`, such as `startSize`) on the one ladder (xs to xl), no boolean flag such as `compact`
// or `dense` sizes anything, and `presentation` never sizes anything. `vp check` type-checks this file: a
// new prop outside the vocabulary names its component in the error below.
import { expect, it } from 'vite-plus/test';

import type * as Board from '../board/index';
import type { StatusTone } from '../feedback/StatusIndicator';
import type * as Main from '../index';
import type * as Showcase from '../showcase/index';

type Exports = typeof Main & typeof Board & typeof Showcase;
/** The components: the exports named in PascalCase (helpers such as resolveStatusTone take a `tone` too). */
type Component = { [K in keyof Exports]-?: K extends Capitalize<K & string> ? K : never }[keyof Exports];

type Props<C> = C extends (props: infer P) => unknown ? P : never;
type PropOf<C, Name extends string> = [Props<C>] extends [never]
    ? never
    : Props<C> extends { [K in Name]?: infer T }
      ? Exclude<T, undefined>
      : never;

/** Components whose `tone` colours words: they add the text roles to the status colours. */
type TextComponents = 'Text' | 'Heading' | 'Link';
type TextRole = 'default' | 'muted' | 'lead' | 'soft' | 'inherit';

type ToneOffenders = {
    [K in Component]-?: [PropOf<Exports[K], 'tone'>] extends [
        StatusTone | 'accent' | (K extends TextComponents ? TextRole : never),
    ]
        ? never
        : K;
}[Component];

/** The props that scale a thing: `size`, and a part's size such as `startSize`. */
type SizeProp<P> = Extract<keyof P, 'size' | `${string}Size`> & string;

type SizeOffenders = {
    [K in Component]-?: [Props<Exports[K]>] extends [never]
        ? never
        : { [Name in SizeProp<Props<Exports[K]>>]-?: [PropOf<Exports[K], Name>] extends [Size] ? never : K }[SizeProp<
              Props<Exports[K]>
          >];
}[Component];

/** Booleans that would size a thing beside the ladder: the scale is `size="sm"`, never `compact`. */
type SizeFlag = 'compact' | 'dense' | 'condensed' | 'small' | 'large' | 'mini' | 'tiny' | 'big';

type SizeFlagOffenders = {
    [K in Component]-?: [Props<Exports[K]>] extends [never]
        ? never
        : [Extract<keyof Props<Exports[K]>, SizeFlag>] extends [never]
          ? never
          : K;
}[Component];

type PresentationOffenders = {
    [K in Component]-?: [Extract<PropOf<Exports[K], 'presentation'>, SizeWord>] extends [never] ? never : K;
}[Component];

/** Words that size a thing, which a `presentation` never takes. */
type SizeWord = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'small' | 'medium' | 'large' | 'compact';

/** The one size ladder; EmptyState and PageError name where they sit instead (docs/Introduction.mdx). */
type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'hero' | 'start' | 'page' | 'panel' | 'compact' | 'inline';

const noToneOffenders: [ToneOffenders] extends [never] ? true : ToneOffenders = true;
const noSizeOffenders: [SizeOffenders] extends [never] ? true : SizeOffenders = true;
const noPresentationOffenders: [PresentationOffenders] extends [never] ? true : PresentationOffenders = true;
const noSizeFlagOffenders: [SizeFlagOffenders] extends [never] ? true : SizeFlagOffenders = true;

it('keeps every public tone a status colour, every size on the ladder, no boolean size flag and no presentation a size', () => {
    expect([noToneOffenders, noSizeOffenders, noPresentationOffenders, noSizeFlagOffenders]).toEqual([
        true,
        true,
        true,
        true,
    ]);
});
