// An expanded dossier's attention list: what keeps its work moving, as labelled rows of entries, and the parts and
// references its entries name.

import { BanIcon, CheckIcon, CircleHelpIcon } from 'lucide-react';
import type { ReactNode } from 'react';

import type { DataAttributes } from './DataAttributes';
import { ROW_OPENS } from './RowStyles';

const TONE = {
    yours: 'text-(--warning-foreground)',
    decision: 'text-(--primary)',
    blocked: 'text-(--st-review)',
    waiting: 'text-(--muted-foreground)',
    ready: 'text-(--st-now)',
    fog: 'text-(--st-amber)',
} as const;

/** An attention row's tone, which colours its label. */
export type AttentionTone = keyof typeof TONE;

/** The attention rows, each a label in its tone with how many entries it has, then its entries. */
export function AttentionList({
    rows,
}: {
    rows: { key: string; label: string; tone: AttentionTone; entries: ReactNode[] }[];
}) {
    return (
        // The labels' column is 7.5rem, or as wide as the longest label so none wraps ("To verify or merge" needs more).
        <dl className="m-0 grid grid-cols-[minmax(7.5rem,max-content)_minmax(0,1fr)] gap-x-4 gap-y-2" data-attention>
            {rows.map((r) => (
                <div key={r.key} className="contents" data-attention-row={r.key}>
                    <dt
                        className={`pt-2 text-[11px] font-medium tracking-wide whitespace-nowrap uppercase ${TONE[r.tone]}`}
                    >
                        {r.label} <span className="tabular-nums">{r.entries.length}</span>
                    </dt>
                    <dd className="m-0 grid gap-1">{r.entries}</dd>
                </div>
            ))}
        </dl>
    );
}

/** What the attention list says when nothing holds the work up. */
export function AttentionNone({ children }: { children: ReactNode }) {
    return (
        <p className="m-0 text-[13px] text-(--muted-foreground)" data-attention-none>
            {children}
        </p>
    );
}

/** One entry of an attention row, with what it waits on or its next action at the right. */
export function AttentionEntry({ main, side }: { main: ReactNode; side?: ReactNode }) {
    return (
        <div className="flex min-h-9 min-w-0 flex-wrap items-center justify-between gap-x-3 gap-y-1 rounded-md px-2 py-1.5 hover:bg-(--soft)">
            <span className="min-w-0 flex-1 basis-64">{main}</span>
            {side && <span className="ml-auto shrink-0 text-xs text-(--muted-foreground)">{side}</span>}
        </div>
    );
}

/** An entry's text as a plain button that opens what it names. */
export function EntryButton({ onOpen, children }: { onOpen: () => void; children: ReactNode }) {
    return (
        <button type="button" onClick={onOpen}>
            {children}
        </button>
    );
}

/** A reference to an item, such as `#12`, as a button that opens it; `title` names it. */
export function RefButton({ title, onOpen, children }: { title: string; onOpen: () => void; children: ReactNode }) {
    return (
        <button
            type="button"
            onClick={onOpen}
            title={title}
            className="rounded px-0.5 font-medium text-(--primary) tabular-nums hover:bg-(--accent)"
        >
            {children}
        </button>
    );
}

const MARKS = {
    blocked: <BanIcon className="mt-0.5 size-3.5 shrink-0 text-(--st-review)" />,
    met: <CheckIcon className="mt-0.5 size-3.5 shrink-0 text-(--st-done)" />,
    fog: <CircleHelpIcon className="mt-0.5 size-3.5 shrink-0 text-(--st-amber)" />,
} as const;

/** An entry's text after a mark: blocked, met, or an open question (fog). `clamp` keeps it to two lines. */
export function AttentionMark({
    mark,
    clamp = false,
    children,
    ...data
}: {
    mark: keyof typeof MARKS;
    clamp?: boolean;
    children: ReactNode;
} & DataAttributes) {
    return (
        <span {...data} className={`flex ${clamp ? 'min-w-0 ' : ''}items-start gap-1.5 text-[13px]`}>
            {MARKS[mark]}
            <span className={clamp ? 'line-clamp-2' : undefined}>{children}</span>
        </span>
    );
}

/** A part's source, status glyph and title, up to two lines. */
export function PartName({ source, glyph, children }: { source: ReactNode; glyph: ReactNode; children: ReactNode }) {
    return (
        <span className="flex min-w-0 items-start gap-1.5 text-sm">
            {source}
            <span className="mt-0.5 inline-flex">{glyph}</span>
            <span className="line-clamp-2">{children}</span>
        </span>
    );
}

/** A part's PartName as a button that opens it; `title` names it. */
export function PartLink({ title, onOpen, children }: { title: string; onOpen: () => void; children: ReactNode }) {
    return (
        <button
            type="button"
            onClick={onOpen}
            title={title}
            className={`min-w-0 rounded text-left hover:underline ${ROW_OPENS}`}
        >
            {children}
        </button>
    );
}
