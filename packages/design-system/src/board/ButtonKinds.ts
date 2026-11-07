import type { ButtonProps } from '../actions/Button';

/**
 * Lar Factory's five kinds of button. A Main action, at most one per area, is filled; a Start is tinted, with the play
 * icon; an Open is outlined, with the thread or pull request icon; an App control has no border and an icon; any Other
 * button is outlined, with no icon. A dialog or a form is an area of its own, so its submit is its Main action. Every
 * kind is the compact 28px Button and keeps its look while disabled.
 */
export type ButtonKind = 'main' | 'start' | 'open' | 'control' | 'other';

const recipe = {
    main: 'primary',
    start: 'tinted',
    open: 'secondary',
    control: 'quiet',
    other: 'secondary',
} as const satisfies Record<ButtonKind, ButtonProps['variant']>;

/** Props to spread on the design system's Button for a kind: its recipe, the compact size, and `data-kind`, which
 *  names the kind for tests and the board's legacy marks. A destructive confirm, such as Reset or Abandon, is its
 *  area's Main action filled in the danger colour. */
export const buttonKind = <
    K extends ButtonKind,
    T extends (K extends 'main' ? 'danger' : never) | undefined = undefined,
>(
    kind: K,
    tone?: T,
) => ({
    variant: (tone ? 'destructive' : recipe[kind]) as T extends 'danger' ? 'destructive' : (typeof recipe)[K],
    compact: true,
    'data-kind': kind,
});
