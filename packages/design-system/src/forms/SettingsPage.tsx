import type { ReactNode } from 'react';

import { SkeletonLoader } from '../feedback/SkeletonLoader';
import { Heading, Text } from '../typography/Typography';
import { SettingsDraftProvider, SettingsSaveBar, useSettingsDrafts } from './SettingsDraft';
import { SettingsSurfaceContext } from './SettingsGroup';

/** The page's own content between its groups (an identity header, a line of text) keeps the groups' text edge, 16px
 *  in from their panels, as the title does; a group, an Alert (a box as wide as a panel) and the save bar don't. */
const textEdgeClassName = '[&>:not([data-settings-group]):not([data-settings-footer]):not([data-slot=alert])]:px-4';

/**
 * Settings as a page rather than a dialog, such as an account's: the page's h1 (22/600) with its actions and a muted
 * line under it, then the same SettingsGroups and SettingsRows as SettingsDialog shows (their titles h2 here, 16/600),
 * in a centred 40rem column so a row's title and its control stay near each other on a wide screen. As in the dialog,
 * every line of text keeps one edge: the title, its line, the page's own content (such as an identity header) and the
 * groups' titles all sit 16px in from the panels. Typed drafts (useSettingsDraft) get the same save model: a save bar
 * sticks to the bottom of the window while one is unsaved.
 */
export function SettingsPage({
    label,
    title,
    description,
    descriptionLoading = false,
    actions,
    onSaved,
    children,
}: {
    /** Names the main landmark; the title by default. */
    label?: string;
    /** The page's h1, such as "Account". */
    title: string;
    /** A line under the title, such as the account's email; it may break anywhere. */
    description?: ReactNode;
    /** Holds the description's line with a placeholder while what it says loads. */
    descriptionLoading?: boolean;
    /** Controls at the title row's end, such as Sign out. */
    actions?: ReactNode;
    /** Called after the save bar saved every draft; by default a "Changes saved" toast. */
    onSaved?: () => void;
    /** The page's SettingsGroups, and whatever else it says (an Alert, an AsyncState). */
    children?: ReactNode;
}) {
    const { registry, summary, setFooter } = useSettingsDrafts({ onSaved });

    return (
        <main
            aria-label={label ?? title}
            className="px-gutter-app flex min-w-0 flex-1 flex-col pt-6 pb-10 sm:pt-10 md:pb-12"
        >
            <div className={`max-w-pane mx-auto grid w-full min-w-0 gap-8 ${textEdgeClassName}`}>
                <div className="grid min-w-0 gap-2">
                    <div className="flex min-w-0 items-center justify-between gap-3">
                        <Heading as="h1" variant="page">
                            {title}
                        </Heading>
                        {actions ? <div className="flex shrink-0 items-center gap-1">{actions}</div> : null}
                    </div>
                    {descriptionLoading ? (
                        <div aria-hidden="true" className="flex h-5 w-56 max-w-full items-center">
                            <SkeletonLoader.Shape />
                        </div>
                    ) : description ? (
                        <Text tone="muted" breaks>
                            {description}
                        </Text>
                    ) : null}
                </div>
                <SettingsDraftProvider registry={registry} summary={summary}>
                    <SettingsSurfaceContext value="page">
                        {children}
                        {/* The save bar, in the menu glass, held at the window's bottom while a draft is unsaved; a
                            part's own SettingsFooter lands here too. */}
                        <div
                            data-settings-footer=""
                            className="glass-menu sticky bottom-4 z-10 grid gap-2 rounded-xl px-4 py-3 not-has-[>div>*]:hidden"
                        >
                            <div ref={setFooter} className="empty:hidden" />
                            <div className="empty:hidden">
                                <SettingsSaveBar />
                            </div>
                        </div>
                    </SettingsSurfaceContext>
                </SettingsDraftProvider>
            </div>
        </main>
    );
}
