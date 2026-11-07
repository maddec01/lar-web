import { Input as NinnaInput, type InputProps as NinnaInputProps } from '@ninna-ui/forms';
import { forwardRef } from 'react';

import { formControlClasses, formControlDefaults } from './FormControlStyles';

export type InputProps = Omit<NinnaInputProps, 'fullWidth'> & {
    /** A `field` fills its container; `setting` is a settings row's 16rem text field, narrower where the row is; `short`
     *  holds a few characters, such as a hex colour; `count` a small whole number; `title` is a document's title typed
     *  in place, borderless in large semibold type, such as a new item's. */
    presentation?: 'field' | 'setting' | 'short' | 'count' | 'title';
};

const presentations = {
    field: '',
    setting: 'w-64 max-w-full',
    short: 'w-24',
    count: 'w-20',
    title: 'text-base-content w-full shrink-0 border-0 bg-transparent p-0 text-xl font-semibold tracking-tight outline-none placeholder:font-medium placeholder:text-(--muted-foreground)',
} as const;

export const Input = forwardRef<HTMLInputElement, InputProps>(
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
            className={`${variant === 'filled' && presentation !== 'title' ? formControlClasses : ''} ${presentations[presentation]} ${className ?? ''}`}
        />
    ),
);

Input.displayName = 'Input';
