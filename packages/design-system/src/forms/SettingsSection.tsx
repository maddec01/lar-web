import type { ReactNode } from 'react';

import { SettingsGroup } from './SettingsGroup';

/**
 * @deprecated Use SettingsGroup, the one settings group: this is SettingsGroup with `panel={false}` (its children
 * as given, such as rows in their own InsetPanel or resource cards), kept so older callers draw the same anatomy.
 */
export function SettingsSection({
    title,
    description,
    action,
    count,
    countLabel,
    loading,
    loadingLabel,
    skeletonRows,
    children,
}: {
    /** The settings group's title. */
    title: string;
    /** Context under the title. */
    description?: ReactNode;
    /** Add or create control, conventionally a compact secondary Button. */
    action?: ReactNode;
    /** The group's quiet item count. */
    count?: number;
    /** Accessible context for the count. */
    countLabel?: string;
    /** Marks the section busy, suppresses provisional counts and holds its heading action. */
    loading?: boolean;
    /** Accessible loading announcement; the title by default. */
    loadingLabel?: string;
    /** N standard row placeholders (in a panel) while loading. For a custom layout compose SettingsRowSkeleton. */
    skeletonRows?: number;
    /** Settings rows or resource cards. */
    children?: ReactNode;
}) {
    return (
        <SettingsGroup
            title={title}
            description={description}
            action={action}
            count={count}
            countLabel={countLabel}
            loading={loading}
            loadingLabel={loadingLabel}
            panel={loading === true && skeletonRows !== undefined}
            skeleton={skeletonRows}
        >
            {children}
        </SettingsGroup>
    );
}
