import type { ReactNode } from 'react';

/** Quiet numeric metadata shared by headings, selectors and tabs. */
export function Count({
    count,
    label,
    loading = false,
}: {
    /** A figure, formatted for the reader's locale if needed. */
    count?: ReactNode;
    /** The figure in words for assistive technology. */
    label?: string;
    /** Hides stale or provisional figures while their content loads. */
    loading?: boolean;
}) {
    if (loading || count == null) return null;

    return (
        <span data-slot="count" aria-label={label} className="text-fg-muted shrink-0 text-sm font-normal tabular-nums">
            {count}
        </span>
    );
}
