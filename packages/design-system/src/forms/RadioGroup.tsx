import {
    RadioGroup as NinnaRadioGroup,
    RadioGroupItem as NinnaRadioGroupItem,
    type RadioGroupItemProps as NinnaRadioGroupItemProps,
    type RadioGroupProps as NinnaRadioGroupProps,
    useFormControl,
} from '@ninna-ui/forms';
import { forwardRef, type ReactNode, useImperativeHandle, useLayoutEffect, useRef } from 'react';

import { formChoiceClasses, formControlDefaults } from './FormControlStyles';

/** A radio group's look is fixed, never a class of the caller's. */
export interface RadioGroupProps extends Omit<
    NinnaRadioGroupProps,
    'className' | 'style' | 'color' | 'size' | 'variant' | 'gap'
> {
    /** The chosen item's value, when the caller holds it (with `onValueChange`). */
    value?: string;
    /** The item chosen at first, when the group holds its own state. */
    defaultValue?: string;
    /** Called with the value of the item the reader picks. */
    onValueChange?: (value: string) => void;
    /** Out of reach, every item with it. */
    disabled?: boolean;
    /** Marks the group invalid for screen readers and draws its items so. */
    invalid?: boolean;
    /** A form field's name, under which the chosen value is submitted. */
    name?: string;
    /** Lays the items in a column (the default) or a row; arrow keys follow it. */
    orientation?: 'horizontal' | 'vertical';
    /** Its `RadioGroupItem`s. */
    children: ReactNode;
}

/** A radio's look is fixed, never a class of the caller's. */
export interface RadioGroupItemProps extends Omit<NinnaRadioGroupItemProps, 'className' | 'style' | 'color'> {
    /** The value the group hears when it is picked. */
    value: string;
    /** The text beside the radio, which picks it too. */
    label?: ReactNode;
    /** A line of detail under the label. */
    description?: ReactNode;
    /** Puts the label before the radio rather than after. */
    labelPosition?: 'start' | 'end';
    /** Shown but can't be picked. */
    disabled?: boolean;
}

/** Lar's radio group: one choice among a few, each a `RadioGroupItem`. */
export const RadioGroup = forwardRef<HTMLDivElement, RadioGroupProps>((props, ref) => {
    const groupRef = useRef<HTMLDivElement>(null);
    const formControl = useFormControl();

    useImperativeHandle(ref, () => groupRef.current!);
    // Ninna drops the group's ARIA props instead of forwarding them to its root.
    useLayoutEffect(() => {
        const attributes = {
            'aria-label': props['aria-label'],
            'aria-labelledby': props['aria-labelledby'] ?? (props['aria-label'] ? undefined : formControl?.labelId),
            'aria-describedby': props['aria-describedby'] ?? formControl?.messageId,
        };

        for (const [name, value] of Object.entries(attributes)) {
            if (value === undefined) groupRef.current?.removeAttribute(name);
            else groupRef.current?.setAttribute(name, value);
        }
    });

    return (
        <NinnaRadioGroup ref={groupRef} size={formControlDefaults.size} color={formControlDefaults.color} {...props} />
    );
});

RadioGroup.displayName = 'RadioGroup';

/** One choice of a RadioGroup. */
export const RadioGroupItem = forwardRef<HTMLButtonElement, RadioGroupItemProps>((props, ref) => (
    <NinnaRadioGroupItem ref={ref} {...props} className={`${formChoiceClasses} cursor-pointer`} />
));

RadioGroupItem.displayName = 'RadioGroupItem';
