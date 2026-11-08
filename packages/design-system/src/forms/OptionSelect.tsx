import { type CSSProperties, type KeyboardEvent, type ReactNode, type Ref, useRef } from 'react';
import { flushSync } from 'react-dom';

import { SkeletonLoader } from '../feedback/SkeletonLoader';
import { SelectBase, SelectItem, type SelectProps } from './Select';

const NONE = '__none';

export interface OptionSelectOption<Value extends string = string> {
    /** The option's name in the list and, once picked, in the field. */
    label: string;
    /** What `onChange` hears when it is picked. */
    value: Value;
    /** Disabled options stay visible but cannot be chosen. */
    disabled?: boolean;
    /** An icon before the label. */
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
    /** Draws a control-shaped skeleton while the options load; a loading select needs only its `label`. */
    loading?: false;
    /** Called with the value of the option the reader picks. */
    onChange: (value: Value) => void;
    /** The options, in order. */
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
    /** `setting` is a settings row's 13rem dropdown; a `field` fills its container; `inline` is a value in a row of facts
     *  that edits in place: the value and its chevron, no field edge, a fill under the pointer. `badge` is an editable kind badge in the selected option’s hue. */
    presentation?: 'field' | 'setting' | 'inline' | 'badge';
    /** The select's trigger button. */
    ref?: Ref<HTMLButtonElement>;
}

interface LoadingOptionSelectProps {
    /** Names what is loading for screen readers. */
    label: string;
    /** Draws a control-shaped skeleton in the select's place. */
    loading: true;
}

type OptionSelectProps<Value extends string> = LoadedOptionSelectProps<Value> | LoadingOptionSelectProps;

/** Marks a letter key as handled, which the Select's trigger takes as leaving its typeahead out. Space and arrows still
 *  open the list. */
const withoutClosedTypeahead = (event: KeyboardEvent) => {
    if (event.key.length === 1 && event.key !== ' ' && !event.ctrlKey && !event.altKey && !event.metaKey)
        event.preventDefault();
};

const inlineClasses =
    'text-fg hover:bg-fill-hover data-[state=open]:bg-fill-selected focus-ring h-7 w-max gap-1.5 rounded-md px-1.5 text-sm disabled:opacity-50';

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
    const selectedHue = options.find((option) => option.value === value)?.hue;
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
            <SelectBase
                {...select}
                {...(label !== undefined && { 'aria-label': label })}
                {...(writesOnPick && { onKeyDown: withoutClosedTypeahead })}
                {...(busy && { 'aria-disabled': true })}
                {...(presentation === 'inline' && { variant: 'unstyled', className: inlineClasses })}
                {...(presentation === 'badge' && {
                    variant: 'unstyled',
                    className: `focus-ring h-5 w-max gap-1 rounded-full px-2 text-xs font-medium ring-1 ring-inset hover:brightness-95 disabled:opacity-50 ${selectedHue === undefined ? 'bg-fill-muted text-fg ring-line' : 'kind-badge!'}`,
                    style: selectedHue === undefined ? undefined : ({ '--lar-kind-hue': selectedHue } as CSSProperties),
                })}
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
            </SelectBase>
        </>
    );

    if (presentation === 'setting') return <span className="block w-52 max-w-full">{control}</span>;

    return presentation === 'inline' ? <span className="-mx-1.5 inline-block max-w-full">{control}</span> : control;
}
