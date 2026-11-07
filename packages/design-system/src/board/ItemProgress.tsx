// The progress at the top of Lar Factory's item dialog: the workflow's steps as a bar, a concept's parts done, and a
// piece of work's slices as chips under their count.

import type { ReactNode } from 'react';

import type { DataAttributes } from './DataAttributes';
import type { SliceProgress } from './Slices';
import { SliceMark } from './Slices';

const PAST = 'color-mix(in srgb, var(--foreground) 28%, transparent)';

/** The dialog's progress block: the steps, the parts, the activity and the slices, stacked. */
export function ItemProgressPanel({ children, ...data }: { children: ReactNode } & DataAttributes) {
    return (
        <div {...data} className="grid min-w-0 grid-cols-[minmax(0,1fr)] gap-2">
            {children}
        </div>
    );
}

/** A count's line over its bar, such as "Slices · 2/3 done": `label` in the text colour, then `children`. */
export function ProgressCount({ label, children }: { label: string; children: ReactNode }) {
    return (
        <p className="m-0 text-xs text-(--muted-foreground)">
            <span className="font-medium text-(--foreground)">{label}</span> · {children}
        </p>
    );
}

/**
 * The workflow's active steps as a bar: the past ones slim and darker, the upcoming faint, and the current one widest,
 * named `name` with its step number, in a gradient of `color`, or `bar` (such as its slices) in that gradient's place.
 * Each step's `label` is what assistive technology reads and its `title` its tooltip.
 */
export function WorkflowSteps({
    steps,
    at,
    name,
    color,
    bar,
}: {
    steps: readonly { title: string; label: string }[];
    /** The current step's index. */
    at: number;
    name: string;
    color: string;
    bar?: ReactNode;
}) {
    return (
        <ol className="m-0 flex list-none items-end gap-[3px] p-0" data-steps>
            {steps.map((step, i) =>
                i !== at ? (
                    <li
                        key={i}
                        title={step.title}
                        aria-label={step.label}
                        className="h-1.5 min-w-1.5 flex-1 rounded-full"
                        style={{ background: i < at ? PAST : 'var(--soft)' }}
                    />
                ) : (
                    <li
                        key={i}
                        title={step.title}
                        aria-label={step.label}
                        aria-current="step"
                        className="grid min-w-26 flex-[6] gap-1"
                    >
                        <span className="flex items-baseline justify-between gap-2 text-xs leading-4">
                            <span className="truncate font-medium">{name}</span>
                            <span className="shrink-0 text-(--muted-foreground) tabular-nums">
                                {i + 1}/{steps.length}
                            </span>
                        </span>
                        {bar ? (
                            <div aria-hidden>{bar}</div>
                        ) : (
                            <span
                                className="h-1.5 rounded-full"
                                style={{
                                    background: `linear-gradient(90deg, color-mix(in srgb, ${color} 55%, transparent), ${color})`,
                                }}
                            />
                        )}
                    </li>
                ),
            )}
        </ol>
    );
}

/** A concept's parts done out of its parts, as a ProgressCount over a bar in the done colour. */
export function PartsProgress({
    label,
    completed,
    total,
    children,
}: {
    label: string;
    completed: number;
    total: number;
    /** What the count says, such as "4/9 done". */
    children: ReactNode;
}) {
    return (
        <div className="grid gap-1" data-parts-progress>
            <ProgressCount label={label}>{children}</ProgressCount>
            <div aria-hidden className="h-1.5 overflow-hidden rounded-full bg-(--soft)">
                <div
                    className="h-full rounded-full bg-(--st-done)"
                    style={{ width: `${total > 0 ? (completed / total) * 100 : 0}%` }}
                />
            </div>
        </div>
    );
}

/** The activity under the steps: its track, then its label. */
export function ProgressActivity({ children }: { children: ReactNode }) {
    return <div className="grid gap-1">{children}</div>;
}

/** The slices under the steps: their `count` line, a slice `bar` when the steps don't hold it, and a SliceChip each. */
export function SliceChips({ count, bar, children }: { count: ReactNode; bar?: ReactNode; children: ReactNode }) {
    return (
        <div className="grid min-w-0 grid-cols-[minmax(0,1fr)] gap-2" data-slices>
            {count}
            {bar && <div aria-hidden>{bar}</div>}
            <ul className="m-0 flex list-none flex-wrap gap-1.5 p-0">{children}</ul>
        </div>
    );
}

/** A slice as a chip: where its ticket is saved, its mark, number, title (muted when done, medium while active) and
 *  state; `title` names it in full. */
export function SliceChip({
    title,
    source,
    progress,
    number,
    name,
}: {
    title: string;
    source: ReactNode;
    progress: SliceProgress;
    number?: number | undefined;
    name: string;
}) {
    return (
        <li
            title={title}
            className="inline-flex max-w-full items-center gap-1.5 rounded-full border border-(--border) bg-(--card) py-0.5 ps-1 pe-2.5 text-xs"
        >
            {source}
            <SliceMark progress={progress} />
            {!!number && <span className="shrink-0 text-(--muted-foreground) tabular-nums">#{number}</span>}
            <span
                className={`min-w-0 truncate ${progress === 'done' ? 'text-(--muted-foreground)' : progress === 'active' ? 'font-medium' : ''}`}
            >
                {name}
            </span>
            <span className="shrink-0 text-[11px] text-(--muted-foreground)">{progress}</span>
        </li>
    );
}
