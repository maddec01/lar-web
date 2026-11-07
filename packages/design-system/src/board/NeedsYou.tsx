// Why a piece of work waits on the user, in the item dialog: the reason and the choices the board offers for it.

import type { ReactNode } from 'react';

/** The reason a piece of work needs you, in the warning tone, then the `actions` that answer it and any `result`. */
export function NeedsYouNotice({
    reason,
    actions,
    children,
}: {
    reason: ReactNode;
    actions: ReactNode;
    /** What the last choice left to say, under the actions. */
    children?: ReactNode;
}) {
    return (
        <div
            className="grid gap-2 rounded-xl border border-[color-mix(in_srgb,var(--warning)_35%,transparent)] bg-(--warning-surface) px-3 py-2.5"
            data-needs-you-reason
        >
            <p className="m-0 font-medium text-(--warning-foreground)">{reason}</p>
            <span className="flex flex-wrap gap-1.5">{actions}</span>
            {children}
        </div>
    );
}

/** What a choice's cleanup left to say, announced. */
export function NeedsYouResult({ children }: { children: ReactNode }) {
    return <p role="alert">{children}</p>;
}
