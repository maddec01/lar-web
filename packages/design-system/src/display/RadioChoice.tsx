import type { ReactNode } from 'react';

import { tabbable } from '../foundations/KeyboardFocus';

type DataAttributes = { [key: `data-${string}`]: string | undefined };

/** One choice of a group of radios, a row of an InsetPanel's `settings` panel: the radio and its content, which can
 *  shrink so a long title in it truncates, then any `trailing` content. Data attributes, such as the value it names,
 *  go on the row. */
export function RadioChoice({
    name,
    checked,
    onChange,
    children,
    trailing,
    ...data
}: {
    /** The radio group's form name, the same for every choice of the group. */
    name: string;
    /** Whether this is the chosen one. */
    checked: boolean;
    /** Called when the reader picks it. */
    onChange: () => void;
    /** The choice's label and any detail under it. */
    children: ReactNode;
    /** Content at the row's end, outside the label, such as a link to the choice's settings. */
    trailing?: ReactNode;
} & DataAttributes) {
    return (
        <div
            {...data}
            className="hover:bg-fill-hover has-checked:bg-primary-surface focus-ring-within flex min-w-0 items-center gap-3 transition-colors has-disabled:opacity-60"
        >
            <label className="flex min-w-0 flex-1 cursor-pointer items-center gap-3 px-4 py-3 has-disabled:cursor-default">
                <input
                    {...tabbable}
                    type="radio"
                    name={name}
                    checked={checked}
                    onChange={onChange}
                    className="accent-primary size-4 shrink-0"
                />
                <span className="min-w-0 flex-1">{children}</span>
            </label>
            {trailing ? <div className="flex shrink-0 items-center gap-3 pr-4">{trailing}</div> : null}
        </div>
    );
}
