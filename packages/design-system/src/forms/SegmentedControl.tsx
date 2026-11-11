import { useSegmentedKeyboard } from './useSegmentedKeyboard';

/** One choice of a SegmentedControl. */
export interface SegmentedControlOption<V extends string> {
    /** The value `onValueChange` hears when it is chosen. */
    value: V;
    /** The choice's words, short: "Automatic", "Manual". */
    label: string;
    /** Shown but can't be chosen. */
    disabled?: boolean;
}

export interface SegmentedControlProps<V extends string> {
    /** Names the choice for screen readers, such as "Router forwarding", when no visible label is tied to it. */
    'aria-label'?: string;
    /** The id of the visible label that names it, such as a settings row's title. */
    'aria-labelledby'?: string;
    /** The two to four choices, in reading order. */
    options: readonly SegmentedControlOption<V>[];
    /** The chosen value. */
    value: V;
    /** Called with the value the reader chooses. */
    onValueChange: (value: V) => void;
    /** Out of reach, and drawn so. */
    disabled?: boolean;
}

/**
 * One of two to four short, mutually exclusive choices in a form, side by side in a field's height (32px), the chosen
 * one raised, such as a router forwarding's "Automatic" or "Manual". It is a radio group: Tab reaches the chosen
 * choice, the arrow keys move and choose. Use it, not a pair of outlined buttons, wherever buttons would act as a
 * choice; a RadioGroup when the choices need sentences, a Select when there are more.
 */
export function SegmentedControl<V extends string>({
    options,
    value,
    onValueChange,
    disabled = false,
    ...names
}: SegmentedControlProps<V>) {
    const enabled = options.filter((option) => !option.disabled && !disabled).map((option) => option.value);
    const { group, stop, onKeyDown } = useSegmentedKeyboard(enabled, value, onValueChange);

    return (
        <div
            ref={group}
            role="radiogroup"
            {...names}
            aria-disabled={disabled || undefined}
            onKeyDown={onKeyDown}
            data-slot="segmented-control"
            className="bg-fill-muted inline-flex h-8 max-w-full min-w-0 items-stretch gap-0.5 rounded-lg p-0.5"
        >
            {options.map((option) => {
                const checked = option.value === value;

                return (
                    <button
                        key={option.value}
                        type="button"
                        role="radio"
                        aria-checked={checked}
                        data-value={option.value}
                        tabIndex={option.value === stop ? 0 : -1}
                        disabled={disabled || option.disabled}
                        onClick={() => onValueChange(option.value)}
                        className={`focus-ring min-w-0 truncate rounded-md px-3 text-(length:--text-ui) font-medium whitespace-nowrap transition-colors disabled:opacity-64 ${
                            checked ? 'segment-chosen' : 'text-fg-muted hover:text-fg disabled:hover:text-fg-muted'
                        }`}
                    >
                        {option.label}
                    </button>
                );
            })}
        </div>
    );
}
