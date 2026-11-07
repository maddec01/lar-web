import { type KeyboardEvent, type ReactNode, type Ref, useRef } from 'react';
import { flushSync } from 'react-dom';

import { SkeletonLoader } from '../feedback/SkeletonLoader';
import { Select, SelectItem, type SelectProps } from './Select';

const NONE = '__none';

export interface OptionSelectOption<Value extends string = string> {
    label: string;
    value: Value;
    /** Disabled options stay visible but cannot be chosen. */
    disabled?: boolean;
    icon?: ReactNode;
    /** A lar-brand app hue that colours the icon, such as a kind's. */
    hue?: number;
}

interface LoadedOptionSelectProps<Value extends string> extends Omit<
    SelectProps,
    'value' | 'defaultValue' | 'onValueChange' | 'onChange' | 'children' | 'className' | 'size' | 'variant'
> {
    /** The select's accessible name; leave it out when a label names the select by its `id`. */
    label?: string;
    loading?: false;
    onChange: (value: Value) => void;
    options: readonly OptionSelectOption<Value>[];
    /** An empty value shows the placeholder, or `none`. */
    value: Value | '';
    /** The name of the option that empties the value, which `onChange` hears as ''. */
    none?: string;
    /** A form field's name: the select gives its form the value in a hidden field, and fires input on that field once
     *  a pick has rendered, as Select is a button over a listbox that fires no input event of its own. */
    name?: string;
    /** A pick writes at once, so a letter key on the closed control doesn't pick: the Select's typeahead only works
     *  once its list is open. */
    writesOnPick?: boolean;
    /** Busy rather than disabled while a pick it made saves: it keeps the focus and ignores picks. */
    busy?: boolean;
    /** `setting` is a settings row's 11rem dropdown; a `field` fills its container. */
    presentation?: 'field' | 'setting';
    ref?: Ref<HTMLButtonElement>;
}

interface LoadingOptionSelectProps {
    label: string;
    loading: true;
}

type OptionSelectProps<Value extends string> = LoadedOptionSelectProps<Value> | LoadingOptionSelectProps;

/** Marks a letter key as handled, which the Select's trigger takes as leaving its typeahead out. Space and arrows still
 *  open the list. */
const withoutClosedTypeahead = (event: KeyboardEvent) => {
    if (event.key.length === 1 && event.key !== ' ' && !event.ctrlKey && !event.altKey && !event.metaKey)
        event.preventDefault();
};

/** A Select over plain options, each with an optional icon; while they load, a control-shaped skeleton. */
export function OptionSelect<Value extends string>(props: OptionSelectProps<Value>) {
    const field = useRef<HTMLInputElement>(null);

    if (props.loading)
        return (
            <SkeletonLoader label={props.label}>
                <SkeletonLoader.Shape presentation="control" />
            </SkeletonLoader>
        );

    const {
        label,
        loading: _loading,
        onChange,
        options,
        value,
        none,
        name,
        writesOnPick,
        busy = false,
        presentation = 'field',
        ...select
    } = props;
    const pick = (next: string) => {
        if (busy) return;

        if (none && next === NONE) {
            change(() => onChange('' as Value));

            return;
        }

        const option = options.find((candidate) => candidate.value === next);

        if (option) change(() => onChange(option.value));
    };
    const change = (write: () => void) => {
        if (!name) return write();

        flushSync(write);
        field.current?.dispatchEvent(new Event('input', { bubbles: true }));
    };

    const control = (
        <>
            {name && <input ref={field} type="hidden" name={name} value={value} />}
            <Select
                {...select}
                {...(label !== undefined && { 'aria-label': label })}
                {...(writesOnPick && { onKeyDown: withoutClosedTypeahead })}
                {...(busy && { 'aria-disabled': true })}
                value={value || (none ? NONE : '')}
                onValueChange={pick}
            >
                {none && <SelectItem value={NONE}>{none}</SelectItem>}
                {options.map((option) => (
                    <SelectItem
                        key={option.value}
                        value={option.value}
                        disabled={option.disabled}
                        {...(option.icon !== undefined && {
                            icon: option.icon,
                            iconHue: option.hue,
                            textValue: option.label,
                        })}
                    >
                        {option.label}
                    </SelectItem>
                ))}
            </Select>
        </>
    );

    return presentation === 'setting' ? <span className="block w-44 max-w-full">{control}</span> : control;
}
