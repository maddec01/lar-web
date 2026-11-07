// The frame of Lar Factory's item dialog: the summary under its title, the body's column with the main column and the
// sidebar beside it, its notes, and the footer's groups of actions.

import type { ReactNode } from 'react';

import type { DataAttributes } from './DataAttributes';
import { WARNING_PANEL } from './RowStyles';

/**
 * The summary under the dialog's title, a row each: `line` (the item's source, repository, status and age), its
 * `parent`, its `kind` and its ticket `actions`.
 */
export function ItemSummary({
    line,
    parent,
    kind,
    actions,
    ...data
}: {
    line: ReactNode;
    parent?: ReactNode;
    kind: ReactNode;
    actions: ReactNode;
} & DataAttributes) {
    return (
        <div
            {...data}
            className="border-base-300 text-base-700 @container grid shrink-0 gap-1 border-b px-5 pb-3 text-xs sm:px-6"
        >
            <div className="flex min-w-0 flex-wrap items-center gap-2">{line}</div>
            {parent}
            <div className="flex flex-wrap items-center gap-2">{kind}</div>
            <div className="flex flex-wrap items-start gap-2">{actions}</div>
        </div>
    );
}

/** The summary's status word, in the text colour. */
export function SummaryStatus({ children }: { children: ReactNode }) {
    return <span className="text-base-content font-medium">{children}</span>;
}

/** The summary's age, which a narrow dialog leaves out. */
export function SummaryAge({ children }: { children: ReactNode }) {
    return <span className="min-w-0 truncate @max-[30rem]:hidden">{children}</span>;
}

/** What blocks the item, as a small chip in the danger colours. */
export function SummaryBlocked({ children }: { children: ReactNode }) {
    return <span className="rounded bg-(--error-surface) px-1.5 text-(--error-foreground)">{children}</span>;
}

/** The item's parent: `prefix` ("Part of"), then its `name`, linked when `href` opens it. */
export function SummaryParent({
    prefix,
    name,
    href,
    ...data
}: {
    prefix: string;
    name: string;
    href?: string | undefined;
} & DataAttributes) {
    return (
        <p {...data} className="m-0 min-w-0 wrap-anywhere">
            {prefix}{' '}
            {href ? (
                <a href={href} target="_blank" rel="noopener" className="underline">
                    {name}
                </a>
            ) : (
                name
            )}
        </p>
    );
}

/** A labelled control the summary opens in place, such as Attach a ticket's picker: `label` over it. */
export function SummaryPanel({ label, children }: { label: string; children: ReactNode }) {
    return (
        <section aria-label={label} className="grid gap-1.5 pt-1">
            <span className="text-base-content text-xs font-medium">{label}</span>
            {children}
        </section>
    );
}

/**
 * The dialog body's column: the progress, notes, meta area, record, description, comments and sidebar, one under the
 * other; when it `fill`s, a column whose description and comments take what the rest leave.
 */
export function ItemDialogBody({ fill, children, ...data }: { fill: boolean; children: ReactNode } & DataAttributes) {
    return (
        <div
            {...data}
            className={`@container gap-3 pt-2 ${fill ? 'flex min-h-0 flex-1 flex-col' : 'grid grid-cols-[minmax(0,1fr)]'}`}
        >
            {children}
        </div>
    );
}

/**
 * The main column with the sidebar beside it once the dialog is 45rem wide, when there is an `aside`. Filling, the
 * main column's open editor takes the height the rest leaves.
 */
export function ItemDialogColumns({ aside, fill, children }: { aside: boolean; fill: boolean; children: ReactNode }) {
    const rows = fill
        ? 'min-h-0 flex-1 grid-rows-[minmax(0,1fr)_auto]'
        : aside
          ? '@min-[45rem]:grid-rows-[auto_1fr]'
          : '';

    return (
        <div
            className={`grid grid-cols-[minmax(0,1fr)] gap-x-6 gap-y-4 ${aside ? '@min-[45rem]:grid-cols-[minmax(0,1fr)_16rem]' : ''} ${rows}`}
        >
            {children}
        </div>
    );
}

/** The sidebar beside the main column, ruled off from it once there is room. */
export function ItemDialogAside({ children }: { children: ReactNode }) {
    return (
        <aside className="grid min-w-0 grid-cols-[minmax(0,1fr)] content-start gap-4 @min-[45rem]:col-start-2 @min-[45rem]:row-span-2 @min-[45rem]:row-start-1 @min-[45rem]:border-l @min-[45rem]:border-(--border) @min-[45rem]:pl-6">
            {children}
        </aside>
    );
}

/** A warning about the item, such as why it is paused, in the warning panel: `icon` (a status glyph) before it when
 *  given. */
export function WarningNote({ icon, children, ...data }: { icon?: ReactNode; children: ReactNode } & DataAttributes) {
    if (icon)
        return (
            <div {...data} className={`flex items-center gap-3 ${WARNING_PANEL}`}>
                {icon}
                <span className="min-w-0 flex-1 font-medium text-(--warning-foreground)">{children}</span>
            </div>
        );

    return (
        <p {...data} className={`m-0 ${WARNING_PANEL} font-medium text-(--warning-foreground)`}>
            {children}
        </p>
    );
}

/** Why the factory can't write to the item's tracker, announced, and the `action` that checks again. */
export function AccessNotice({ message, action }: { message: string; action: ReactNode }) {
    return (
        <div role="status">
            <p>{message}</p>
            {action}
        </div>
    );
}

/** A group of the footer's actions: the `leading` ones that move the item, in small text, or the rest at its end. */
export function DialogActions({
    presentation = 'trailing',
    children,
}: {
    presentation?: 'leading' | 'trailing';
    children: ReactNode;
}) {
    return (
        <span
            className={
                presentation === 'leading'
                    ? 'inline-flex items-center gap-3 text-xs'
                    : 'inline-flex items-center gap-1.5'
            }
        >
            {children}
        </span>
    );
}

const buttonRows = {
    row: 'flex gap-2',
    wrap: 'flex flex-wrap gap-2',
    status: 'flex flex-wrap items-center gap-3',
} as const;

/** A row of a section's buttons: on one line, wrapping, or wrapping with a `status` beside them. */
export function ButtonRow({ layout = 'row', children }: { layout?: keyof typeof buttonRows; children: ReactNode }) {
    return <span className={buttonRows[layout]}>{children}</span>;
}
