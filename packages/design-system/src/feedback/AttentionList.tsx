/* oxlint-disable react/only-export-components -- Compound members are exported through AttentionList. */

import { ChevronDownIcon, CircleAlertIcon, TriangleAlertIcon } from 'lucide-react';
import { type MouseEvent, type ReactNode, useId, useState } from 'react';

import { IconButtonBase } from '../actions/IconButton';
import { tabbable } from '../foundations/KeyboardFocus';
import { HeadingBase, TextBase } from '../typography/Typography';
import { DismissButton } from './DismissButton';
import { StatusIndicator } from './StatusIndicator';

type AttentionTone = 'warning' | 'danger';

/** `data-*` attributes a row passes to its element, naming what it shows for an app's tests and focus. */
type DataAttributes = { [name: `data-${string}`]: string | number | boolean | undefined };

/** The surface's tone, in the worst problem's colour: a tinted header band over the card, the card's edge and the band's
 *  rule in the tone's hairline, the icon in a tile of the tone. The rows stay on the card surface in the text colours,
 *  so the list reads as work to do, the header as how serious it is. */
const tones: Record<AttentionTone, { edge: string; band: string; tile: string; count: string }> = {
    warning: {
        edge: 'border-warning-ring',
        band: 'bg-warning-surface border-warning-ring',
        tile: 'bg-warning-fill text-warning-on-fill',
        count: 'bg-warning-ring text-warning-fg',
    },
    danger: {
        edge: 'border-danger-ring',
        band: 'bg-danger-surface border-danger-ring',
        tile: 'bg-danger-fill text-danger-on-fill',
        count: 'bg-danger-ring text-danger-fg',
    },
};

interface AttentionListProps {
    /** The surface's heading, such as "Needs attention". */
    title: string;
    /** How many problems it lists, in a small pill tinted in the tone after the title. */
    count?: number;
    /** `warning` (the default) while every problem can wait; `danger` once one stops something working. */
    tone?: AttentionTone;
    /** One control for the whole list, at the header's end, such as "Diagnostics". */
    action?: ReactNode;
    /** Folds the rows under the header, which opens them; `defaultOpen` says how it starts. `toggleLabel` names the
     *  toggle for screen readers, such as "Show problems". */
    collapsible?: { defaultOpen?: boolean; toggleLabel: string };
    /** One AttentionList.Item per problem. */
    children: ReactNode;
}

/** Problems that need the reader, in one place, the same in every app (lar-server's "Needs attention", Lar Factory's
 *  connection warnings): a card with a header band tinted in the tone of the worst of them (icon tile, title, count, an
 *  optional action), then one row per problem, each with its own action. Use it wherever problems collect, one or
 *  many, in place of Alerts one above another. */
function AttentionListRoot({ title, count, tone = 'warning', action, collapsible, children }: AttentionListProps) {
    const titleId = useId();
    const rowsId = useId();
    const [open, setOpen] = useState(collapsible?.defaultOpen ?? true);
    const Icon = tone === 'danger' ? CircleAlertIcon : TriangleAlertIcon;
    const look = tones[tone];
    const shown = !collapsible || open;

    return (
        <section
            aria-labelledby={titleId}
            data-slot="attention-list"
            data-tone={tone}
            className={`surface-card @container overflow-hidden rounded-xl border ${look.edge}`}
        >
            <div
                className={`flex min-h-12 items-center gap-3 px-4 py-2.5 ${look.band} ${shown ? 'border-b' : ''}`}
                data-slot="attention-header"
            >
                <span
                    aria-hidden="true"
                    className={`grid size-6 shrink-0 place-items-center rounded-md ${look.tile} [&>svg]:size-3.5`}
                >
                    <Icon strokeWidth={2.25} />
                </span>
                <HeadingBase
                    as="h2"
                    id={titleId}
                    variant="title"
                    className="flex min-w-0 flex-1 items-center gap-2 text-sm"
                >
                    <span className="min-w-0 truncate">{title}</span>
                    {count === undefined ? null : (
                        <span
                            data-slot="count"
                            className={`text-2xs grid h-4.5 min-w-4.5 shrink-0 place-items-center rounded-full px-1.5 leading-none font-semibold tabular-nums ${look.count}`}
                        >
                            {count}
                        </span>
                    )}
                </HeadingBase>
                {action ? <div className="flex shrink-0 items-center gap-2">{action}</div> : null}
                {collapsible ? (
                    <IconButtonBase
                        {...tabbable}
                        aria-label={collapsible.toggleLabel}
                        aria-expanded={open}
                        aria-controls={rowsId}
                        icon={<ChevronDownIcon />}
                        onClick={() => setOpen((now) => !now)}
                        className={`-mr-1.5 transition-transform ${open ? 'rotate-180' : ''}`}
                    />
                ) : null}
            </div>
            <ul
                id={rowsId}
                data-folded={shown ? undefined : true}
                className={`divide-line divide-y ${shown ? '' : 'hidden'}`}
            >
                {children}
            </ul>
        </section>
    );
}

