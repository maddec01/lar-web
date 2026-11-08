// A piece of work's activity as the board reads it from T3: the track that sweeps while it runs, and its label.

import type { ReactNode } from 'react';

import { ambientMotion } from '../foundations/AmbientMotion';

/** A thin track named by `label`, swept by a bar while `running`. */
export function ActivityTrack({
    label,
    running,
}: {
    /** What the track stands for, for screen readers. */
    label: string;
    /** Work is under way: a bar sweeps the track. */
    running: boolean;
}) {
    return (
        <div role="img" aria-label={label} className="activity-track bg-track h-1.5 overflow-hidden rounded-full">
            {running && (
                <span ref={ambientMotion} className="activity-sweep bg-board-active block h-1.5 w-1/3 rounded-full" />
            )}
        </div>
    );
}

/** The activity's words alone, in one small muted line. */
export function ActivityLabel({
    children,
}: {
    /** The activity's words. */
    children: ReactNode;
}) {
    return <span className="text-2xs text-fg-muted block h-4 leading-4 whitespace-nowrap">{children}</span>;
}
