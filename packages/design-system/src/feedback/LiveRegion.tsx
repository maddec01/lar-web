import type { ReactNode } from 'react';

/** An out-of-sight polite live region: screen readers read what it says each time that changes, such as "Copied". */
export function LiveRegion({
    id,
    children,
}: {
    /** The region's id, for a control's `aria-describedby`. */
    id?: string;
    /** What screen readers read, each time it changes. */
    children?: ReactNode;
}) {
    return (
        <div id={id} className="sr-only" role="status" aria-live="polite">
            {children}
        </div>
    );
}