interface AttentionListItemProps {
    /** How serious this problem is, as its status light. */
    tone: AttentionTone;
    /** What is wrong, naming the thing, such as "Documentaries: folder not found". */
    title: string;
    /** What it means or what to do, in a sentence; it may hold inline code and a small inline control. */
    description?: ReactNode;
    /** The way to fix it, such as a small "Review" button or a link: at the row's end, beside the text; under it on a
     *  narrow card. */
    action?: ReactNode;
    /** Keeps the description to one line, cut with an ellipsis (its full words in a hover title), for a summary whose
     *  action opens the whole story, such as a failed scan's Review. A plain-text `description` only. */
    singleLine?: boolean;
    /** Lets the reader close the row; `dismissLabel` names what it closes, such as "Dismiss: jq not found". */
    onDismiss?: (event: MouseEvent<HTMLButtonElement>) => void;
    dismissLabel?: string;
}

/** One problem in an AttentionList: a status light on the title's line, what is wrong and what it means, its own
 *  action at the row's end (under the text on a narrow card), and an optional close button. */
function AttentionListItem({
    tone,
    title,
    description,
    action,
    singleLine = false,
    onDismiss,
    dismissLabel,
    ...data
}: AttentionListItemProps & DataAttributes) {
    const dismissible = Boolean(onDismiss && dismissLabel);
    // Light, text, then the action and the close button only when the row has them, so every action ends on the
    // card's padding edge, under the header's own.
    // A one-line row keeps its action beside the text at every width: the text gives way, never the action.
    const besideAlways = singleLine && !dismissible;
    const columns = dismissible
        ? 'grid-cols-[auto_minmax(0,1fr)_auto] @lg:grid-cols-[auto_minmax(0,1fr)_auto_auto]'
        : action
          ? besideAlways
              ? 'grid-cols-[auto_minmax(0,1fr)_auto] items-center'
              : 'grid-cols-[auto_minmax(0,1fr)] @lg:grid-cols-[auto_minmax(0,1fr)_auto]'
          : 'grid-cols-[auto_minmax(0,1fr)]';

    return (
        <li
            data-slot="attention-item"
            {...data}
            className={`grid items-start gap-x-3 gap-y-2 px-4 py-3 @lg:items-center ${columns}`}
        >
            {/* The light centred in a column as wide as the header's icon tile, so every row's light sits under the
                tile and its text starts under the header's title. */}
            <span aria-hidden="true" className="flex h-5 w-6 shrink-0 items-center justify-center self-start">
                <StatusIndicator tone={tone} />
            </span>
            <div className="min-w-0 [&_code]:wrap-anywhere">
                <TextBase as="div" variant="label" data-slot="title" className="wrap-break-word">
                    {title}
                </TextBase>
                {description ? (
                    <TextBase
                        as="div"
                        variant="caption"
                        tone="muted"
                        data-slot="description"
                        title={singleLine && typeof description === 'string' ? description : undefined}
                        className={`mt-0.5 ${singleLine ? 'truncate' : 'wrap-break-word'}`}
                    >
                        {description}
                    </TextBase>
                ) : null}
            </div>
            {dismissible ? (
                <span className="col-start-3 row-start-1 flex h-5 items-center self-start @lg:col-start-4 @lg:h-auto @lg:self-center">
                    <DismissButton label={dismissLabel!} onClick={onDismiss!} placement="inline" />
                </span>
            ) : null}
            {action ? (
                <div
                    className={`flex flex-wrap items-center gap-2 ${besideAlways ? 'col-start-3 row-start-1 justify-end' : 'col-start-2 @lg:col-start-3 @lg:row-start-1 @lg:justify-end'}`}
                >
                    {action}
                </div>
            ) : null}
        </li>
    );
}

export const AttentionList = Object.assign(AttentionListRoot, { Item: AttentionListItem });
