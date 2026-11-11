export const formControlDefaults = { size: 'sm', variant: 'filled', color: 'primary' } as const;

/** A field's edge, T3 Code's quiet one (line-field: white 13% in dark, black 12% in light): at or just above a card's
 *  edge, never the loudest line on screen; a step firmer under the pointer (line-field-hover), the focus colour and
 *  ring while focused (focus-field), the danger edge when invalid and a divider's line when disabled. The field's fill
 *  tells it apart, so its edge is not held to 3:1. */
export const formControlBorderClasses =
    'border border-line-field not-data-invalid:not-aria-invalid:enabled:hover:border-line-field-hover disabled:border-line';

/** A checkbox's or radio's edge (line-choice: white 28% / black 26%): quieter than a status edge, still clearly a
 *  control beside a field's; checked, it fills with the primary. */
const formChoiceBorderClasses = 'border border-line-choice';

export const formChoiceClasses = `${formChoiceBorderClasses} bg-surface-control shadow-(--shadow-raised) focus-ring disabled:cursor-default disabled:opacity-50`;

/** T3 Code's input, select and search: a 6px-radius field (surface-field, white 4% in dark) inside its quiet edge, with
 *  a faint shadow and a focus halo while focused (focus-field); an invalid one takes the danger edge, and a disabled
 *  one fades. */
export const formControlClasses = `min-w-0 rounded-md ${formControlBorderClasses} bg-surface-field text-fg shadow-(--shadow-raised) placeholder:text-fg-muted data-placeholder:text-fg-muted focus-field focus:border-focus! focus:ring-focus/30! focus:bg-surface-field disabled:cursor-not-allowed disabled:opacity-50 data-invalid:border-danger data-invalid:bg-surface-field aria-invalid:border-danger aria-invalid:bg-surface-field data-invalid:focus:ring-danger-ring aria-invalid:focus:ring-danger-ring`;
