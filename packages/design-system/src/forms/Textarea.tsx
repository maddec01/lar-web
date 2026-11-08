import { Textarea as NinnaTextarea, type TextareaProps as NinnaTextareaProps } from '@ninna-ui/forms';
import { forwardRef } from 'react';

import { formControlClasses, formControlDefaults } from './FormControlStyles';

/** A text area's look is the field's, never a class of the caller's. */
export interface TextareaProps extends Omit<
    NinnaTextareaProps,
    'className' | 'style' | 'color' | 'size' | 'variant' | 'fullWidth'
> {
    /** The text, when the caller holds it (with `onChange`). */
    value?: string;
    /** The text it starts with, when the field holds its own. */
    defaultValue?: string;
    /** A hint shown while it is empty, never in place of a label. */
    placeholder?: string;
    /** Its height in lines of text, before it grows or scrolls. */
    rows?: number;
    /** Marks it invalid: the danger edge, and `aria-invalid` for screen readers. */
    invalid?: boolean;
    /** Which way the reader may drag its corner to resize it. */
    resize?: 'none' | 'vertical' | 'horizontal' | 'both';
    /** Grows with its text between `minRows` and `maxRows`. */
    autoResize?: boolean;
    /** The fewest lines it shows while it grows with its text. */
    minRows?: number;
    /** The most lines it grows to before it scrolls. */
    maxRows?: number;
    /** Shows how many characters are left of its `maxLength`. */
    showCounter?: boolean;
}

/** A multi-line text field, in the same dress as Input. */
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>((props, ref) => (
    <NinnaTextarea
        ref={ref}
        {...formControlDefaults}
        {...props}
        className={`${formControlClasses} ${props.autoResize ? '' : 'h-auto!'}`}
    />
));
Textarea.displayName = 'Textarea';
