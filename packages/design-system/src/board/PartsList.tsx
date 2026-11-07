// An expanded dossier's parts list: each part with what it asks next, its stage track, figures, thread and slices, the
// done parts folded away; and a part's kind as every surface of the dossier names it.

import { BookOpenIcon, HammerIcon, ListChecksIcon, MessagesSquareIcon, ShapesIcon } from 'lucide-react';
import type { ReactNode } from 'react';

import { pickedRow, ROW_OPENS } from './RowStyles';

const KIND_ICON = {
    grill: MessagesSquareIcon,
    prototype: ShapesIcon,
    research: BookOpenIcon,
    task: ListChecksIcon,
    decision: MessagesSquareIcon,
    build: HammerIcon,
} as const;

/** What a dossier's part is: a decision's method, or a build. */
export type PartKind = keyof typeof KIND_ICON;

/** A part's method or kind with its icon, in the one place and style every dossier surface shows it. */
export function PartKindLabel({ kind, children }: { kind: PartKind; children: ReactNode }) {
    const Icon = KIND_ICON[kind];

    return (
        <span
            className="inline-flex shrink-0 items-center gap-1.5 text-[11px] text-(--muted-foreground)"
            data-part-kind
        >
            <Icon className="size-3.5 shrink-0" />
            {children}
        </span>
    );
}

/** The parts, in two columns where there's room, then `showDone`, the button that unfolds the done ones. */
export function PartsList({ showDone, children }: { showDone?: ReactNode; children: ReactNode }) {
    return (
        <div className="grid gap-1">
            <ol className="m-0 grid list-none gap-x-4 gap-y-1 p-0 @4xl:grid-cols-2" data-parts-list>
                {children}
            </ol>
            {showDone}
        </div>
    );
}

/** The button under the parts that shows or hides the done ones. */
export function ShowDoneToggle({
    open,
    onToggle,
    children,
}: {
    open: boolean;
    onToggle: () => void;
    children: string;
}) {
    return (
        <button
            type="button"
            aria-expanded={open}
            onClick={onToggle}
            className="justify-self-start rounded px-2 py-1 text-[11px] text-(--muted-foreground) hover:bg-(--accent)"
        >
            {children}
        </button>
    );
}

/**
 * A part: one button opens its item from its `name` and `meta` (kind, repository, track, status), what it asks next
 * (`action`) sits beside that button, then its `second` line (a RowSecondLine) and any `foot`, its start's message or
 * error, under that.
 */
export function PartRow({
    id,
    picked,
    title,
    onOpen,
    name,
    meta,
    action,
    second,
    foot,
}: {
    id: string;
    picked: boolean;
    title: string;
    onOpen: () => void;
    name: ReactNode;
    meta: ReactNode;
    action: ReactNode;
    second?: ReactNode;
    foot?: ReactNode;
}) {
    return (
        <li data-part={id} className={`@container rounded-md px-3 py-2 hover:bg-(--accent) ${pickedRow(picked)}`}>
            <div className="flex items-start gap-x-3">
                <button
                    type="button"
                    data-row-open
                    onClick={onOpen}
                    title={title}
                    className={`grid min-w-0 flex-1 gap-y-1 rounded text-left ${ROW_OPENS}`}
                >
                    {name}
                    <span
                        className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1 pl-5 text-xs text-(--muted-foreground)"
                        data-part-meta
                    >
                        {meta}
                    </span>
                </button>
                <span
                    data-part-action
                    className="flex min-h-7 shrink-0 items-center justify-end gap-2 text-xs text-(--muted-foreground)"
                >
                    {action}
                </span>
            </div>
            {second}
            {foot && <span className="block pt-1 pl-5 empty:hidden">{foot}</span>}
        </li>
    );
}

/** A part's stage track in its meta line, at a fixed width so the tracks line up. */
export function PartTrack({ children }: { children: ReactNode }) {
    return <span className="w-28 shrink-0">{children}</span>;
}

/** What a part waits on, beside its action, truncating. */
export function PartWaits({ children }: { children: string }) {
    return (
        <span className="max-w-48 truncate" title={children}>
            {children}
        </span>
    );
}

/** A part's thread in its second line: its glyph, `name` and `state`; `title` names it in full. */
export function ThreadLine({
    glyph,
    name,
    state,
    title,
}: {
    glyph: ReactNode;
    name: string;
    state: string;
    title?: string | undefined;
}) {
    return (
        <span className="flex min-w-0 items-center gap-1.5" title={title}>
            {glyph}
            <span className="truncate">{name}</span>
            <span className="shrink-0">· {state}</span>
        </span>
    );
}
