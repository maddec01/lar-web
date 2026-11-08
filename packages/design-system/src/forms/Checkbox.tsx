import { CheckIcon } from 'lucide-react';
import { forwardRef, type InputHTMLAttributes, useImperativeHandle, useLayoutEffect, useRef } from 'react';

import { tabbable } from '../foundations/KeyboardFocus';
import { formChoiceClasses } from './FormControlStyles';

/** A checkbox's look is fixed, never a class of the caller's. */
export interface CheckboxProps extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    'type' | 'className' | 'style' | 'color' | 'size'
> {
    /** The text beside the box, which toggles it too; without one, name the box with `aria-label`. */
    label?: string;
    /** Whether it is ticked, when the caller holds the state (with `onChange`). */
    checked?: boolean;
    /** Whether it starts ticked, when the box holds its own state. */
    defaultChecked?: boolean;
    /** Neither ticked nor clear, for a box that stands for a group whose members are mixed (reads as "mixed"). */
    indeterminate?: boolean;
    /** Faded and out of reach, for a choice that doesn't apply. */
    disabled?: boolean;
    /** Called when the reader ticks or clears it. */
    onChange?: InputHTMLAttributes<HTMLInputElement>['onChange'];
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
    ({ label, indeterminate = false, 'aria-checked': ariaChecked, onChange, ...props }, ref) => {
        const inputRef = useRef<HTMLInputElement>(null);

        useImperativeHandle(ref, () => inputRef.current!);
        useLayoutEffect(() => {
            if (inputRef.current) inputRef.current.indeterminate = indeterminate;
        });

        const control = (
            <span className="relative inline-flex size-4 shrink-0 align-middle">
                <input
                    {...tabbable}
                    {...props}
                    ref={inputRef}
                    type="checkbox"
                    onChange={(event) => {
                        onChange?.(event);
                        event.currentTarget.indeterminate = indeterminate;
                    }}
                    aria-checked={indeterminate ? 'mixed' : ariaChecked}
                    className={`peer m-0 size-4 shrink-0 cursor-pointer appearance-none rounded-sm ${formChoiceClasses} checked:border-primary checked:bg-primary indeterminate:border-primary indeterminate:bg-primary forced-colors:appearance-auto`}
                />
                <span
                    aria-hidden="true"
                    data-slot="checkbox-tick"
                    className="text-primary-content pointer-events-none absolute inset-0 hidden items-center justify-center peer-checked:flex peer-indeterminate:hidden peer-disabled:opacity-50 forced-colors:hidden"
                >
                    {/* Centred in the box at a fixed size; a bare svg would take lucide's 24px and sit on a line box. */}
                    <CheckIcon className="size-3 shrink-0" strokeWidth={3} />
                </span>
                <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 hidden items-center justify-center peer-indeterminate:flex peer-disabled:opacity-50 forced-colors:hidden"
                >
                    <span className="bg-primary-content h-0.5 w-2 rounded-full" />
                </span>
            </span>
        );

        return label === undefined ? (
            control
        ) : (
            <label className="text-fg has-disabled:text-fg-muted inline-flex cursor-pointer items-center gap-2 text-sm has-disabled:cursor-default">
                {control}
                <span>{label}</span>
            </label>
        );
    },
);

Checkbox.displayName = 'Checkbox';
