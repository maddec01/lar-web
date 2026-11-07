// A piece of work's activity as the board reads it from T3: the track that sweeps while it runs, and its label.

import type { ReactNode } from 'react';

import { ambientMotion } from '../foundations/AmbientMotion';

/** A thin track named by `label`, swept by a bar while `running`. */
export function ActivityTrack({ label, running }: { label: string; running: boolean }) {
    return (
        <div role="img" aria-label={label} className="activity-track h-1.5 overflow-hidden rounded-full bg-(--soft)">
            {running && (
                <span ref={ambientMotion} className="activity-sweep block h-1.5 w-1/3 rounded-full bg-(--st-now)" />
            )}
        </div>
    );
}

/** The activity's words alone, in one small muted line. */
export function ActivityLabel({ children }: { children: ReactNode }) {
    return (
        <span className="block h-4 text-[11px] leading-4 whitespace-nowrap text-(--muted-foreground)">{children}</span>
    );
}
