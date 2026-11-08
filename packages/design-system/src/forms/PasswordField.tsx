import { useFormControl } from '@ninna-ui/forms';
import { CheckIcon, CircleIcon, EyeIcon, EyeOffIcon } from 'lucide-react';
import { forwardRef, useId, useState } from 'react';

import { IconButton } from '../actions/IconButton';
import { Field } from './Field';
import { InputBase, type InputProps } from './Input';

export interface PasswordFieldProps extends Omit<
    InputProps,
    'type' | 'presentation' | 'clearable' | 'onClear' | 'showCounter' | 'invalid'
> {
    /** The field's label, such as "Password". */
    label: string;
    /** Names the toggle while the password is hidden, such as "Show password". */
    showLabel: string;
    /** Names the toggle while the password shows, such as "Hide password". */
    hideLabel: string;
    /** What a new password needs, under the field, such as "At least 12 characters". Leave it out when signing in. */
    requirement?: string;
    /** Whether the value meets `requirement`: its mark turns into a tick in the success colour. */
    requirementMet?: boolean;
    /** What is wrong, in the danger colour while `invalid`, such as "That password isn't right". */
    errorText?: string;
    /** Marks the value as wrong and shows `errorText`. */
    invalid?: boolean;
    /** Starts with the password showing. */
    defaultRevealed?: boolean;
    /** Marks the label as required. */
    required?: boolean;
}

/** Lar's password field: a labelled text field whose password the reader can show and hide (a toggle at its end, named
 *  by `showLabel`/`hideLabel` and pressed while showing), with an optional requirement under it that ticks once met.
 *  Pass `autoComplete` ("current-password" to sign in, "new-password" to set one). */
export const PasswordField = forwardRef<HTMLInputElement, PasswordFieldProps>(
    (
        {
            label,
            showLabel,
            hideLabel,
            requirement,
            requirementMet = false,
            errorText,
            invalid = false,
            defaultRevealed = false,
            required,
            disabled,
            id,
            ...props
        },
        ref,
    ) => (
        <Field label={label} errorText={errorText} invalid={invalid} required={required} disabled={disabled} id={id}>
            <PasswordControl
                ref={ref}
                {...props}
                disabled={disabled}
                invalid={invalid}
                hasError={invalid && Boolean(errorText)}
                showLabel={showLabel}
                hideLabel={hideLabel}
                requirement={requirement}
                requirementMet={requirementMet}
                defaultRevealed={defaultRevealed}
            />
        </Field>
    ),
);

PasswordField.displayName = 'PasswordField';

type PasswordControlProps = Omit<PasswordFieldProps, 'label' | 'errorText' | 'required' | 'id'> & {
    hasError: boolean;
};

/** The input, its toggle and the requirement, inside the Field (whose ids it reads). */
const PasswordControl = forwardRef<HTMLInputElement, PasswordControlProps>(
    (
        {
            showLabel,
            hideLabel,
            requirement,
            requirementMet,
            defaultRevealed,
            hasError,
            'aria-describedby': describedBy,
            ...props
        },
        ref,
    ) => {
        const [revealed, setRevealed] = useState(defaultRevealed);
        const formControl = useFormControl();
        const requirementId = useId();
        const descriptions = [
            describedBy,
            requirement ? requirementId : undefined,
            hasError ? formControl?.messageId : undefined,
        ]
            .filter(Boolean)
            .join(' ');

        return (
            <div className="flex flex-col gap-1.5">
                <div className="relative">
                    <InputBase
                        ref={ref}
                        spellCheck={false}
                        autoCapitalize="off"
                        {...props}
                        type={revealed ? 'text' : 'password'}
                        aria-describedby={descriptions || undefined}
                        // Room for the toggle at the end, so the text never runs under it.
                        className="pr-9"
                    />
                    <span className="absolute inset-y-0 right-0.5 flex items-center">
                        <IconButton
                            variant="title-bar"
                            aria-label={revealed ? hideLabel : showLabel}
                            aria-pressed={revealed}
                            disabled={props.disabled}
                            icon={revealed ? <EyeOffIcon /> : <EyeIcon />}
                            onClick={() => setRevealed((now) => !now)}
                        />
                    </span>
                </div>
                {requirement ? (
                    <p
                        id={requirementId}
                        data-met={requirementMet || undefined}
                        className="text-fg-muted m-0 flex items-center gap-1.5 text-xs"
                    >
                        <span aria-hidden="true" className="flex size-3.5 shrink-0 items-center justify-center">
                            {requirementMet ? (
                                <CheckIcon className="text-success-fg size-3.5" strokeWidth={2.5} />
                            ) : (
                                <CircleIcon className="size-2.5" />
                            )}
                        </span>
                        {requirement}
                    </p>
                ) : null}
            </div>
        );
    },
);

PasswordControl.displayName = 'PasswordControl';
