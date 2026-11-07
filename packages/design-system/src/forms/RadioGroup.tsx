import {
    RadioGroup as NinnaRadioGroup,
    RadioGroupItem as NinnaRadioGroupItem,
    type RadioGroupItemProps,
    type RadioGroupProps,
    useFormControl,
} from '@ninna-ui/forms';
import { forwardRef, type ReactNode, useId, useImperativeHandle, useLayoutEffect, useRef } from 'react';

import { formChoiceClasses, formControlDefaults } from './FormControlStyles';

export type { RadioGroupItemProps, RadioGroupProps } from '@ninna-ui/forms';

type LarRadioGroupProps = RadioGroupProps & {
    /** `choices` stacks RadioGroupChoice rows close together. */
    presentation?: 'default' | 'choices';
};

export const RadioGroup = forwardRef<HTMLDivElement, LarRadioGroupProps>(
    ({ presentation = 'default', ...props }, ref) => {
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
            <NinnaRadioGroup
                ref={groupRef}
                size={formControlDefaults.size}
                color={formControlDefaults.color}
                {...props}
                className={presentation === 'choices' ? `min-w-0 gap-1.5 ${props.className ?? ''}` : props.className}
            />
        );
    },
);

RadioGroup.displayName = 'RadioGroup';

export const RadioGroupItem = forwardRef<HTMLButtonElement, RadioGroupItemProps>(({ className, ...props }, ref) => (
    <NinnaRadioGroupItem
        ref={ref}
        {...props}
        className={`${formChoiceClasses} cursor-pointer focus-visible:ring-offset-0 ${className ?? ''}`}
    />
));

RadioGroupItem.displayName = 'RadioGroupItem';

/**
 * One choice of a radio group in a bordered row, raised once picked: the bare radio, then its label, which can shrink,
 * so a long title in it truncates (RadioGroupItem's own label can't). `value` also names it as `data-choice`.
 */
export function RadioGroupChoice({ value, children }: { value: string; children: ReactNode }) {
    const id = useId();

    return (
        <div
            data-choice={value}
            className="border-base-300 has-data-[state=checked]:border-primary/60 has-data-[state=checked]:bg-primary/8 flex items-center gap-2 rounded-lg border px-3 py-1.5"
        >
            <RadioGroupItem id={id} value={value} />
            <label htmlFor={id} className="flex min-w-0 flex-1 cursor-pointer text-sm">
                {children}
            </label>
        </div>
    );
}
