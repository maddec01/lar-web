import { ChevronDownIcon, ChevronRightIcon, EllipsisIcon } from 'lucide-react';
import { isValidElement, type ReactNode } from 'react';

import { IconButton } from '../actions/IconButton';
import { useDesignSystemLabels } from '../foundations/DesignSystemProvider';
import { tabbable } from '../foundations/KeyboardFocus';
import { Popover } from '../overlays/Popover';

interface TitleBarProps {
    /** Essential tools at the bar's end, such as Settings (TitleBarSettingsButton) and the account menu; they stay
     *  visible on narrow screens. Every tool at the bar's end, search included, is one even 8px step from the next
     *  (4px on a phone): one group, no dividers. */
    actions?: ReactNode;
    /** Secondary tools fold into a popover under 40rem; keep essential actions in actions. */
    secondaryActions?: ReactNode;
    /** The folded tools menu's accessible name, such as "More actions". */
    secondaryActionsLabel?: string;
    /** The brand, a link home, before a divider and the title. */
    brand: ReactNode;
    /** The command palette's trigger, centred in the bar; it folds to an icon when the bar is narrow. */
    search?: ReactNode;
    /** Where the reader is: the brand and a TitleBarTrail. */
    title: ReactNode;
}

/** T3 Code's 52px title bar: the brand and where you are on the left, tools on the right. Its own width,
 *  not the window's, decides when search folds to an icon; narrow screens close the gaps so the title keeps
 *  the room left. */
export function TitleBar({ actions, secondaryActions, secondaryActionsLabel, brand, search, title }: TitleBarProps) {
    const labels = useDesignSystemLabels();
    const hasTitle =
        title != null &&
        title !== false &&
        (typeof title !== 'string' || title.trim().length > 0) &&
        !(
            isValidElement<{ items: readonly TitleBarTrailItem[] }>(title) &&
            title.type === TitleBarTrail &&
            title.props.items.length === 0
        );

    return (
        <header
            aria-label={labels.toolbar}
            className="px-gutter-app @container relative flex h-13 min-w-0 items-center gap-1 sm:gap-2"
        >
            <div className="[&_a]:focus-ring flex shrink-0 items-center [&_a]:rounded-sm">{brand}</div>
            {hasTitle ? <span aria-hidden="true" className="bg-line mx-1 h-5 w-px shrink-0 max-sm:hidden" /> : null}
            <div className="flex min-w-0 flex-1 items-center gap-1">{title}</div>
            {search ? <div className="flex shrink-0">{search}</div> : null}
            {secondaryActions ? (
                <>
                    <div className="@pane:flex hidden shrink-0 items-center gap-1 sm:gap-2">{secondaryActions}</div>
                    <div className="@pane:hidden shrink-0">
                        <Popover>
                            <Popover.Trigger asChild>
                                <IconButton
                                    aria-label={secondaryActionsLabel ?? labels.toolbar}
                                    title={secondaryActionsLabel ?? labels.toolbar}
                                    icon={<EllipsisIcon />}
                                    variant="title-bar"
                                />
                            </Popover.Trigger>
                            <Popover.Content align="end" aria-label={secondaryActionsLabel ?? labels.toolbar}>
                                <div className="flex items-center gap-2">{secondaryActions}</div>
                            </Popover.Content>
                        </Popover>
                    </div>
                </>
            ) : null}
            {actions ? <div className="flex shrink-0 items-center gap-1 sm:gap-2">{actions}</div> : null}
        </header>
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
 *  in the foreground. Steps that switch somewhere are buttons with a chevron. Narrow screens show only the
 *  current step. */
export function TitleBarTrail({
    items,
}: {
    /** The location's steps from the top, the current one last. */
    items: readonly TitleBarTrailItem[];
}) {
    return (
        <ol className="flex min-w-0 items-center gap-0.5 text-sm">
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
                        className={`flex min-w-0 items-center gap-0.5 ${last ? 'text-fg font-medium' : 'text-fg-muted hidden shrink-0 sm:flex'}`}
                    >
                        {index > 0 ? (
                            <span aria-hidden="true" className="text-fg-muted hidden shrink-0 sm:flex [&>svg]:size-3.5">
                                <ChevronRightIcon />
                            </span>
                        ) : null}
                        {item.onSelect && item.hasChoices !== false ? (
                            <button
                                {...tabbable}
                                type="button"
                                aria-haspopup="dialog"
                                aria-description={item.selectLabel}
                                title={[item.label, item.selectLabel].filter(Boolean).join(' · ')}
                                onClick={item.onSelect}
                                className="hover:bg-fill-hover hover:text-fg focus-ring flex h-7 min-w-0 items-center gap-2 rounded-lg px-2 transition-colors"
                            >
                                {content}
                                <span aria-hidden="true" className="text-fg-muted flex shrink-0 [&>svg]:size-3.5">
                                    <ChevronDownIcon />
                                </span>
                            </button>
                        ) : (
                            <span className="flex min-w-0 items-center gap-2 px-2">{content}</span>
                        )}
                    </li>
                );
            })}
        </ol>
    );
}
