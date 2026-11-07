// The board's one work row (board/rows.css), in Queue, Shaping, Ready to build, Build and Concepts and linked work: a
// first line in columns that line up down the whole board, one button that opens the item's details with the row's
// action beside it, and under it a second line on the same columns.

import { ChevronDownIcon, ChevronRightIcon } from 'lucide-react';
import type { MouseEvent, ReactNode } from 'react';

import { Badge } from '../display/Badge';
import { Spinner } from '../feedback/Spinner';
import { pickedRow, ROW_ACTION, ROW_OPENS, ROW_RULE } from './RowStyles';

/** A stage row: `item` names it as `data-item`, and `picked` marks the item the dialog shows. */
export function StageRowItem({ item, picked, children }: { item: string; picked: boolean; children: ReactNode }) {
    return (
        <li data-item={item} className={`@container py-2 ${ROW_RULE} hover:bg-(--accent) ${pickedRow(picked)}`}>
            {children}
        </li>
    );
}

/** A row's first line: its cells, then its side. */
export function RowFirst({ children }: { children: ReactNode }) {
    return <div className="row-first">{children}</div>;
}

/** A row's first line's cells as the one button that opens its item. */
export function RowOpen({ onOpen, children }: { onOpen: () => void; children: ReactNode }) {
    return (
        <button type="button" data-row-open data-meta onClick={onOpen} className={`row-cols ${ROW_OPENS}`}>
            {children}
        </button>
    );
}

/** A row's first line's cells, when its title opens the item and the rest of the line does something else. */
export function RowCells({ children }: { children: ReactNode }) {
    return <div className="row-cols">{children}</div>;
}

/** The first cell: the item's status glyph. */
export function RowGlyph({ children }: { children: ReactNode }) {
    return (
        <span className="grid size-6 place-items-center" data-glyph>
            {children}
        </span>
    );
}

/** The first cell of a Queue row: its place in the Queue. */
export function QueuePlace({ children }: { children: ReactNode }) {
    return <span className="queue-n text-center font-medium tabular-nums">{children}</span>;
}

/** Where the item's ticket is saved and its repository, in the source cell. */
export function RowIdentity({ children }: { children: ReactNode }) {
    return (
        <span data-row-identity className="flex min-w-0 items-center gap-1.5 text-[11px] text-(--muted-foreground)">
            {children}
        </span>
    );
}

/** The kind cell. */
export function RowKindCell({ children }: { children: ReactNode }) {
    return (
        <span className="flex min-w-0 items-center" data-kind>
            {children}
        </span>
    );
}

/** The title cell: the RowTitle and what it is part of. */
export function RowTitleCell({ children }: { children: ReactNode }) {
    return (
        <span className="flex min-w-0 items-center gap-2" data-title-cell>
            {children}
        </span>
    );
}

/** The row's title, truncating; `name` gives it whole. */
export function RowTitle({ name, children }: { name: string; children: ReactNode }) {
    return (
        <span className="min-w-0 truncate text-sm leading-7 font-medium text-(--foreground)" title={name} data-title>
            {children}
        </span>
    );
}

/** After the title: which concept or parent the row's work belongs to, giving its room up first. */
export function RowPartOf({ children }: { children: string }) {
    return (
        <span
            data-concept
            title={children}
            className="max-w-44 min-w-16 shrink-[100] truncate rounded bg-(--muted) px-1.5 text-(--muted-foreground)"
        >
            {children}
        </span>
    );
}

/** The state cell, which `clips` what overflows it unless what it holds keeps its own width. */
export function RowStateCell({ clips = true, children }: { clips?: boolean; children: ReactNode }) {
    return (
        <span className={`flex min-w-0 items-center gap-1.5${clips ? ' overflow-hidden' : ''}`} data-col="state">
            {children}
        </span>
    );
}

/** The row's state in words; `title` says more. */
export function RowState({ title, children }: { title?: string; children: ReactNode }) {
    return (
        <span className="max-w-full shrink-0 truncate" title={title} data-state>
            {children}
        </span>
    );
}

/** A Queue row's state: how long it has waited. */
export function QueueAge({ children }: { children: ReactNode }) {
    return (
        <span className="queue-age shrink-0 tabular-nums" data-state>
            {children}
        </span>
    );
}

/** The row's action slot, at its right. With `passEmpty`, clicks on its controls stay there, and a click beside them
 *  reaches the row. */
export function RowSide({ passEmpty = false, children }: { passEmpty?: boolean; children: ReactNode }) {
    if (!passEmpty)
        return (
            <span data-col="side" className={`row-side ${ROW_ACTION}`}>
                {children}
            </span>
        );

    return (
        <span data-col="side" className="row-side">
            <span
                className={ROW_ACTION}
                onClick={(event) => {
                    if (event.target !== event.currentTarget) event.stopPropagation();
                }}
            >
                {children}
            </span>
        </span>
    );
}

/** Where to act on an item that waits on you, in its action slot. */
export function OnYourDesk({ children }: { children: ReactNode }) {
    return <span className="text-(--warning-foreground)">{children}</span>;
}

