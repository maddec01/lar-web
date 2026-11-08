import { Field as NinnaField, type FieldProps as NinnaFieldProps } from '@ninna-ui/forms';
import { forwardRef, type ReactNode } from 'react';

import { formControlDefaults } from './FormControlStyles';

/** A field's look is fixed, never a class of the caller's. */
export interface FieldProps extends Omit<NinnaFieldProps, 'size' | 'color' | 'className' | 'style' | 'children'> {
    /** The field's label, tied to the control inside it. */
    label?: string;
    /** A line of help under the control. */
    helperText?: string;
    /** What is wrong, in the danger text colour under the invalid control. */
    errorText?: string;
    /** Marks the label as required. */
    required?: boolean;
    /** Shows `errorText` and marks the control invalid. */
    invalid?: boolean;
    /** Disables the control inside it. */
    disabled?: boolean;
    /** A word at the label's end for an optional field, such as "Optional". */
    optionalText?: string;
    /** The id the label points at; the control inside takes it. */
    id?: string;
    /** The control: an Input, Select, Textarea or the like. */
    children: ReactNode;
}

type FieldBaseProps = FieldProps & Pick<NinnaFieldProps, 'className' | 'style'>;

/** The field for the design system's own compositions, which may fit it to their layout with a class. */
export const FieldBase = forwardRef<HTMLDivElement, FieldBaseProps>(({ className, ...props }, ref) => (
    <NinnaField
        ref={ref}
        {...props}
        size={formControlDefaults.size}
        // An invalid field says so twice, in one tone: the control's danger edge and the message under it in the danger
        // text colour (help stays muted), so the message reads as the field's error and never as more help.
        className={`[&>div:first-child>label>span]:text-fg-muted [&>p[role=alert]]:text-danger-fg [&>p]:text-xs ${className ?? ''}`}
    />
));

FieldBase.displayName = 'FieldBase';

/** A labelled field around one control, with its help and its error. */
export const Field = forwardRef<HTMLDivElement, FieldProps>((props, ref) => <FieldBase ref={ref} {...props} />);

Field.displayName = 'Field';
