import { ChevronRightIcon } from 'lucide-react';
import type { ReactNode } from 'react';

import { StatusIndicator, type StatusTone } from './StatusIndicator';
import { type ProgressState, progressStateStatus, type StatusState, statusTone } from './StatusState';

export interface ProgressStatusRowProps {
    /** What the work is on or about, first: in a list or popover, what or where (a library's name, "Server"); inside
     *  that thing's own card or dialog, which already names it, the work itself ("Comparing with Lidarr"). It wraps
     *  rather than truncates in the stacked layout. */
    label: string;
    /** The task, after the identity, such as "Re-read file metadata · Scanning files": it leads the meta line. */
    operation?: string;
    /** Where the run is (the preferred way to set the row): its light, its bar and whether it shows. */
    status?: ProgressState;
    /** The status in a word on the meta line, after the task, neutral beside the light that carries its colour (the
     *  status-word rule), such as "Queued", "Paused", "Failed" or "Done". Running needs none (the bar says it). */
    statusLabel?: string;
    /** How far, as the caller words it, such as "1,204 of 3,890 files"; the percent follows it on its own when
     *  `progress` is known. */
    count?: string;
    /** How long is left, as the caller words it, such as "12 min left". */
    eta?: string;
    /** Why it is held or failed, such as "Waiting for MusicBrainz until 8:21 PM" or "Folder not found". */
    reason?: string;
    /** How far the work is in units, filling the bar and giving the percent; without it (or with a `max` of 0) the
     *  bar sweeps, for work whose size isn't known yet. */
    progress?: { max: number; value: number };
    /** Controls at the row's end, such as Cancel or Review (a small secondary button); centred on the label's line. */
    trailing?: ReactNode;
    /** Makes the row a button that opens the full details, such as a dialog with every counter; a chevron at its end,
     *  centred on the row, says so. */
    onDetails?: () => void;
    /** Leaves out the chevron of a row that opens its details, when the row already ends in a control of its own (a
     *  button or a menu), so it never ends in three; the whole row still opens the details. */
    hideChevron?: boolean;
    /** Says where the row's button leads, for screen readers, after what the row shows: "Show scan details". */
    detailsLabel?: string;
    /** Names the progress bar for screen readers; the meta line names it otherwise. */
    progressLabel?: string;
    /** The dense size, for a card or a popover (12px text, 4px bar); without it, the regular size for a page or dialog
     *  (14px label, 6px bar). */
    size?: 'sm' | 'md';
    /** `stacked` (the default) is a list's row: the label, one meta line, then the bar or the reason. `line` is a
     *  card's summary: the light, the label and the meta on one line, with the bar's room under it whether or not it
     *  runs, so every card in a grid has the same footer. */
    layout?: 'stacked' | 'line';
    /** Extra words after the count, such as "12 known"; the rest of the counters belong behind `onDetails`. */
    detail?: string;
    /** A quieter fact, such as when it last ran or how long it took; it joins the reason's line. */
    secondaryDetail?: string;
    /** Whether the bar shows; follows `status` (running, or paused with a known amount). */
    active?: boolean;
    /** What the light means, for a case `status` doesn't name. */
    state?: StatusState;
    /** The light's and the bar's tone, for a case neither `status` nor `state` names. */
    tone?: StatusTone;
    /** Same as `reason` for a failure (kept for existing callers). */
    issue?: string;
    /** Kept for existing callers: the lines under the label are one line each, cut with an ellipsis. */
    wrapDetail?: boolean;
    /** More under the row, from the text's start, such as a failure's explanation and its Copy button in a dialog. */
    children?: ReactNode;
}

const barColours: Record<StatusTone, string> = {
    info: 'bg-info',
    success: 'bg-success',
    danger: 'bg-danger',
    warning: 'bg-warning',
    neutral: 'bg-line-strong',
};

const percent = new Intl.NumberFormat(undefined, { style: 'percent', maximumFractionDigits: 0 });

const join = (parts: readonly (string | undefined)[]) => parts.filter(Boolean).join(' · ');

