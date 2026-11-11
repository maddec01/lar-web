import { ChevronDownIcon, ChevronRightIcon, EllipsisIcon } from 'lucide-react';
import { isValidElement, type ReactNode, useRef } from 'react';

import { IconButton } from '../actions/IconButton';
import { useDesignSystemLabels } from '../foundations/DesignSystemProvider';
import { tabbable } from '../foundations/KeyboardFocus';
import { Popover } from '../overlays/Popover';
import { Tooltip, TooltipPopup, TooltipTrigger } from '../overlays/Tooltip';
import { HomeLockup, type HomeLink } from './toolbar/HomeLockup';

export type { HomeLink as TitleBarHome } from './toolbar/HomeLockup';

interface TitleBarProps {
    /** The product's word after the Lar mark, 20/500 in the muted ink, such as "Server", "Factory" or "Account"; left
     *  out, the lockup is just "Lar". It hides under 640px. */
    product?: string;
    /** Where the lockup leads, always the app's home: its `href`, its accessible name (such as "Lar Server, home")
     *  and, for the app's router, `onNavigate`. */
    home?: HomeLink;
    /** @deprecated Pass `product` and `home`: the bar draws the lockup itself, at one height in every app. A custom
     *  brand still renders when `home` is left out. */
    brand?: ReactNode;
    /** Where the reader is, after a divider: a TitleBarTrail. */
    title?: ReactNode;
    /** The command palette's trigger (CommandPaletteTrigger), first in the bar's end group, at its own width (224px,
     *  or wider for its tokens while the bar has room); it folds to its icon first when the bar is narrow. */
    search?: ReactNode;
    /** How things are, where `statusPlacement` puts it (on the left after the lockup and title, by default): a
     *  ToolbarStatusGroup of ToolbarStatusItem buttons or ToolbarCounters. Under 40rem it folds into one "…" button
     *  whose popover holds it, named by `statusLabel`. */
    status?: ReactNode;
    /** The status fold's accessible name and tooltip, such as "Server status". */
    statusLabel?: string;
    /** Where status sits: `start` (the default), after the lockup and title behind a hairline, for counters that
     *  read as the page's summary (the factory's); `end`, after search, for status buttons that open a popover each
     *  (the server's activity, playback and health), beside the other controls. */
    statusPlacement?: 'start' | 'end';
    /** What the app lets you do from anywhere, after search, such as List and Add item: 28px controls (the `sm`
     *  Button, or an IconButton `variant="title-bar"`), which stay on narrow screens (put a labelled one's word in a
     *  TitleBarLabel, which folds it last, under 43rem). */
    actions?: ReactNode;
    /** Settings, after the app's actions: a TitleBarSettingsButton. */
    settings?: ReactNode;
    /** Who is signed in, last: the account menu's avatar button. */
    identity?: ReactNode;
    /** @deprecated Use `status`, which it stands for. */
    secondaryActions?: ReactNode;
    /** @deprecated Use `statusLabel`. */
    secondaryActionsLabel?: string;
}

/**
 * Every Lar app's 52px title bar, T3 Code's, in one arrangement for every app. On the left, the lockup (a link home),
 * where you are and how things are (status), each after a hairline; at the end, one group in a fixed order, search ·
 * (status, where an app places it at the end) · the app's actions · Settings · identity, each a 28px control on a 6px
 * radius, 8px apart, the room between the two sides left empty. The bar is one row at every width and folds in one
 * order as it narrows: search to its icon (when its field no longer fits), then the status counters that fold
 * (ToolbarCounter `fold`, `wide` before `medium`), then the actions' words (TitleBarLabel, under 43rem), then, under
 * 40rem, the status into a "…" popover; the product's word hides under 640px, so the title keeps the room left.
 */
