import { forwardRef, type KeyboardEvent, type ReactNode, useRef } from 'react';
import { flushSync } from 'react-dom';

import { Select, SelectItem, type SelectProps } from './Select';

const NONE = '__none';

export interface FormSelectChoice {
    value: string;
    name: string;
    icon?: ReactNode;
    /** A lar-brand app hue that colours the icon, such as a kind's. */
    hue?: number;
    disabled?: boolean;
}

export interface FormSelectProps extends Omit<
    SelectProps,
    'value' | 'defaultValue' | 'onValueChange' | 'children' | 'className' | 'size' | 'variant'
> {
    value: string;
    onChange: (value: string) => void;
    choices: readonly FormSelectChoice[];
    /** The name of the choice that empties the value; without it, an empty value shows the placeholder. */
    none?: string;
    /** A pick writes at once, so a letter key on the closed control doesn't pick: the Select's typeahead only works once its list is open. */
    writesOnPick?: boolean;
    /** Busy rather than disabled while a pick it made saves: it keeps the focus and ignores picks. */
    busy?: boolean;
    /** `setting` is a settings row's 11rem dropdown; a `field` fills its container. */
    presentation?: 'field' | 'setting';
}

/** Marks a letter key as handled, which the Select's trigger takes as leaving its typeahead out. Space and arrows still open the list. */
const withoutClosedTypeahead = (event: KeyboardEvent) => {
    if (event.key.length === 1 && event.key !== ' ' && !event.ctrlKey && !event.altKey && !event.metaKey)
        event.preventDefault();
};

/**
 * Select over plain choices, for a form to read. Select is a button over a listbox: its items can't have an empty value
 * and it fires no input event, so this holds "none" as a stand-in, gives the form the value in a hidden field, and fires
 * input on that field once a pick has rendered.
 */
export const FormSelect = forwardRef<HTMLButtonElement, FormSelectProps>(
    ({ name, value, onChange, choices, none, writesOnPick, presentation = 'field', busy = false, ...props }, ref) => {
        const field = useRef<HTMLInputElement>(null);
        const pick = (item: string) => {
            if (busy) return;

            flushSync(() => onChange(item === NONE ? '' : item));
            field.current?.dispatchEvent(new Event('input', { bubbles: true }));
        };

        const select = (
            <>
                {name && <input ref={field} type="hidden" name={name} value={value} />}
                <Select
                    {...props}
                    {...(writesOnPick && { onKeyDown: withoutClosedTypeahead })}
                    {...(busy && { 'aria-disabled': true })}
                    ref={ref}
                    value={value || (none ? NONE : '')}
                    onValueChange={pick}
                >
                    {none && <SelectItem value={NONE}>{none}</SelectItem>}
                    {choices.map((choice) => (
                        <SelectItem
                            key={choice.value}
                            value={choice.value}
                            icon={choice.icon}
                            iconHue={choice.hue}
                            textValue={choice.name}
                            disabled={choice.disabled}
                        >
                            {choice.name}
                        </SelectItem>
                    ))}
                </Select>
            </>
        );

        return presentation === 'setting' ? <span className="block w-44 max-w-full">{select}</span> : select;
    },
);

FormSelect.displayName = 'FormSelect';
