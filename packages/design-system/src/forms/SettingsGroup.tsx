/* oxlint-disable react/only-export-components -- The settings surface's context belongs with the group that reads it. */

import { createContext, type ReactNode, type Ref, useContext, useId } from 'react';

import { ghostEdgeClassName } from '../actions/GhostEdge';
import { Count } from '../display/Count';
import { HelpTip } from '../overlays/HelpTip';
import { FormRowsContext } from './FormRows';
import { SettingsRowSkeleton, Skeletal } from './SettingsRow';

type DataAttributes = { [key: `data-${string}`]: string | boolean | undefined };

/**
 * Where settings are shown: in a SettingsDialog (`dialog`, whose breadcrumb is the h2), on a SettingsPage (`page`,
 * under its h1), or neither (a group in some other dialog or form). A group's title is 16/600 on a settings surface and
 * 14/600 elsewhere, where a dialog's own 16/600 title sits above it; its heading level follows too.
 */
export const SettingsSurfaceContext = createContext<'dialog' | 'page' | null>(null);

/** A row placeholder a loading group draws: the loaded row's title (and description), measured for real widths. */
export interface SettingsSkeletonRow {
    /** The loaded row's title. */
    label?: string;
    /** The loaded row's description: its text, or false for none. */
    description?: boolean | string;
    /** The loaded control's footprint. */
    control?: 'button' | 'switch' | 'input' | 'select' | 'value' | 'none';
}

export interface SettingsGroupProps extends DataAttributes {
    /** The group's title, such as "Notifications". */
    title?: ReactNode;
    /** A muted line under the title. A caption about the action belongs here, never under the button. */
    description?: ReactNode;
    /** Explains the group in a popover from a help button after the title; `helpLabel` names that button. */
    help?: ReactNode;
    /** Names the help button; the title by default. */
    helpLabel?: string;
    /** A control at the title's end, such as "Add folder" or "Restore defaults": a `size="sm"` secondary or quiet
     *  Button. A quiet one sits flush with the panel's edge like a bordered one. */
    action?: ReactNode;
    /** The group's quiet item count, after the title. */
    count?: number;
    /** Says what `count` counts for screen readers, such as "3 folders". */
    countLabel?: string;
    /** Badges after the title, such as a StatusIndicator with its word. */
    badges?: ReactNode;
    /** The title's heading level; h3 in a dialog (under its h2 breadcrumb) and elsewhere, h2 on a SettingsPage. */
    level?: 'h2' | 'h3' | 'h4';
    /** `true` (the default) puts the children, SettingsRows, in the group's panel, divided by lines; `false` shows them
     *  as given, such as cards or several panels with notes between them. */
    panel?: boolean;
    /** Under the panel's rows, on its sunken strip: the group's own action at the list's end, such as "Add project". */
    footer?: ReactNode;
    /** `danger` edges the panel in the danger tone, for a group whose rows can't be undone, such as deleting an
     *  account. Its trigger stays a quiet red button; only the confirm is solid red. */
    tone?: 'default' | 'danger';
    /** Under the panel, outside it: a SettingsNote, such as what the group's last check found. */
    note?: ReactNode;
    /** Marks the group busy: its count hides, its action is held as a skeleton and the rows are drawn as skeletons. */
    loading?: boolean;
    /** Names what is loading for screen readers; the title by default. */
    loadingLabel?: string;
    /** While loading, the rows to draw: a number of typical rows, or the loaded rows' titles for their real widths.
     *  Without it the children themselves are shown, inert and hidden from screen readers. */
    skeleton?: number | readonly SettingsSkeletonRow[];
    /** Names the group when its title doesn't, or when it has none. */
    'aria-label'?: string;
    /** The section element, such as for moving focus to the group after the control that had it goes. */
    ref?: Ref<HTMLElement>;
    /** Focusable by script (tabIndex -1), for the `ref` focus above. */
    focusable?: boolean;
    /** The group's SettingsRows (or, without a panel, its content). */
    children?: ReactNode;
}

/** The panel as no box of its own when an Alert (bare, or alone in a padded wrapper such as FormContent) is all it
 *  holds. */
const alertOnly =
    '[&:has(>[data-slot=alert]:only-child)]:contents [&:has(>:only-child>[data-slot=alert]:only-child)]:contents [&:has(>:only-child>[data-slot=alert]:only-child)>*]:p-0';

