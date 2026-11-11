import type { ReactNode } from 'react';

import { ButtonBase } from '../../actions/Button';
import { statusStateColors } from '../../feedback/StatusState';
import { Popover } from '../../overlays/Popover';
import { Tooltip, TooltipPopup, TooltipTrigger } from '../../overlays/Tooltip';

/** How wide the value stays as it changes (a dash, a loader, a number), so the bar holds still: a count, a count with
 *  its track, or a figure such as a spend under $1,000. */
const valueWidths = { count: 'min-w-[2ch]', track: 'min-w-[4ch]', figure: 'min-w-[8ch]' } as const;

/** Which bar widths show the counter: always, from 50rem, or from 57rem. The title bar folds in one order as it
 *  narrows: search to its icon (when its field no longer fits), then the `wide` counters, the `medium` ones, the
 *  actions' words (TitleBarLabel, under 43rem) and, under 40rem, the status into its popover, where every counter
 *  shows. A full factory bar needs about 68rem inside its gutters with the search field, 56 with its icon. */
const folds = {
    never: 'inline-flex',
    medium: 'hidden @min-[50rem]:inline-flex in-data-toolbar-overflow:inline-flex',
    wide: 'hidden @min-[57rem]:inline-flex in-data-toolbar-overflow:inline-flex',
} as const;

/** The most bars a track draws; past it, "+n" says how many more. */
const MOST_BARS = 5;

interface ToolbarCounterProps {
    /** What it counts, as a 16px glyph in its status's own colour, such as a StatusIndicator. */
    icon: ReactNode;
    /** What it counts in words, before the value in its accessible name, such as "Need you". */
    label: string;
    /** The figure: a count, or a dash while nothing has been read (never a zero that would be a claim). */
    value: ReactNode;
    /** What the figure means, in the glass tooltip and as the button's accessible description, such as "6 items
     *  waiting on your answer". */
    hint: string;
    /** A mini track after the count: `used` of `limit` as small bars (filled for each in use, extra ones past the
     *  limit after a gap, "+n" past five). The hint says it in words. */
    track?: { used: number; limit: number };
    /** The value's reserved width: `count` (the default), `track` with a track, or `figure` for a wider figure. */
    width?: keyof typeof valueWidths;
    /** Below which title bar width it folds away: `never` (the default), `medium` (50rem) or `wide` (57rem, first). */
    fold?: keyof typeof folds;
    /** Its popover, a StatusPopoverContent (usually `width="wide"` for a list of items). */
    children: ReactNode;
    /** Shown, for a controlled popover. */
    open?: boolean;
    /** Called as the popover opens or closes. */
    onOpenChange?: (open: boolean) => void;
}

/**
 * A toolbar counter, ToolbarStatusItem's counting sibling: the title bar's `sm` 28px ghost control with a 16px glyph,
 * a tabular 13px figure and an optional mini track, a glass tooltip saying what the figure means, opening a
 * StatusPopoverContent of everything behind it. Put a row of them in a ToolbarStatusGroup, in the TitleBar's `status`.
 * Its `data-fold` and `data-width` name its fold and reserved width for an app's tests.
 */
export function ToolbarCounter({
    icon,
    label,
    value,
    hint,
    track,
    width = track ? 'track' : 'count',
    fold = 'never',
    children,
    open,
    onOpenChange,
}: ToolbarCounterProps) {
    return (
        <Popover open={open} onOpenChange={onOpenChange}>
            <Tooltip>
                {/* The popover's trigger outermost, so the button's data-state is the popover's (open/closed). */}
                <Popover.Trigger asChild>
                    <TooltipTrigger asChild>
                        <ButtonBase
                            variant="summary"
                            size="sm"
                            aria-description={hint}
                            data-fold={fold}
                            data-width={width}
                            data-slot="toolbar-counter"
                            className={`text-fg-muted hover:text-fg data-[state=open]:bg-fill-hover data-[state=open]:text-fg shrink-0 gap-1.5 ${folds[fold]}`}
                        >
                            <span className="sr-only">{label}:</span>{' '}
                            <span aria-hidden="true" className="grid size-4 shrink-0 place-items-center [&_svg]:size-4">
                                {icon}
                            </span>
                            <span
                                className={`text-fg text-ui inline-flex items-center gap-1.5 leading-4 font-medium tabular-nums [&_[data-loader]]:w-full [&_[data-loader]]:justify-center [&_svg]:size-3 ${valueWidths[width]}`}
                            >
                                {value}
                                {track ? <CounterTrack {...track} /> : null}
                            </span>
                        </ButtonBase>
                    </TooltipTrigger>
                </Popover.Trigger>
                <TooltipPopup side="bottom">{hint}</TooltipPopup>
            </Tooltip>
            {children}
        </Popover>
    );
}

/** The counter's mini track: one 8×4 bar per place the limit allows, filled (the active status colour) for each in
 *  use, then any past the limit after a gap, and "+n" for what five bars can't show. */
function CounterTrack({ used, limit }: { used: number; limit: number }) {
    const within = Math.min(limit, MOST_BARS);
    const past = Math.min(Math.max(used - limit, 0), MOST_BARS - within);
    const more = Math.max(limit, used) - within - past;
    const bar = (key: number, on: boolean) => (
        <span
            key={key}
            className="h-1 w-2 rounded-full"
            style={{ backgroundColor: on ? statusStateColors.active : statusStateColors.off }}
        />
    );

    return (
        <span aria-hidden="true" data-slot="counter-track" className="inline-flex items-center gap-0.5">
            {Array.from({ length: within }, (_, n) => bar(n, n < used))}
            {past > 0 ? (
                <span className="ml-1 inline-flex gap-0.5">
                    {Array.from({ length: past }, (_, n) => bar(limit + n, true))}
                </span>
            ) : null}
            {more > 0 ? <span className="text-fg-muted text-2xs ml-1 font-medium">+{more}</span> : null}
        </span>
    );
}