/** Lar's one progress grammar, for a scan, a job or any work that runs: the same row in a list, a card, a popover or
 *  a dialog, on one grid so rows line up from surface to surface. Its anatomy (`stacked`, the default):
 *
 *  1. The label line: the light in its own column, then what or where (`label`); any action (`trailing`: Cancel,
 *     Review) at its end, centred on that line, so actions line up from row to row.
 *  2. One meta line, from the text's start, never more than one line: "Task · State · numbers" (`operation`,
 *     `statusLabel`, `count · eta · detail`, then a held row's reason), and the percent alone at its end, over the
 *     bar's end.
 *  3. The bar, while running (or held at its place while paused), from the text's start to the row's end.
 *  4. Why it is held or failed and when it last ran (`reason · secondaryDetail`), one line. A held row with a bar says
 *     its reason on the meta line instead, so a list's row is three lines at most: label, meta, then the bar or the
 *     reason.
 *  5. Anything more (`children`), such as a failure's explanation in a dialog, from the text's start.
 *
 *  `line` (a card's summary) puts the light, the label and the meta on one line, the percent at its end and the bar's
 *  room under it. Cut lines keep their full words in a hover title and in the accessible name. */
/** Joins the numbers to the words before them; non-breaking, since a flex item drops a leading space. */
const separator = '\u00a0· ';

