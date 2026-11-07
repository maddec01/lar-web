import type { ReactNode } from 'react';

import { Loading } from '../feedback/Loading';

/** Lar Factory's window: the board's main area filling the window, and beside it, outside `main`, what sits over the
 *  board (its dialogs, live regions and notifications), so their announcements sit apart from the page. */
export function BoardShell({ children, overlays }: { children: ReactNode; overlays?: ReactNode }) {
    return (
        <div className="fixed inset-0 flex flex-col bg-(--background) text-(--foreground)">
            <main className="flex min-h-0 min-w-0 flex-1 flex-col">{children}</main>
            {overlays}
        </div>
    );
}

/** Everything under the title bar, which scrolls as one page; nothing in it shrinks to fit. */
export function BoardContent({ children }: { children: ReactNode }) {
    return (
        <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto px-6 pt-3 pb-4 *:shrink-0">{children}</div>
    );
}

/** A line that stands in for content the board is still reading, centred in its area. */
export function ReadingLine({ label }: { label: string }) {
    return (
        <p className="text-base-700 m-0 flex items-center justify-center gap-2 p-6 text-sm" data-reading>
            <Loading label={label} presentation="line" />
        </p>
    );
}
