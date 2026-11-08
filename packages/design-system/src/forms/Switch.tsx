import { Switch as NinnaSwitch, type SwitchProps as NinnaSwitchProps } from '@ninna-ui/forms';
import { forwardRef, type ReactNode } from 'react';

import { tabbable } from '../foundations/KeyboardFocus';

/** Every state's look, owned here rather than left to ninna-ui: an enabled switch's track reads at 3:1 against the
 *  page whether off (line-strong) or on (primary), under a white thumb; a disabled one fades to 40%, so it never
 *  passes for an enabled one that is off; keyboard focus takes the one focus ring; a save in flight (`busy`, or
 *  `loading` with its spinner) keeps the look and shows the progress cursor. */
const states =
    'bg-line-strong data-[state=checked]:bg-primary [&>[data-slot=thumb]]:bg-white [&>[data-slot=thumb]]:shadow-(--shadow-raised) focus-ring focus-visible:ring-0 focus-visible:ring-offset-0 disabled:opacity-40 data-loading:disabled:opacity-100 aria-disabled:cursor-progress data-loading:cursor-progress';

export type SwitchProps = Omit<
    NinnaSwitchProps,
    | 'className'
    | 'style'
    | 'color'
    | 'size'
    | 'variant'
    | 'thumbIcon'
    | 'trackLabels'
    | 'description'
    | 'checked'
    | 'defaultChecked'
    | 'onCheckedChange'
    | 'disabled'
    | 'loading'
    | 'invalid'
    | 'label'
    | 'labelPosition'
> & {
    /** Whether it is on, for a switch whose state the caller holds; leave it out and use `defaultChecked` to let the
     *  switch hold its own. */
    checked?: boolean;
    /** Whether an uncontrolled switch starts on. */
    defaultChecked?: boolean;
    /** Called with the new state when the reader turns it on or off; never while it is `busy`, `loading` or
     *  `disabled`. */
    onCheckedChange?: (checked: boolean) => void;
    /** The visible label beside it, which also names it; without one, name it with `aria-label`. */
    label?: ReactNode;
    /** Puts the label before the switch, as a settings row's text, rather than after it. */
    labelPosition?: 'start' | 'end';
    /** Can't be changed now, such as a setting that needs something else first: faded, and skipped by Tab. */
    disabled?: boolean;
    /** Busy rather than disabled while a change it started saves: it keeps its look and the focus, reads as busy,
     *  and ignores presses, pointer or keyboard, so its state can't change under the save. */
    busy?: boolean;
    /** Like `busy`, with a spinner in the thumb, while its new state saves. */
    loading?: boolean;
    /** Marks the switch as wrong, such as a required consent left off. */
    invalid?: boolean;
};

/** Lar's on/off switch for a setting that applies at once. */
export const Switch = forwardRef<HTMLButtonElement, SwitchProps>(
    ({ busy = false, onCheckedChange, onClick, onKeyDown, ...props }, ref) => (
        <NinnaSwitch
            ref={ref}
            {...tabbable}
            size="sm"
            aria-busy={busy || props.loading || undefined}
            {...props}
            {...(busy && { 'aria-disabled': true })}
            className={states}
            // A press while busy ends here, before the switch's own handler flips its state (it skips a press whose
            // default was prevented); Enter and Space reach the switch as a click, and so stop here too.
            onClick={(event) => {
                if (busy) {
                    event.preventDefault();

                    return;
                }

                onClick?.(event);
            }}
            onKeyDown={(event) => {
                if (busy && (event.key === 'Enter' || event.key === ' ')) event.preventDefault();

                onKeyDown?.(event);
            }}
            onCheckedChange={(checked) => !busy && onCheckedChange?.(checked)}
        />
    ),
);

Switch.displayName = 'Switch';
