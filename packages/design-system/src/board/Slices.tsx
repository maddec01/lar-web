// A piece of work's slices: the bar every view of the board draws, and a list with each slice's mark.

import { CheckIcon } from 'lucide-react';
import type { ReactNode } from 'react';

import { ambientMotion } from '../foundations/AmbientMotion';

/** Where a slice stands. */
export type SliceProgress = 'done' | 'active' | 'blocked' | 'unknown' | 'waiting';

const SLICE_COLOR: Record<SliceProgress, string> = {
    done: 'var(--st-done)',
    active: 'var(--st-now)',
    blocked: 'var(--st-review)',
    unknown: 'var(--muted-foreground)',
    waiting: 'var(--input)',
};

/** A 6px segment for each slice, named by its tooltip; waiting segments are faint, and an active one pulses unless
 *  `still`. */
export function SliceBar({
    slices,
    still = false,
}: {
    slices: { name: string; progress: SliceProgress }[];
    still?: boolean;
}) {
    if (!slices.length) return null;

    return (
        <ol className="m-0 flex list-none gap-[2px] p-0">
            {slices.map((s, i) => (
                <li
                    key={i}
                    ref={s.progress === 'active' && !still ? ambientMotion : undefined}
                    title={s.name}
                    className={`h-1.5 flex-1 rounded-full ${s.progress === 'active' && !still ? 'status-pulse' : ''}`}
                    style={{ background: s.progress === 'waiting' ? 'var(--soft)' : SLICE_COLOR[s.progress] }}
                />
            ))}
        </ol>
    );
}

/** A slice's state as a ring: ticked when done, a question mark when unknown, a dot pulsing unless `still` while
 *  active. */
export function SliceMark({ progress, still = false }: { progress: SliceProgress; still?: boolean }) {
    return (
        <span
            className="grid size-4 shrink-0 place-items-center rounded-full border-[1.5px]"
            style={{
                borderColor: SLICE_COLOR[progress],
                background: progress === 'done' ? 'var(--st-done)' : 'transparent',
            }}
        >
            {progress === 'unknown' && <span className="text-[9px] leading-none">?</span>}
            {progress === 'done' && <CheckIcon className="size-2.5 text-white" strokeWidth={3} />}
            {progress === 'active' && (
                <span
                    ref={still ? undefined : ambientMotion}
                    className={`${still ? '' : 'status-pulse '}size-1.5 rounded-full bg-(--st-now)`}
                />
            )}
        </span>
    );
}

/** The slices of a piece of work, one SliceRow each. */
export function SliceList({ children }: { children: ReactNode }) {
    return <ul className="m-0 grid list-none grid-cols-[minmax(0,1fr)] gap-0.5 p-0">{children}</ul>;
}

/** A slice in SliceList: where its ticket is saved, its mark, number, title (struck through when done) and state. */
export function SliceRow({
    source,
    progress,
    still = false,
    number,
    title,
}: {
    source: ReactNode;
    progress: SliceProgress;
    still?: boolean;
    /** The slice's ticket number; a slice with none shows none. */
    number?: number | undefined;
    title: string;
}) {
    return (
        <li className="flex items-start gap-2 rounded-md px-2 py-1 text-[13px] hover:bg-(--soft)">
            {source}
            <span className="mt-0.5">
                <SliceMark progress={progress} still={still} />
            </span>
            {!!number && <span className="shrink-0 text-(--muted-foreground) tabular-nums">#{number}</span>}
            <span
                className={`min-w-0 flex-1 wrap-anywhere ${progress === 'done' ? 'text-(--muted-foreground) line-through' : progress === 'active' ? 'font-medium' : ''}`}
            >
                {title}
            </span>
            <span className="mt-px shrink-0 text-[11px] text-(--muted-foreground)">{progress}</span>
        </li>
    );
}
