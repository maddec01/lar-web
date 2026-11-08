import { type ReactNode, useCallback, useRef } from 'react';

import { SkeletonLoader } from '../feedback/SkeletonLoader';
import { StackBase } from '../layout/Flow';
import { useScrollFade } from '../overlays/useScrollFade';
import { Text } from '../typography/Typography';
import { moveTabSelection } from './TabKeys';
import { useRevealSelection } from './useRevealSelection';

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
    /** The tabs, each with its artwork and label. */
    items: readonly ArtworkTabsItem<T>[];
    /** Names the tab list for screen readers, such as "Seasons". */
    label: string;
    /** The chosen tab's value; none while nothing is chosen. */
    value: T | undefined;
    /** Called with a tab's value as it is chosen. */
    onChange: (value: T) => void;
    /** The tabs are on their way: placeholders take their place. */
    loading?: boolean;
    /** What screen readers hear while the tabs load. */
    loadingLabel?: string;
}) {
    const tabs = useRef<HTMLDivElement>(null);
    const { setViewport, className: fade } = useScrollFade({ axis: 'horizontal' });
    const attachRow = useCallback(
        (element: HTMLDivElement | null) => {
            tabs.current = element;
            setViewport(element);
        },
        [setViewport],
    );

    useRevealSelection(tabs, value, loading);

    if (loading)
        return (
            <SkeletonLoader label={loadingLabel}>
                <div ref={attachRow} className={`${row} ${fade}`}>
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
            ref={attachRow}
            role="tablist"
            aria-label={label}
            className={`${row} ${fade}`}
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
                        className="group hover:bg-fill-hover focus-ring aria-selected:bg-fill-selected aria-selected:ring-line flex w-56 shrink-0 items-center gap-3 rounded-lg p-1.5 pr-3 text-left transition-colors aria-selected:ring-1"
                        onClick={() => onChange(item.value)}
                    >
                        <span className="ring-fg/10 w-12 shrink-0 overflow-hidden rounded-md ring-1 transition-opacity group-hover:opacity-100 group-aria-[selected=false]:opacity-70">
                            {item.artwork}
                        </span>
                        <StackBase space="none" className="min-w-0">
                            <Text as="span" variant="label" truncate>
                                {item.label}
                            </Text>
                            {item.caption ? (
                                <Text as="span" variant="caption" tone="muted" truncate>
                                    {item.caption}
                                </Text>
                            ) : null}
                        </StackBase>
                    </button>
                );
            })}
        </div>
    );
}
