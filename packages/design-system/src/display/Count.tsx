import type { ReactNode } from 'react';

/** A count's tone: `neutral` is the plain muted figure; `warning` and `danger` say the things counted need you. */
export type CountTone = 'neutral' | 'warning' | 'danger';

/** The attention tones: a 20px pill tinted in the tone, its figure at 12/500 in the tone's text colour. */
const pills: Record<Exclude<CountTone, 'neutral'>, string> = {
    warning: 'bg-warning-surface text-warning-fg ring-warning-ring',
    danger: 'bg-danger-surface text-danger-fg ring-danger-ring',
};

/** Quiet numeric metadata shared by headings, panel headers, selectors and tabs: a plain muted figure at the heading's
 *  size (14/400), or, when what it counts needs you, a small pill tinted in the attention tone (20px, 12/500). Never an
 *  11px pill. */
export function Count({
    count,
    label,
    loading = false,
    tone = 'neutral',
}: {
    /** A figure, formatted for the reader's locale if needed. */
    count?: ReactNode;
    /** The figure in words for assistive technology. */
    label?: string;
    /** Hides stale or provisional figures while their content loads. */
    loading?: boolean;
    /** `neutral` (the default) is the plain figure; `warning` or `danger` a tinted pill, for a count of things that need
     *  the reader (a "Needs you" lane, a "Needs attention" panel). */
    tone?: CountTone;
}) {
    if (loading || count == null) return null;

    if (tone === 'neutral')
        return (
            <span
                data-slot="count"
                aria-label={label}
                className="text-fg-muted shrink-0 text-sm font-normal tabular-nums"
            >
                {count}
            </span>
        );

    return (
        <span
            data-slot="count"
            data-tone={tone}
            aria-label={label}
            className={`grid h-5 min-w-5 shrink-0 place-items-center rounded-full px-1.5 text-xs leading-none font-medium tabular-nums ring-1 ring-inset ${pills[tone]}`}
        >
            {count}
        </span>
    );
}
