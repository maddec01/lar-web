import type { ReactNode } from 'react';

import { ghostEdgeClassName } from '../actions/GhostEdge';
import { Count, type CountTone } from '../display/Count';
import { Heading } from '../typography/Typography';

/** One section-heading grammar for content sections, panel headers (Panel) and property sheets: an optional status
 *  icon, the title at 14/600, its count at 14/400 muted (or the Count's attention pill), and the actions at the end as
 *  `sm` buttons. Counts contain the figure alone. */
export function SectionTitle({
    title,
    count,
    countLabel,
    countLoading,
    countTone,
    level = 'h2',
    id,
    loading,
    actions,
    icon,
    size = 'md',
}: {
    /** The section's heading. */
    title: ReactNode;
    /** How many items the section holds, shown as a bare figure beside the title. */
    count?: number;
    /** The count in words for screen readers, such as "3 titles". */
    countLabel?: string;
    /** `warning` or `danger` draws the count as the attention pill, for things that need the reader. */
    countTone?: CountTone;
    /** Hide only the provisional count while keeping the section title visible. */
    countLoading?: boolean;
    /** The heading's level; `h2` by default. */
    level?: 'h2' | 'h3' | 'h4';
    /** The heading's id, for a region that `aria-labelledby` names after it. */
    id?: string;
    /** The count is on its way: a placeholder takes its place. */
    loading?: boolean;
    /** Controls at the heading's end, such as an add button; a ghost one sits flush with the edge (GhostEdge). */
    actions?: ReactNode;
    /** A small icon before the title, such as a stage's status glyph; it keeps its own colour. */
    icon?: ReactNode;
    /** `md` (the default) heads a section; `sm` heads a part inside one, such as a scan's phase in its details, with
     *  a label-sized heading and the same action slot. */
    size?: 'sm' | 'md';
}) {
    return (
        <div className="flex min-w-0 items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-2">
                {icon ? (
                    <span
                        aria-hidden="true"
                        className="text-fg-muted grid size-4 shrink-0 place-items-center [&_svg]:size-4"
                    >
                        {icon}
                    </span>
                ) : null}
                <Heading
                    id={id}
                    as={level}
                    variant={size === 'sm' ? 'label' : 'title'}
                    loading={loading}
                    truncate
                    aria-hidden={loading || undefined}
                >
                    {title}
                </Heading>
                <Count count={count} label={countLabel} loading={countLoading ?? loading} tone={countTone} />
            </div>
            {actions ? <div className={`flex min-w-0 items-center ${ghostEdgeClassName}`}>{actions}</div> : null}
        </div>
    );
}
