import { type ReactNode, useId } from 'react';

import { tabbable } from '../foundations/KeyboardFocus';

/** One radio result in a ResultList choice: a concise label, optional trailing source link, and a detail block
 *  outside the label. The containing dialog owns the single action that continues with the chosen result. */
export function ResultChoice({
    name,
    checked,
    onChange,
    children,
    trailing,
    detail,
}: {
    /** The shared native radio name, unique to this list. */
    name: string;
    checked: boolean;
    onChange: () => void;
    /** The result’s title and short identifying facts. */
    children: ReactNode;
    /** A source link or badge, outside the radio label. */
    trailing?: ReactNode;
    /** Optional supporting information, outside the radio label so it may contain links. */
    detail?: ReactNode;
}) {
    const detailId = useId();

    return (
        <div className="hover:bg-fill-hover has-checked:bg-primary-surface min-w-0 transition-colors has-disabled:opacity-60">
            <div className="focus-ring-within flex min-w-0 items-center gap-3">
                <label className="flex min-w-0 flex-1 cursor-pointer items-center gap-3 px-4 py-3 has-disabled:cursor-default">
                    <input
                        {...tabbable}
                        type="radio"
                        name={name}
                        checked={checked}
                        onChange={onChange}
                        aria-describedby={detail ? detailId : undefined}
                        className="accent-primary size-4 shrink-0"
                    />
                    <span className="min-w-0 flex-1">{children}</span>
                </label>
                {trailing ? <div className="flex shrink-0 items-center gap-3 pr-4">{trailing}</div> : null}
            </div>
            {detail ? (
                <div id={detailId} className="min-w-0 pr-4 pb-3 pl-11 text-sm">
                    {detail}
                </div>
            ) : null}
        </div>
    );
}