export function TitleBar({
    product,
    home,
    brand,
    title,
    search,
    status: statusProp,
    statusLabel: statusLabelProp,
    statusPlacement = 'start',
    actions,
    settings,
    identity,
    secondaryActions,
    secondaryActionsLabel,
}: TitleBarProps) {
    const labels = useDesignSystemLabels();
    const overflow = useRef<HTMLDivElement>(null);
    const status = statusProp ?? secondaryActions;
    const statusLabel = statusLabelProp ?? secondaryActionsLabel ?? labels.toolbar;
    const hasTitle =
        title != null &&
        title !== false &&
        (typeof title !== 'string' || title.trim().length > 0) &&
        !(
            isValidElement<{ items: readonly TitleBarTrailItem[] }>(title) &&
            title.type === TitleBarTrail &&
            title.props.items.length === 0
        );
    const end = actions || settings || identity || (status && statusPlacement === 'end');
    // The status, shown inline where the bar has room and folded into one "…" popover under 40rem.
    const statusGroup = status ? (
        <>
            <div data-slot="title-bar-status" className="@pane:flex hidden shrink-0 items-center gap-2">
                {status}
            </div>
            <div className="@pane:hidden shrink-0">
                <Popover>
                    <Tooltip>
                        <Popover.Trigger asChild>
                            <TooltipTrigger asChild>
                                <IconButton aria-label={statusLabel} icon={<EllipsisIcon />} variant="title-bar" />
                            </TooltipTrigger>
                        </Popover.Trigger>
                        <TooltipPopup side="bottom">{statusLabel}</TooltipPopup>
                    </Tooltip>
                    <Popover.Content
                        ref={overflow}
                        align={statusPlacement === 'start' ? 'start' : 'end'}
                        presentation="menu"
                        aria-label={statusLabel}
                        tabIndex={-1}
                        // Focus lands on the popover, not its first item, whose tooltip would open with it.
                        onOpenAutoFocus={(event) => {
                            event.preventDefault();
                            overflow.current?.focus();
                        }}
                    >
                        {/* Every status item shows here, including those a wide bar folds by its width. */}
                        <div data-toolbar-overflow className="flex flex-wrap items-center gap-2">
                            {status}
                        </div>
                    </Popover.Content>
                </Popover>
            </div>
        </>
    ) : null;

    return (
        <header
            aria-label={labels.toolbar}
            className="px-gutter-app @container relative flex h-13 min-w-0 items-center gap-2"
        >
            {home ? (
                <HomeLockup home={home} product={product} />
            ) : (
                // A custom brand (deprecated) sits on the same 28px line as the lockup.
                <div className="[&_a]:focus-ring flex h-7 shrink-0 items-center [&_a]:inline-flex [&_a]:items-center [&_a]:rounded-sm">
                    {brand}
                </div>
            )}
            {hasTitle ? (
                <>
                    <span aria-hidden="true" className="bg-line mx-1 h-5 w-px shrink-0 max-sm:hidden" />
                    {/* With search or status after it, the title keeps its own width; with neither, it takes the
                        room (as a bar that puts its own field in the title still does). */}
                    <div className={`flex min-w-0 items-center gap-2 ${search || status ? 'shrink' : 'flex-1'}`}>
                        {title}
                    </div>
                </>
            ) : null}
            {status && statusPlacement === 'start' ? (
                <>
                    <span aria-hidden="true" className="bg-line mx-1 h-5 w-px shrink-0 max-sm:hidden" />
                    {statusGroup}
                </>
            ) : null}
            {/* The room between the two sides: search, first in the end group, sits at its end, so a trigger that
                measures its room (one with tokens) can grow into it and folds to its icon when its field no longer
                fits. Without search, a spacer pushes the end group to the end. */}
            {search ? (
                <div data-slot="title-bar-search" className="ml-auto flex min-w-7 flex-1 items-center justify-end">
                    {search}
                </div>
            ) : hasTitle && !(status && statusPlacement === 'start') ? null : (
                <div aria-hidden="true" className="flex-1" />
            )}
            {end ? (
                <div data-slot="title-bar-actions" className="flex shrink-0 items-center gap-2">
                    {statusPlacement === 'end' ? statusGroup : null}
                    {actions}
                    {settings}
                    {identity}
                </div>
            ) : null}
        </header>
    );
}

/** A title bar action's word, such as "Add item" beside its icon: it shows down to a 43rem bar, after search and
 *  the folding counters have made their room, and below that stays for screen readers only, where the action's glass
 *  tooltip names it. */
export function TitleBarLabel({ children }: { children: ReactNode }) {
    return (
        <span data-slot="title-bar-label" className="@max-[43rem]:sr-only">
            {children}
        </span>
    );
}

export interface TitleBarTrailItem {
    key: string;
    icon?: ReactNode;
    label: string;
    /** Makes the step a button, such as one switching to its siblings; `selectLabel` says where it leads. */
    onSelect?: () => void;
    selectLabel?: string;
    /** False when this location has no alternate destinations, so it renders as text without a chevron. */
    hasChoices?: boolean;
}

/** The title bar's location, T3's "project / thread": each step muted and chevron-separated, the current one
 *  in the foreground. Steps that switch somewhere are buttons with a chevron and a glass tooltip naming the step and
 *  where it leads. The current step keeps to 280px, an earlier one to 160px, so a long name ends in an ellipsis
 *  instead of reaching across the bar. Narrow screens show only the current step. */
export function TitleBarTrail({
    items,
}: {
    /** The location's steps from the top, the current one last. */
    items: readonly TitleBarTrailItem[];
}) {
    return (
        <ol data-slot="title-bar-trail" className="flex min-w-0 items-center gap-0.5 text-(length:--text-ui)">
            {items.map((item, index) => {
                const last = index === items.length - 1;
                const content = (
                    <>
                        {item.icon ? (
                            <span className="text-fg-muted flex shrink-0 max-sm:hidden [&_svg]:size-4">
                                {item.icon}
                            </span>
                        ) : null}
                        <span className="truncate">{item.label}</span>
                    </>
                );

                return (
                    <li
                        key={item.key}
                        aria-current={last ? 'page' : undefined}
                        className={`flex min-w-0 items-center gap-0.5 font-medium ${last ? 'text-fg max-w-70' : 'text-fg-muted hidden max-w-40 shrink-0 sm:flex'}`}
                    >
                        {index > 0 ? (
                            <span aria-hidden="true" className="text-fg-muted hidden shrink-0 sm:flex [&>svg]:size-3.5">
                                <ChevronRightIcon />
                            </span>
                        ) : null}
                        {item.onSelect && item.hasChoices !== false ? (
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <button
                                        {...tabbable}
                                        type="button"
                                        aria-haspopup="dialog"
                                        aria-description={item.selectLabel}
                                        onClick={item.onSelect}
                                        className="hover:bg-fill-hover hover:text-fg focus-ring flex h-7 min-w-0 items-center gap-2 rounded-md px-2 transition-colors"
                                    >
                                        {content}
                                        <span
                                            aria-hidden="true"
                                            className="text-fg-muted flex shrink-0 [&>svg]:size-3.5"
                                        >
                                            <ChevronDownIcon />
                                        </span>
                                    </button>
                                </TooltipTrigger>
                                <TooltipPopup side="bottom">
                                    {item.label}
                                    {item.selectLabel ? (
                                        <span className="text-fg-muted ms-2">{item.selectLabel}</span>
                                    ) : null}
                                </TooltipPopup>
                            </Tooltip>
                        ) : (
                            <span className="flex min-w-0 items-center gap-2 px-2">{content}</span>
                        )}
                    </li>
                );
            })}
        </ol>
    );
}