/**
 * A settings group, T3 Code's: a title (16/600 in full foreground on a settings surface) with its count, badges, help
 * and an action at its end, an optional muted description, then its rows in one panel (a hairline edge, 12px corners,
 * rows divided by lines). The title lines up with the rows' text, 16px in from the panel's edge.
 */
export function SettingsGroup({
    title,
    description,
    help,
    helpLabel,
    action,
    count,
    countLabel,
    badges,
    level,
    panel = true,
    footer,
    tone = 'default',
    note,
    loading = false,
    loadingLabel,
    skeleton,
    'aria-label': ariaLabel,
    ref,
    focusable = false,
    children,
    ...data
}: SettingsGroupProps) {
    const titleId = useId();
    const surface = useContext(SettingsSurfaceContext);
    const Heading = level ?? (surface === 'page' ? 'h2' : 'h3');
    const named = typeof title === 'string' ? title : undefined;
    const rows =
        loading && skeleton !== undefined
            ? (typeof skeleton === 'number' ? Array.from({ length: Math.max(0, skeleton) }, () => ({})) : skeleton).map(
                  (row, index) => <SettingsRowSkeleton key={index} {...row} />,
              )
            : children;
    // The settings panel (InsetPanel `settings`'s look): a hairline edge, 12px corners, rows divided by lines; a danger
    // group (deleting an account) edges it in the danger tone. A panel holding only an Alert (a load that failed, a
    // notice in place of the rows), bare or in a FormContent, steps aside: the alert's own 12px box stands in its
    // place rather than a box inside a box.
    const body = panel ? (
        <div
            data-slot="settings-panel"
            className={`divide-line surface-panel divide-y overflow-hidden rounded-xl border ${tone === 'danger' ? 'border-danger-edge' : ''} ${alertOnly}`}
        >
            <FormRowsContext value="panel">{rows}</FormRowsContext>
            {footer && !loading ? <div className="bg-surface-sunken px-4 py-2">{footer}</div> : null}
        </div>
    ) : (
        rows
    );
    const header = title || action || description;

    return (
        <section
            {...data}
            ref={ref}
            tabIndex={focusable ? -1 : undefined}
            data-settings-group=""
            aria-label={ariaLabel}
            aria-labelledby={ariaLabel || !title ? undefined : titleId}
            aria-busy={loading || undefined}
            // A FormResult with nothing to say stays mounted as a live region but takes no room; a slow read's "Still
            // trying…" lines up with the title and the rows' text.
            // A compact alert as the group's note sits 8px under the panel.
            className="grid min-w-0 gap-3 outline-none [&_[data-slot=async-state][data-slow]>[role=status]]:px-4 [&>[data-presentation=inline]]:-mt-1 [&>[role=status]:empty]:-mt-3"
        >
            {header ? (
                <div className="grid min-w-0 gap-1 px-4">
                    <div className="flex min-h-7 min-w-0 items-center justify-between gap-3">
                        <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1">
                            {title ? (
                                <Heading
                                    id={titleId}
                                    className={`text-fg m-0 flex min-w-0 items-center gap-1.5 font-semibold wrap-anywhere ${surface ? 'text-base leading-6' : 'text-sm leading-5'}`}
                                >
                                    {title}
                                    {help && (
                                        <HelpTip label={helpLabel ?? named ?? ''} side="top">
                                            {help}
                                        </HelpTip>
                                    )}
                                </Heading>
                            ) : null}
                            <Count count={count} label={countLabel} loading={loading} />
                            {badges}
                        </div>
                        {action ? (
                            <div
                                aria-hidden={loading || undefined}
                                inert={loading || undefined}
                                className={`flex shrink-0 items-center gap-2 ${ghostEdgeClassName}`}
                            >
                                <Skeletal loading={loading} shape="control">
                                    {action}
                                </Skeletal>
                            </div>
                        ) : null}
                    </div>
                    {description ? (
                        <div className="text-fg-muted text-xs leading-4.5 wrap-anywhere">{description}</div>
                    ) : null}
                </div>
            ) : null}
            {loading ? (
                <div role="status" aria-label={loadingLabel ?? named}>
                    <div aria-hidden="true" inert>
                        {body}
                    </div>
                </div>
            ) : (
                body
            )}
            {note && !loading ? note : null}
        </section>
    );
}
