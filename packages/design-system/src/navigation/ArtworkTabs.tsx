import { type ReactNode, useEffect, useRef } from 'react';

import { revealInRow } from '../collections/useScrollRow';
import { SkeletonLoader } from '../feedback/SkeletonLoader';
import { Stack } from '../layout/Flow';
import { Text } from '../typography/Typography';
import { moveTabSelection } from './TabKeys';

export interface ArtworkTabsItem<T extends string> {
    value: T;
    label: string;
    caption?: string;
    /** Small poster artwork, about 3rem wide. */
    artwork: ReactNode;
}

const row = '-mx-1 flex gap-3 overflow-x-auto px-1 pt-1 pb-2';

/** One sideways-scrolling row of tabs with small artwork, such as a show's seasons. */
export function ArtworkTabs<T extends string>({
    items,
    label,
    value,
    onChange,
    loading = false,
    loadingLabel = label,
}: {
    items: readonly ArtworkTabsItem<T>[];
    label: string;
    value: T | undefined;
    onChange: (value: T) => void;
    loading?: boolean;
    loadingLabel?: string;
}) {
    const tabs = useRef<HTMLDivElement>(null);

    // The selected tab stays in view however it was chosen, such as by an episode crossing into the next season.
    useEffect(() => {
        if (tabs.current && value !== undefined)
            revealInRow(tabs.current, tabs.current.querySelector(`[data-value="${value}"]`));
    }, [value, loading]);

    if (loading)
        return (
            <SkeletonLoader label={loadingLabel}>
                <div className={row}>
                    {Array.from({ length: 4 }, (_, index) => (
                        <div key={index} className="flex w-56 shrink-0 items-center gap-3 p-1.5">
                            <span className="w-12 shrink-0">
                                <SkeletonLoader.Shape presentation="poster" />
                            </span>
                            <SkeletonLoader.Shape width="wide" />
                        </div>
                    ))}
                </div>
            </SkeletonLoader>
        );

    return (
        <div
            ref={tabs}
            role="tablist"
            aria-label={label}
            className={row}
            onKeyDown={(event) => {
                if (value !== undefined)
                    moveTabSelection(
                        event,
                        items.map((item) => item.value),
                        value,
                        onChange,
                    );
            }}
        >
            {items.map((item) => {
                const selected = item.value === value;

                return (
                    <button
                        key={item.value}
                        type="button"
                        role="tab"
                        aria-selected={selected}
                        tabIndex={selected ? 0 : -1}
                        data-value={item.value}
                        className="group hover:bg-base-200 focus-visible:outline-primary aria-selected:bg-base-200 aria-selected:ring-base-300 flex w-56 shrink-0 items-center gap-3 rounded-lg p-1.5 pr-3 text-left transition-colors focus-visible:outline-2 aria-selected:ring-1"
                        onClick={() => onChange(item.value)}
                    >
                        <span className="ring-base-900/10 w-12 shrink-0 overflow-hidden rounded-md ring-1 transition-opacity group-hover:opacity-100 group-aria-[selected=false]:opacity-70">
                            {item.artwork}
                        </span>
                        <Stack space="none" className="min-w-0">
                            <Text as="span" variant="label" truncate>
                                {item.label}
                            </Text>
                            {item.caption ? (
                                <Text as="span" variant="caption" tone="muted" truncate>
                                    {item.caption}
                                </Text>
                            ) : null}
                        </Stack>
                    </button>
                );
            })}
        </div>
    );
}
