import { Input as NinnaInput, type InputProps as NinnaInputProps } from '@ninna-ui/forms';
import { forwardRef } from 'react';

import { formControlClasses, formControlDefaults } from './FormControlStyles';

/** A text field's look is its `presentation`, never a class, style, size or variant of the caller's. */
export interface InputProps extends Omit<
    NinnaInputProps,
    'fullWidth' | 'className' | 'style' | 'size' | 'variant' | 'color' | 'floatingLabel'
> {
    /** A `field` fills its container; `setting` is a settings row's 13rem text field, narrower where the row is;
     *  `short` holds a few characters, such as a hex colour; `count` a small whole number (96px); `title` is a
     *  document's title typed in place, borderless in large semibold type, such as a new item's. */
    presentation?: 'field' | 'setting' | 'short' | 'count' | 'title';
    /** Marks the value as wrong: the danger edge, and `aria-invalid` for assistive technology. */
    invalid?: boolean;
    /** Shows a clear button while it holds a value, such as a search field's. */
    clearable?: boolean;
    /** Called when the clear button empties it. */
    onClear?: () => void;
    /** Shows a count of characters against `maxLength` under it. */
    showCounter?: boolean;
}

type InputBaseProps = InputProps & Pick<NinnaInputProps, 'className' | 'style' | 'size' | 'variant'>;

const presentations = {
    field: '',
    setting: 'w-52 max-w-full',
    short: 'w-24',
    count: 'w-24',
    title: 'text-fg w-full shrink-0 border-0 bg-transparent p-0 text-xl font-semibold tracking-title outline-none placeholder:font-medium placeholder:text-fg-muted',
} as const;

/** A number is typed, never stepped with the browser's own arrows, which would crowd a short field. */
const numberClasses =
    '[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none';

/** The text field for the design system's own compositions, which may fit it to their layout with a class. */
export const InputBase = forwardRef<HTMLInputElement, InputBaseProps>(
    (
        {
            size = formControlDefaults.size,
            variant = formControlDefaults.variant,
            presentation = 'field',
            className,
            ...props
        },
        ref,
    ) => (
        <NinnaInput
            ref={ref}
            color={formControlDefaults.color}
            {...props}
            fullWidth
            size={size}
            variant={presentation === 'title' ? 'unstyled' : variant}
            className={`${variant === 'filled' && presentation !== 'title' ? formControlClasses : ''} ${presentations[presentation]} ${props.type === 'number' ? numberClasses : ''} ${className ?? ''}`}
        />
    ),
);

InputBase.displayName = 'InputBase';

/** Lar's one-line text field, as T3 Code draws it; Field gives it a label, a description and an error. */
export const Input = forwardRef<HTMLInputElement, InputProps>((props, ref) => <InputBase ref={ref} {...props} />);

Input.displayName = 'Input';
