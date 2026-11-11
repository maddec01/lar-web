import type { ReactNode } from 'react';

import { HelpTip } from '../overlays/HelpTip';

type DataAttributes = { [key: `data-${string}`]: string | boolean | undefined };

/**
 * Why a setting can't be changed, in a short muted line that wraps, in place of (or beside) its control: the `reason`,
 * a help popover with the whole `explanation` (`helpLabel` names its button), then the `action` that checks again,
 * such as an InlineLink with `onClick`.
 */
export function SettingsReason({
    reason,
    explanation,
    helpLabel,
    action,
}: {
    /** Why the setting can't be changed, in a short line. */
    reason: string;
    /** The whole explanation, in the help popover. */
    explanation?: ReactNode;
    /** The help button's accessible name; the reason by default. */
    helpLabel?: string;
    /** What the reader can do about it, after the reason. */
    action?: ReactNode;
}) {
    return (
        <span className="text-fg-muted inline-flex min-w-0 flex-wrap items-center gap-1 text-xs leading-4.5">
            <span>{reason}</span>
            {explanation ? <HelpTip label={helpLabel ?? reason}>{explanation}</HelpTip> : null}
            {action}
        </span>
    );
}

/** A settings group's note under its panel, such as what the group's last check found: small muted lines, stacked,
 *  aligned with the rows' text. `busy` marks it as still loading for assistive technology. */
export function SettingsNote({
    busy,
    children,
    ...data
}: {
    /** The note is still loading, for assistive technology. */
    busy?: boolean;
    /** The note's lines. */
    children: ReactNode;
} & DataAttributes) {
    return (
        <div {...data} className="text-fg-muted grid gap-2 px-4 text-xs leading-4.5" aria-busy={busy}>
            {children}
        </div>
    );
}

/** What a settings row shows under its title and control (its `below`), such as an install's progress or the paths a
 *  setting reads, in small stacked lines; `breaks` lets a long path break anywhere. */
export function SettingsDetails({
    breaks = false,
    children,
}: {
    /** Lets a long path break anywhere. */
    breaks?: boolean;
    /** The details' lines. */
    children: ReactNode;
}) {
    return <div className={`grid gap-2 text-xs leading-4.5 ${breaks ? 'wrap-anywhere' : ''}`}>{children}</div>;
}

/** A row's control with what goes under it (a note, an error, a second field), stacked and at most 20rem wide, so a
 *  control that grows a line under it keeps the row's control column. */
export function SettingsControl({
    children,
}: {
    /** The control and what goes under it. */
    children: ReactNode;
}) {
    return <div className="grid w-full max-w-80 min-w-0 gap-2 @md:w-auto">{children}</div>;
}

/** A small list of values a setting takes per place (each project's value, each library's), the name at the start
 *  and its value muted at the end, wrapping. Usually a row's `below`. */
export function SettingsValueList({
    label,
    rows,
}: {
    /** Names the list for screen readers. */
    label: string;
    /** Each place with its value. */
    rows: readonly { key: string; name: string; value: string }[];
}) {
    return (
        <ul className="m-0 grid list-none gap-1 p-0 text-xs leading-4.5" aria-label={label}>
            {rows.map(({ key, name, value }) => (
                <li key={key} className="flex flex-wrap justify-between gap-x-3">
                    <span className="wrap-anywhere">{name}</span>{' '}
                    <span className="text-fg-muted wrap-anywhere">{value}</span>
                </li>
            ))}
        </ul>
    );
}
