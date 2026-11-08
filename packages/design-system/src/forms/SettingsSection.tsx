import { type ReactNode, useId } from 'react';

import { InsetPanel } from '../display/InsetPanel';
import { SectionTitle } from '../layout/SectionTitle';
import { Text } from '../typography/Typography';
import { SettingsRowSkeleton } from './SettingsRow';

/** A settings group with its add action on the heading, above its rows or cards. */
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
    /** Add or create control, conventionally a compact secondary Button. A ghost action (or a group ending in one)
     *  sits flush with the edge like a bordered one. A caption about the action belongs in `description`, never
     *  under the button. */
    action?: ReactNode;
    /** The group's quiet item count. */
    count?: number;
    /** Accessible context for the count. */
    countLabel?: string;
    /** Marks the section busy, suppresses provisional counts and holds its heading action. */
    loading?: boolean;
    /** Accessible loading announcement; the title by default. */
    loadingLabel?: string;
    /** N standard row placeholders while loading. For a custom layout compose SettingsRowSkeleton as children. */
    skeletonRows?: number;
    /** Settings rows or resource cards. */
    children?: ReactNode;
}) {
    const id = useId();

    return (
        <section aria-labelledby={id} aria-busy={loading ?? false} className="grid min-w-0 gap-3">
            <SectionTitle
                id={id}
                title={title}
                level="h3"
                countLabel={countLabel}
                actions={
                    action ? (
                        <div
                            aria-hidden={loading || undefined}
                            inert={loading || undefined}
                            className={loading ? 'settings-loading' : undefined}
                        >
                            {action}
                        </div>
                    ) : undefined
                }
                count={loading ? undefined : count}
            />
            {description ? (
                <Text variant="caption" tone="muted">
                    {description}
                </Text>
            ) : null}
            {loading ? (
                <div role="status" aria-label={loadingLabel ?? title}>
                    <div aria-hidden="true" inert>
                        {skeletonRows !== undefined ? (
                            <InsetPanel presentation="settings">
                                {Array.from({ length: Math.max(0, skeletonRows) }, (_, index) => (
                                    <SettingsRowSkeleton key={index} />
                                ))}
                            </InsetPanel>
                        ) : (
                            children
                        )}
                    </div>
                </div>
            ) : (
                children
            )}
        </section>
    );
}
