import { Children, isValidElement, type ReactNode, useId, useRef } from 'react';

import { PopoverContentBase } from '../overlays/Popover';
import { PopoverHeader } from '../overlays/PopoverHeader';
import { scrollFadeClassName, useScrollFade } from '../overlays/useScrollFade';
import { type StatusTone } from './StatusIndicator';
import { type StatusState, statusTone } from './StatusState';
import type { StatusSummaryPart } from './StatusSummary';

interface StatusPopoverContentProps {
    /** The popover's rows, such as one StatusRow per service. */
    children: ReactNode;
    /** A muted line under the title, such as when it was last checked. */
    detail?: ReactNode;
    /** The overall state in a word, after its status light, such as "Healthy"; or, for a mixed state such as "5 active
     *  · 3 failed", its parts, each with its own state (see StatusSummary). Left out for a counter's list, whose
     *  count says it. */
    status?: string | readonly StatusSummaryPart[];
    /** What the status is of, in sentence case, such as "Server health". */
    title: string;
    /** A quiet number after the title, such as how many tasks are running. */
    count?: number | string;
    /** A control at the header's end, such as a compact "View all" button. */
    action?: ReactNode;
    /** What a one-word `status` means, for its light (preferred over `tone`): ready, active, waiting, failed or off. */
    state?: StatusState;
    /** A one-word `status`'s tone, for a case no `state` names. */
    tone?: StatusTone;
    /** The popover's width, one of the family's popover widths: `status` (320px, the default) for a status and its
     *  rows, `wide` (384px) for a list of items, such as a toolbar counter's. `sm` (288px), `md` (= `status`) and `lg`
     *  (= `wide`) are the older names. */
    width?: 'status' | 'wide' | 'sm' | 'md' | 'lg';
    /** A muted note under the rows, on a divider, such as what a limit means. */
    footer?: ReactNode;
}

const widthClasses: Record<NonNullable<StatusPopoverContentProps['width']>, string> = {
    status: 'w-80',
    wide: 'w-96',
    sm: 'w-72',
    md: 'w-80',
    lg: 'w-96',
};

/** A status popover's content: a PopoverHeader with the overall state, then its rows, which scroll under the header
 *  past 40rem, and an optional footer note. Render it inside a Popover (or as a ToolbarCounter's children). */
export function StatusPopoverContent({
    action,
    children,
    count,
    detail,
    status,
    title,
    state,
    tone,
    width = 'status',
    footer,
}: StatusPopoverContentProps) {
    const content = useRef<HTMLDivElement>(null);
    const { setViewport } = useScrollFade();

    return (
        <PopoverContentBase
            ref={content}
            // Focus lands on the popover itself, which its title names, rather than on the rows' scroller (its first
            // focusable part when the header has no action), so opening it never rings the whole list.
            onOpenAutoFocus={(event) => {
                event.preventDefault();
                content.current?.focus();
            }}
            side="bottom"
            align="end"
            sideOffset={8}
            height="capped"
            layout="fill"
            className={`${widthClasses[width]} p-0 focus-visible:outline-none`}
        >
            <PopoverHeader
                title={title}
                count={count}
                detail={detail}
                status={
                    status === undefined
                        ? undefined
                        : typeof status === 'string'
                          ? { tone: tone ?? statusTone(state), label: status }
                          : status
                }
                action={action}
            />
            {/* Focusable, so rows past the cap scroll from the keyboard too; fades where rows run past an edge. */}
            <div
                ref={setViewport}
                tabIndex={0}
                className={`${scrollFadeClassName} focus-ring-inset flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto overscroll-contain p-2 ${footer ? '' : 'rounded-b-[inherit]'}`}
            >
                {children}
            </div>
            {footer ? (
                <div
                    data-slot="status-popover-footer"
                    className="border-line text-fg-muted shrink-0 border-t px-4 py-2 text-xs"
                >
                    {footer}
                </div>
            ) : null}
        </PopoverContentBase>
    );
}

/** A group of a status popover's rows under a small heading, such as "Needs attention 3" or "Current work": each row
 *  on the popover's 16px text edge, ruled from the next, and a rule between groups. Put ProgressStatusRows or
 *  StatusRows in it, inside StatusPopoverContent. */
export function StatusPopoverSection({
    title,
    count,
    children,
}: {
    /** What the rows are, in sentence case. */
    title: string;
    /** How many rows, quietly after the title. */
    count?: number;
    /** The rows; each child is one. */
    children: ReactNode;
}) {
    const titleId = useId();

    return (
        <section
            aria-labelledby={titleId}
            data-slot="status-popover-section"
            className="border-line flex flex-col not-first:mt-1 not-first:border-t not-first:pt-1.5"
        >
            {/* The heading reads as one: its words and, as a plain muted figure, how many rows follow. */}
            <h3 id={titleId} className="text-fg-soft flex items-center gap-1.5 px-2 pt-2.5 pb-1 text-xs font-semibold">
                {title}
                {count === undefined ? null : (
                    <span data-slot="count" className="text-fg-muted font-normal tabular-nums">
                        {count}
                    </span>
                )}
            </h3>
            <div className="divide-line flex flex-col divide-y">
                {Children.toArray(children).map((row, index) => (
                    <div
                        key={isValidElement(row) ? row.key : index}
                        data-slot="status-popover-row"
                        className="min-w-0 px-2 py-3"
                    >
                        {row}
                    </div>
                ))}
            </div>
        </section>
    );
}