export function ProgressStatusRow({
    label,
    operation,
    status,
    statusLabel,
    count,
    eta,
    reason,
    progress,
    trailing,
    onDetails,
    hideChevron = false,
    detailsLabel,
    progressLabel,
    size = 'md',
    layout = 'stacked',
    detail,
    secondaryDetail,
    state = status ? progressStateStatus[status] : undefined,
    tone = state ? statusTone(state) : 'info',
    issue,
    active,
    children,
}: ProgressStatusRowProps) {
    const line = layout === 'line';
    const small = line || size === 'sm';
    const known = progress && progress.max > 0 ? progress : undefined;
    const showsBar = active ?? (status === 'running' || (status === 'paused' && known !== undefined));
    const sweeps = showsBar && !known && status !== 'paused';
    const why = reason ?? issue;
    const ratio = known ? Math.min(1, Math.max(0, known.value / known.max)) : undefined;
    const shownPercent = ratio === undefined || status === 'done' ? undefined : percent.format(ratio);
    const numbers = join([count, eta, detail]);
    // With a bar on the third line, the reason (a held row's "until 8:21 PM") ends the meta line;
    // the quieter fact ends the row.
    const footnote = join([showsBar ? undefined : why, secondaryDetail]) || undefined;
    // A card's one line ends on its numbers, which stay whole: the words before them (the task, the status, the
    // reason) give way first. A list's meta line keeps the documented order, the reason last.
    const lead = line ? join([operation, statusLabel, why, secondaryDetail]) : undefined;
    const meta = line ? join([lead, numbers]) : join([operation, statusLabel, numbers, showsBar ? why : undefined]);
    const valueText = join([statusLabel, numbers, shownPercent]) || undefined;
    const text = small ? 'text-xs' : 'text-sm';
    const smallText = small ? 'text-2xs' : 'text-xs';
    const lineHeight = small ? 'h-4' : 'h-5';
    const bar =
        showsBar || line ? (
            <div
                className={`bg-track overflow-hidden rounded-full ${small ? 'h-1' : 'h-1.5'} ${showsBar ? '' : 'invisible'}`}
                role={showsBar ? 'progressbar' : undefined}
                aria-label={showsBar ? progressLabel || join([label, operation]) || undefined : undefined}
                aria-valuetext={showsBar ? valueText : undefined}
                aria-valuenow={showsBar && known ? known.value : undefined}
                aria-valuemin={showsBar && known ? 0 : undefined}
                aria-valuemax={showsBar && known ? known.max : undefined}
            >
                {showsBar ? (
                    <div
                        className={`h-full rounded-full ${barColours[tone]} ${sweeps ? 'lar-progress-indeterminate' : ''}`}
                        style={ratio === undefined ? undefined : { width: `${ratio * 100}%` }}
                    />
                ) : null}
            </div>
        ) : null;
    const percentText = shownPercent ? (
        <span className="text-fg-soft shrink-0 font-medium tabular-nums">
            {/* The line reads as one, "7 of 12 albums · 58%", to a screen reader. */}
            {meta ? <span className="sr-only"> · </span> : null}
            {shownPercent}
        </span>
    ) : null;
    const light = (
        // The light keeps to the label line's height, in a column of its own: every line under it starts at the text.
        <span aria-hidden="true" className={`flex w-2 shrink-0 items-center ${lineHeight}`}>
            <StatusIndicator tone={tone} />
        </span>
    );
    const chevron =
        onDetails && !hideChevron ? (
            <ChevronRightIcon
                aria-hidden="true"
                className="text-fg-muted group-hover/progress:text-fg size-3.5 shrink-0 self-center transition-colors"
            />
        ) : null;
    // In a list, the action sits at the label line's end and the lines under it run beneath the action to the row's
    // end, so the meta and the bar keep the row's whole width.
    const inlineActions = Boolean(trailing) && !onDetails && !line;
    const under = inlineActions ? 'col-span-2 col-start-2' : 'col-start-2';
    const actions = trailing ? (
        // Centred on the label's line and overhanging it, so a 28px button never pushes the meta line down.
        <span
            data-slot="progress-actions"
            className={`flex shrink-0 items-center gap-1 ${small ? '-my-1.5' : '-my-1'} ${inlineActions ? 'col-start-3 row-start-1 pl-1' : ''}`}
        >
            {trailing}
        </span>
    ) : null;
    // Inside the details button only phrasing content is allowed; elsewhere the row may hold blocks (`children`).
    const Box = onDetails ? 'span' : 'div';
    const body = line ? (
        <span className="flex min-w-0 flex-1 flex-col gap-1">
            <span data-slot="progress-meta" className={`flex min-w-0 items-center gap-2 ${text}`}>
                {light}
                {/* The numbers never shrink while the words have room to give: those end in an ellipsis down to 2rem first. */}
                <span className="flex min-w-0 flex-1 overflow-hidden tabular-nums" title={join([label, meta])}>
                    <span className="min-w-8 truncate">
                        <span className="text-fg font-medium">{label}</span>
                        {lead ? <span className="text-fg-muted"> · {lead}</span> : null}
                    </span>
                    {numbers ? (
                        <span className="text-fg-muted max-w-full shrink-0 truncate">{`${separator}${numbers}`}</span>
                    ) : null}
                </span>
                {percentText}
                {chevron}
            </span>
            <span className="block pl-4">{bar}</span>
        </span>
    ) : (
        <Box
            className={`grid min-w-0 flex-1 items-center gap-x-2 ${inlineActions ? 'grid-cols-[auto_minmax(0,1fr)_auto]' : 'grid-cols-[auto_minmax(0,1fr)]'} ${small ? 'gap-y-1' : 'gap-y-1.5'}`}
        >
            {light}
            <span className={`text-fg min-w-0 self-start text-left font-medium break-words ${text}`}>{label}</span>
            {meta || shownPercent ? (
                <span
                    data-slot="progress-meta"
                    className={`${smallText} text-fg-muted ${under} flex min-w-0 items-baseline gap-3 text-left tabular-nums`}
                >
                    <span className="min-w-0 flex-1 truncate" title={meta || undefined}>
                        {operation && meta.startsWith(operation) ? (
                            <>
                                <span className="text-fg-soft">{operation}</span>
                                {meta.slice(operation.length)}
                            </>
                        ) : (
                            meta
                        )}
                    </span>
                    {percentText}
                </span>
            ) : null}
            {showsBar ? <span className={`${under} block`}>{bar}</span> : null}
            {footnote ? (
                <span className={`${smallText} text-fg-muted ${under} min-w-0 truncate text-left`} title={footnote}>
                    {footnote}
                </span>
            ) : null}
            {children ? <Box className={`${under} mt-1 block min-w-0 text-left`}>{children}</Box> : null}
            {/* Last for screen readers (the work, then what to do about it), drawn on the label's line. */}
            {inlineActions ? actions : null}
        </Box>
    );

    return (
        <div
            data-slot="progress-status-row"
            data-status={status}
            data-layout={layout}
            className={`flex w-full min-w-0 items-start gap-3`}
        >
            {onDetails ? (
                <button
                    type="button"
                    onClick={onDetails}
                    aria-haspopup="dialog"
                    // The whole summary opens the details; the hover tint reaches past the text into the padding.
                    className="group/progress focus-ring hover:bg-fill-muted -mx-2 -my-1.5 flex min-w-0 flex-1 cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-left transition-colors"
                >
                    {body}
                    {line ? null : chevron}
                    {/* Named by what it shows, then where it leads: "Vinyl Rips · … · 58%: Show scan details". */}
                    {detailsLabel ? <span className="sr-only">: {detailsLabel}</span> : null}
                </button>
            ) : (
                body
            )}
            {inlineActions ? null : actions}
        </div>
    );
}
