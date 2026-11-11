import type { CSSProperties } from 'react';

import { ambientMotion } from '../foundations/AmbientMotion';
import { type StatusState, statusStateColors } from './StatusState';

/** One step of the track: a stage, a slice, a part. */
export interface ProgressSegment {
    /** What assistive technology reads for it, such as "Build, current" or "Slice 2: done". */
    label: string;
    /** What it means, which colours it (the one tone map): `ready` done, `active` at work, `waiting` held or needing
     *  you, `failed`, `off` queued. None is a step still ahead: the bare track. */
    state?: StatusState | undefined;
    /** A colour that comes with the data, such as a board stage's own, in place of the state's. */
    color?: string | undefined;
    /** How much of it is filled, from 0 to 1 (1 by default once it has a `state`), such as the current stage half
     *  done. */
    value?: number | undefined;
    /** Hasn't begun: an empty track outlined in its colour, never a filled one (a queued item's current stage). */
    waiting?: boolean | undefined;
    /** Its work runs: the fill breathes (on the motion tokens, paused out of view, still for reduced motion). */
    pulse?: boolean | undefined;
    /** Its work runs by an unknown amount: a bar sweeps it (an activity's track). */
    sweep?: boolean | undefined;
}

interface SegmentedProgressProps {
    /** Names the whole track for assistive technology, such as "Stage 3 of 5: Build". */
    label: string;
    /** The steps, in order. */
    segments: readonly ProgressSegment[];
    /** The step the work is at, read as the current one (`aria-current`). */
    current?: number | undefined;
    /** `md` (the default) is a 6px track, for a dialog or a card; `sm` a 4px one, for a row. */
    size?: 'sm' | 'md';
    /** `spaced` (the default) parts the steps by a small gap, as steps; `joined` runs them together, a hairline apart,
     *  as one bar split into parts. */
    layout?: 'spaced' | 'joined';
}

const heights = { sm: 'h-1', md: 'h-1.5' } as const;

/**
 * One track of steps, for any work that moves through parts: a workflow's stages, a piece of work's slices, a concept's
 * parts, an activity's sweep. Each step is coloured by what it means (the one tone map), filled to its `value`,
 * outlined while `waiting`, breathing while it runs (`pulse`) or swept while the amount is unknown (`sweep`). Use
 * Progress for one determinate bar and StackedMeter for shares of a whole. The steps flex inside the track, however many
 * there are (each at least 3px, 2px apart) and never overflow it; a label beside the track keeps 8px from it.
 */
export function SegmentedProgress({
    label,
    segments,
    current,
    size = 'md',
    layout = 'spaced',
}: SegmentedProgressProps) {
    return (
        <ol
            aria-label={label}
            data-slot="segmented-progress"
            // The steps share the track's width, each at least 3px, 2px apart, and never run past it.
            className={`m-0 flex w-full min-w-0 list-none items-center overflow-hidden p-0 ${layout === 'joined' ? 'gap-px' : 'gap-0.5'}`}
        >
            {segments.map((segment, index) => {
                const colour = segment.color ?? (segment.state ? statusStateColors[segment.state] : undefined);
                const fill = segment.waiting || !colour ? 0 : Math.min(Math.max(segment.value ?? 1, 0), 1);
                const ends =
                    layout === 'joined'
                        ? `${index === 0 ? 'rounded-l-full' : ''} ${index === segments.length - 1 ? 'rounded-r-full' : ''}`
                        : 'rounded-full';

                return (
                    <li
                        key={index}
                        aria-label={segment.label}
                        aria-current={index === current ? 'step' : undefined}
                        data-state={segment.state}
                        data-waiting={segment.waiting || undefined}
                        className={`bg-track relative min-w-[3px] flex-1 basis-0 overflow-hidden ${heights[size]} ${ends}`}
                        style={
                            segment.waiting && colour
                                ? ({ boxShadow: `inset 0 0 0 1px ${colour}` } as CSSProperties)
                                : undefined
                        }
                    >
                        {segment.sweep && colour ? (
                            <span
                                ref={ambientMotion}
                                className="lar-progress-indeterminate absolute inset-y-0 left-0 rounded-full"
                                style={{ background: colour }}
                            />
                        ) : fill > 0 ? (
                            <span
                                ref={segment.pulse ? ambientMotion : undefined}
                                className={`absolute inset-y-0 left-0 rounded-[inherit] transition-[width] duration-(--motion-duration-slow) ${segment.pulse ? 'lar-status-pulse' : ''}`}
                                style={{ width: `${fill * 100}%`, background: colour }}
                            />
                        ) : null}
                    </li>
                );
            })}
        </ol>
    );
}
