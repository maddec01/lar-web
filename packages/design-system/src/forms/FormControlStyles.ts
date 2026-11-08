export const formControlDefaults = { size: 'sm', variant: 'filled', color: 'primary' } as const;

/** A field's edge identifies it, so it reads at 3:1 against the page and the field's own fill (line-strong, WCAG
 *  1.4.11), a step deeper under the pointer. */
export const formControlBorderClasses =
    'border border-line-strong not-data-invalid:not-aria-invalid:enabled:hover:border-line-strong-hover';

/** A checkbox's or radio's edge carries its state, so it reads at 3:1 on the page (line-strong). */
const formChoiceBorderClasses = 'border border-line-strong';

export const formChoiceClasses = `${formChoiceBorderClasses} bg-surface-control shadow-(--shadow-raised) focus-ring disabled:cursor-default disabled:opacity-50`;

/** T3 Code's input: an 8px-radius field (surface-control) inside its 3:1 edge, with a faint shadow and a focus halo while
 *  focused (focus-field); an invalid one takes the danger edge, and a disabled one fades. */
export const formControlClasses = `min-w-0 rounded-md ${formControlBorderClasses} bg-surface-control text-fg shadow-(--shadow-raised) placeholder:text-fg-muted data-placeholder:text-fg-muted focus-field focus:bg-surface-control disabled:cursor-not-allowed disabled:opacity-50 data-invalid:border-danger data-invalid:bg-surface-control aria-invalid:border-danger aria-invalid:bg-surface-control data-invalid:focus:ring-danger-ring aria-invalid:focus:ring-danger-ring`;
