import {
    Select as NinnaSelect,
    SelectItem as NinnaSelectItem,
    type SelectItemProps as NinnaSelectItemProps,
    type SelectProps as NinnaSelectProps,
} from '@ninna-ui/forms';
import { forwardRef, type ReactNode } from 'react';

import { tabbable } from '../foundations/KeyboardFocus';
import { useInertBackground } from '../overlays/InertBackground';
import { formControlClasses, formControlDefaults } from './FormControlStyles';

/** A select's look is the field's, never a class of the caller's. */
export interface SelectProps extends Omit<
    NinnaSelectProps,
    'fullWidth' | 'variant' | 'className' | 'size' | 'color' | 'children'
> {
    /** The chosen option's value, when the caller holds it (with `onValueChange`). */
    value?: string;
    /** The option chosen at first, when the select holds its own state. */
    defaultValue?: string;
    /** Called with the value of the option the reader picks. */
    onValueChange?: (value: string) => void;
    /** Shown while no option is chosen. */
    placeholder?: string;
    /** Out of reach, and drawn so. */
    disabled?: boolean;
    /** Marks it invalid: the danger edge, and `aria-invalid` for screen readers. */
    invalid?: boolean;
    /** A form field's name, under which the chosen value is submitted. */
    name?: string;
    /** Adds a clear button that empties the choice. */
    clearable?: boolean;
    /** Called when the clear button empties the choice. */
    onClear?: () => void;
    /** Its `SelectItem` options. */
    children: ReactNode;
}

type SelectBaseProps = SelectProps &
    Pick<NinnaSelectProps, 'className' | 'size' | 'color'> & {
        /** ninna-ui's look: `filled` is Lar's field; `unstyled` leaves the trigger bare for a composition to dress. */
        variant?: NinnaSelectProps['variant'] | 'unstyled';
    };

/** The select for the design system's own compositions, which may dress its trigger with a class. */
export const SelectBase = forwardRef<HTMLButtonElement, SelectBaseProps>(
    ({ size = formControlDefaults.size, variant = formControlDefaults.variant, className, ...props }, ref) => {
        useInertBackground();

        return (
            <NinnaSelect
                ref={ref}
                color={formControlDefaults.color}
                {...tabbable}
                {...props}
                fullWidth
                size={size}
                variant={(variant === 'filled' ? 'unstyled' : variant) as NinnaSelectProps['variant']}
                className={`${variant === 'filled' ? `${formControlClasses} h-8 px-3 text-(length:--text-ui) font-medium` : ''} [&>span:first-child]:truncate [&>span:first-child>span]:flex [&>span:first-child>span]:max-w-full [&>span:first-child>span>span:last-child]:truncate ${className ?? ''}`}
            />
        );
    },
);

SelectBase.displayName = 'SelectBase';

/** Lar's dropdown field: a button over a listbox of `SelectItem`s, in the same dress as Input. */
export const Select = forwardRef<HTMLButtonElement, SelectProps>((props, ref) => <SelectBase ref={ref} {...props} />);

Select.displayName = 'Select';

interface SelectItemProps extends Omit<NinnaSelectItemProps, 'className' | 'style' | 'color' | 'children'> {
    /** The value `onValueChange` hears when it is picked. */
    value: string;
    /** The option's label. */
    children?: ReactNode;
    /** Shown but can't be picked. */
    disabled?: boolean;
    /** The text typeahead matches, where the label isn't plain text. */
    textValue?: string;
    /** An icon before the label. */
    icon?: ReactNode;
    /** A hue (an oklch hue angle) that colours the `icon` at full strength, such as a kind's. */
    iconHue?: number | undefined;
    /** A line of detail under the label. */
    description?: string;
}

/** An option of the Select; its `icon` takes `iconHue`, a hue at full strength, when given. */
export const SelectItem = forwardRef<HTMLDivElement, SelectItemProps>(({ icon, iconHue, children, ...props }, ref) => (
    <NinnaSelectItem ref={ref} {...props}>
        {icon ? (
            <span className="inline-flex min-w-0 items-center gap-2 align-middle">
                <span
                    aria-hidden="true"
                    className="size-4 shrink-0 [&>svg]:size-full"
                    style={iconHue === undefined ? undefined : { color: `oklch(0.62 0.15 ${iconHue})` }}
                >
                    {icon}
                </span>
                <span className="min-w-0">{children}</span>
            </span>
        ) : (
            children
        )}
    </NinnaSelectItem>
));

SelectItem.displayName = 'SelectItem';
