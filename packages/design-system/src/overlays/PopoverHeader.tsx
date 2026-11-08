import type { ReactNode } from 'react';

import { ghostEdgeClassName } from '../actions/GhostEdge';
import { Count } from '../display/Count';
import { StatusSummary, type StatusSummaryPart } from '../feedback/StatusSummary';
import { HeadingBase, TextBase } from '../typography/Typography';

export interface PopoverHeaderProps {
    /** What the popover is about, in sentence case, such as "Server health" or "Building". */
    title: string;
    /** A quiet number after the title, such as how many rows follow. */
    count?: number | string;
    /** Names the count for screen readers, such as "4 running". */
    countLabel?: string;
    /** A muted line under the title, such as when it was last checked. */
    detail?: ReactNode;
    /** The overall state as a status light and a word at the end, such as `{ state: 'ready', label: 'Healthy' }`; or,
     *  for a mixed state, its parts, each in its own tone, such as `[{ state: 'active', label: '5 active' }, { state:
     *  'failed', label: '3 failed' }]` (see StatusSummary). */
    status?: StatusSummaryPart | readonly StatusSummaryPart[];
    /** A control at the end, such as a compact "View all" button or an icon button; it follows the status. */
    action?: ReactNode;
}

/** A toolbar or counter popover's header, first in a `Popover.Content layout="fill" presentation="flush"`: a
 *  sentence-case title with an optional quiet count and muted detail, the overall status as a light and a word, an
 *  optional action, and always a divider under it. It pads as a popover's content edge does (16px), at the Modal
 *  header's rhythm scaled to a popover: 48px tall for a single line. Nothing truncates: a status that doesn't fit
 *  beside the title (a mixed summary of several parts) moves under it, and a long title or detail wraps. */
export function PopoverHeader({ title, count, countLabel, detail, status, action }: PopoverHeaderProps) {
    return (
        <header
            data-slot="popover-header"
            className="border-line flex min-h-12 shrink-0 items-center gap-3 border-b px-4 py-2.5"
        >
            <div className="flex min-w-0 flex-1 flex-wrap items-center gap-x-3 gap-y-1">
                <div className="max-w-full min-w-0 flex-[1_1_auto]">
                    <HeadingBase as="h2" variant="title" className="flex min-w-0 items-baseline gap-1.5">
                        <span className="min-w-0 wrap-break-word">{title}</span>
                        <Count count={count} label={countLabel} />
                    </HeadingBase>
                    {detail ? (
                        <TextBase as="div" variant="caption" tone="muted" className="wrap-break-word">
                            {detail}
                        </TextBase>
                    ) : null}
                </div>
                {status ? (
                    <span data-slot="popover-header-status" className="max-w-full min-w-0">
                        <StatusSummary parts={Array.isArray(status) ? status : [status as StatusSummaryPart]} />
                    </span>
                ) : null}
            </div>
            {action ? <div className={`flex shrink-0 items-center gap-1 ${ghostEdgeClassName}`}>{action}</div> : null}
        </header>
    );
}