/** A row's second line: `bar` and `count` on the left, `children` in its text slot, then its pull requests and
 *  figures. A click on it beside its controls goes to `onClick`. */
export function RowSecondLine({
    bar,
    count,
    prs,
    figures,
    onClick,
    children,
}: {
    bar?: ReactNode;
    /** A RowCount or RowSliceToggle; with none, its cell stays empty. */
    count?: ReactNode;
    /** The pull requests, as PullRequestRefs. */
    prs?: ReactNode;
    figures?: ReactNode;
    onClick?: ((event: MouseEvent<HTMLElement>) => void) | undefined;
    children?: ReactNode;
}) {
    return (
        <div data-progress onClick={onClick} className={`row-second ${onClick ? 'cursor-pointer' : ''}`}>
            <span data-col="bar" className="min-w-0">
                {bar}
            </span>
            {count || <span data-col="count" />}
            <span data-col="next" className="flex min-w-0 items-center gap-3">
                {children}
            </span>
            <span data-col="pr" className="flex min-w-0 gap-2 overflow-hidden tabular-nums">
                {prs}
            </span>
            <span data-col="figures">{figures}</span>
        </div>
    );
}

/** The second line's count, such as `2/5 parts`. */
export function RowCount({ title, children }: { title?: string; children: ReactNode }) {
    return (
        <span data-col="count" className="tabular-nums" title={title}>
            {children}
        </span>
    );
}

/** The second line's slice count as a button that unfolds the row's slices under it. */
export function RowSliceToggle({
    open,
    label,
    onToggle,
    children,
}: {
    open: boolean;
    /** Names the button, as what it does now. */
    label: string;
    onToggle: () => void;
    children: ReactNode;
}) {
    return (
        <button
            type="button"
            aria-expanded={open}
            aria-label={label}
            onClick={onToggle}
            data-col="count"
            className={`flex h-4 items-center gap-1 justify-self-start rounded tabular-nums hover:text-(--foreground) ${ROW_OPENS}`}
        >
            {children}
            {open ? <ChevronDownIcon className="size-3" /> : <ChevronRightIcon className="size-3" />}
        </button>
    );
}

/** Why the row is blocked, as a danger badge in its second line that truncates. */
export function RowBlocked({ children }: { children: string }) {
    return (
        <Badge tone="danger" className="min-w-0" title={children} data-blocked>
            <span className="truncate">{children}</span>
        </Badge>
    );
}

const SLICE_TONE = { blocked: 'text-(--st-review)', active: 'text-(--st-now)' } as const;

/** The second line's word on the row's slices: its first blocked or active slice, `more` after it, and anything `after`
 *  that (such as that every slice is implemented); `title` lists them all. */
export function RowSliceNote({
    title,
    first,
    more,
    after,
}: {
    title?: string | undefined;
    first?: { word: string; tone: keyof typeof SLICE_TONE; title: string } | undefined;
    more?: string | undefined;
    after?: string | undefined;
}) {
    return (
        <span data-note className="min-w-0 truncate" title={title}>
            {first && (
                <>
                    <span className={`font-medium ${SLICE_TONE[first.tone]}`}>{first.word}</span>{' '}
                    <span className="text-(--foreground)">{first.title}</span>
                    {more}
                </>
            )}
            {after && <span>{after}</span>}
        </span>
    );
}

/** Under a row: Start's message or error and what Auto-build says of it, taking no room when empty. */
export function RowFoot({ children }: { children: ReactNode }) {
    return <div className="pt-1 pr-3 pl-12 empty:hidden">{children}</div>;
}

/** Under a row: its unfolded slices. */
export function RowSlices({ children }: { children: ReactNode }) {
    return (
        <div className="pt-1 pr-3 pl-10" data-slices>
            {children}
        </div>
    );
}

/** The agent figures on one line, at the row's right: `text`, ending in a + when `partial`, or `incomplete` when there
 *  are no figures to show; while `updating`, a spinner named by it leads them. A row that stops animating keeps its
 *  spinner `still`. */
export function UsageFigures({
    title,
    text,
    updating,
    still = false,
    partial,
    incomplete,
}: {
    title: string;
    text?: string | null | undefined;
    updating?: string | undefined;
    still?: boolean;
    /** Screen-reader words for the +. */
    partial?: string | undefined;
    /** The words in place of figures for an incomplete total with none to show. */
    incomplete?: string | undefined;
}) {
    return (
        <span
            className="flex min-w-0 items-center justify-end gap-1 text-(--muted-foreground) tabular-nums"
            title={title}
        >
            {updating && <Spinner title={updating} still={still} />}
            {text && <span className="truncate">{text}</span>}
            {text
                ? partial && (
                      <span className="-ml-1 shrink-0" data-partial>
                          +<span className="sr-only"> {partial}</span>
                      </span>
                  )
                : incomplete && <span className="shrink-0">{incomplete}</span>}
        </span>
    );
}
