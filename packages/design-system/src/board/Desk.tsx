import type { ReactNode } from 'react';

interface DeskSectionProps {
    title: string;
    /** How many cards show; with none, `empty` says why in one small line. */
    count: number;
    empty?: ReactNode;
    children?: ReactNode;
}

/** "Your desk": the items awaiting your action as small cards in one row that scrolls sideways under the page's padding
 *  to the window's edges. An empty desk is one small line. */
export function DeskSection({ title, count, empty, children }: DeskSectionProps) {
    if (!count)
        return (
            <section
                className="desk flex shrink-0 items-baseline gap-2 text-xs text-(--muted-foreground)"
                aria-labelledby="desk-h"
            >
                <h2 id="desk-h" className="m-0 text-[13px] font-medium text-(--foreground)">
                    {title}
                </h2>
                <p className="m-0">{empty}</p>
            </section>
        );

    return (
        <section className="desk grid shrink-0 gap-2" aria-labelledby="desk-h">
            <h2 id="desk-h" className="m-0 text-[13px] font-medium">
                {title} <span className="text-(--muted-foreground)">{count}</span>
            </h2>
            <div className="-mx-6 flex [scrollbar-width:none] items-start gap-3 overflow-x-auto px-6 py-1 [&::-webkit-scrollbar]:hidden">
                {children}
            </div>
        </section>
    );
}

interface DeskCardProps {
    /** The item's id, as `data-item`. */
    item: string;
    /** Whether the item dialog shows this item now. */
    picked: boolean;
    onOpen: () => void;
    /** The first row: where the item comes from, its kind and its age. */
    source: ReactNode;
    kind: ReactNode;
    age: ReactNode;
    title: ReactNode;
    /** The title's full text, for its tooltip. */
    name: string;
    /** More about the item under its title, such as a work item's fields. */
    details?: ReactNode;
    statusIcon: ReactNode;
    status: string;
    /** Beside the status: the next step, such as DeskMergeState or DeskHint. */
    next?: ReactNode;
    /** The card's actions, in its right corner, the board's button kinds drawn 32px tall there. A click beside them
     *  opens the item, as anywhere else on the card. */
    actions: ReactNode;
}

/**
 * An item on your desk, opening the item dialog. Every card has the same four rows at the same heights, so they line
 * up across cards: source, kind and age; the title; the status and next step; and the card's actions. Its summary is a
 * button too, so the keyboard can open it.
 */
export function DeskCard({
    item,
    picked,
    onOpen,
    source,
    kind,
    age,
    title,
    name,
    details,
    statusIcon,
    status,
    next,
    actions,
}: DeskCardProps) {
    return (
        <div
            onClick={onOpen}
            data-item={item}
            className={`desk-card relative grid w-88 shrink-0 cursor-pointer content-start gap-2 rounded-xl border border-[color-mix(in_srgb,var(--warning)_45%,var(--border))] bg-(--card) py-3 pr-3 pl-4 shadow-[inset_3px_0_0_var(--warning)] hover:bg-(--accent) ${picked ? 'ring-2 ring-(--primary) ring-offset-1 ring-offset-(--background)' : ''}`}
        >
            <button
                type="button"
                className="grid min-w-0 gap-2 rounded text-left focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-(--primary)"
            >
                <span className="desk-meta flex h-6 min-w-0 items-center gap-2 text-[11px]">
                    {source}
                    {kind}
                    <span className="ml-auto shrink-0 text-(--muted-foreground)">{age}</span>
                </span>
                <span className="desk-title h-5 truncate text-[13px]/5 font-medium" title={name}>
                    {title}
                </span>
                {details}
            </button>
            <span className="flex min-w-0 items-center gap-2">
                <span className="flex shrink-0 items-center gap-1.5 text-[11px] [&_svg]:size-3">
                    {statusIcon}
                    <span className="font-semibold text-(--warning-foreground)">{status}</span>
                </span>
                <span className="desk-next flex h-5 min-w-0 flex-1 items-center gap-1.5 text-[11px] text-(--muted-foreground) tabular-nums">
                    {next}
                </span>
            </span>
            <div
                className="desk-actions flex h-8 shrink-0 items-center justify-end gap-1.5 [&_[data-kind]:not([data-toggle])]:h-8 [&_[data-kind][data-icon-only]]:w-8!"
                // The actions keep their clicks from the card; a click on the row's own empty space still opens it.
                onClick={(event) => {
                    if (event.target !== event.currentTarget) event.stopPropagation();
                }}
            >
                {actions}
            </div>
        </div>
    );
}

export type MergeState = 'can merge' | 'checking' | 'blocked' | 'conflicts';

const mergeDots: Record<MergeState, string> = {
    'can merge': 'bg-(--build)',
    checking: 'bg-(--warning)',
    blocked: 'bg-(--muted-foreground)',
    conflicts: 'bg-(--error)',
};

/** A desk card's next step while its pull request is open: its merge state, then its checks. */
export function DeskMergeState({ state, checks }: { state: MergeState; checks: string }) {
    return (
        <>
            <span className={`size-2 shrink-0 rounded-full ${mergeDots[state]}`} />
            <span className="shrink-0 font-medium text-(--foreground)">{state}</span>
            <span className="truncate" title={`${state} · ${checks}`}>
                {' '}
                · {checks}
            </span>
        </>
    );
}

/** A desk card's next step as a hint, such as what its status waits for. */
export function DeskHint({ children }: { children?: string | undefined }) {
    return (
        <span className="truncate" title={children}>
            {children}
        </span>
    );
}
