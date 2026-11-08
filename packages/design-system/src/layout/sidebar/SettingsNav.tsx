import type { ReactNode } from 'react';

import { SidebarPane } from './SidebarPane';

type DataAttributes = { [key: `data-${string}`]: string | boolean | undefined };

/**
 * Settings' sidebar: the `search` field over the sections' groups (SidebarNavigationGroup), and `empty`, announced,
 * when a search leaves none. `label` names the navigation. The search sits outside the groups' scroller, so on a
 * phone it stays above the sideways row of sections while that row scrolls to the active one.
 */
export function SettingsNav({
    label,
    search,
    empty,
    children,
    ...data
}: {
    /** Names the navigation landmark, such as "Settings". */
    label: string;
    /** A search field over the sections. */
    search?: ReactNode;
    /** What the sidebar says, announced, when a search leaves no section. */
    empty?: string | undefined;
    /** The sections' groups, each a SidebarNavigationGroup. */
    children: ReactNode;
} & DataAttributes) {
    return (
        <div {...data} className="contents">
            <SidebarPane label={label} header={search}>
                {empty && (
                    <p role="status" data-no-match className="text-fg-muted m-0 px-2 py-1 text-xs">
                        {empty}
                    </p>
                )}
                {children}
            </SidebarPane>
        </div>
    );
}
