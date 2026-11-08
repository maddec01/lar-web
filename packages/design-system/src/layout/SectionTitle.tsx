import type { ReactNode } from 'react';

import { ghostEdgeClassName } from '../actions/GhostEdge';
import { Count } from '../display/Count';
import { Heading } from '../typography/Typography';

/** One section-heading grammar for content sections and property sheets. Counts contain the figure alone. */
export function SectionTitle({
    title,
    count,
    countLabel,
    countLoading,
    level = 'h2',
    id,
    loading,
    actions,
    icon,
    size = 'md',
}: {
    /** The section's heading. */
    title: string;
    /** How many items the section holds, shown as a bare figure beside the title. */
    count?: number;
    /** The count in words for screen readers, such as "3 titles". */
    countLabel?: string;
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
    /** A small icon before the title. */
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
                    aria-hidden={loading || undefined}
                >
                    {title}
                </Heading>
                <Count count={count} label={countLabel} loading={countLoading ?? loading} />
            </div>
            {actions ? <div className={`flex min-w-0 items-center ${ghostEdgeClassName}`}>{actions}</div> : null}
        </div>
    );
}
