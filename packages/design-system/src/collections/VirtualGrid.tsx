import { useWindowVirtualizer } from '@tanstack/react-virtual';
import { type ReactNode, useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';

import { useCollectionViewport } from './CollectionViewport';
import { useCollectionMotion } from './useCollectionMotion';

interface VirtualGridProps {
    /** How many items the grid holds, loaded or not. */
    count: number;
    /** Names the grid for screen readers, such as "Albums". */
    label: string;
    /** Called with the first and last index on screen, to load what they need. */
    onRangeChange: (startIndex: number, endIndex: number) => void;
    /** Draws the item at an index, or its placeholder while it loads. */
    renderItem: (index: number) => ReactNode;
    /** The cards' art: `square` (the default), such as albums, or `poster`, such as films. */
    aspect?: 'square' | 'poster';
    /** A stable key for the item at an index. */
    itemKey: (index: number) => string;
    /** The first items are on their way: placeholders fill the grid. */
    loading?: boolean;
}

// Every ImageCard's caption: its title, its maker and its meta row.
const captionRows = 3;

export function VirtualGrid({
    count,
    label,
    onRangeChange,
    renderItem,
    itemKey,
    loading,
    aspect = 'square',
}: VirtualGridProps) {
    const { scrollMargin, setCollectionElement, width } = useCollectionViewport();
    const root = useRef<HTMLDivElement>(null);

    useCollectionMotion(root);

    const gap = 16;
    // The space under a row of cards.
    const rowGap = 20;
    const maxItemWidth = 170;
    // Reserve the tallest grid until measured so history restoration is not clipped.
    const layoutWidth = width || maxItemWidth * 2 + gap;
    const columns = Math.max(2, Math.round((layoutWidth + gap) / (maxItemWidth + gap)));
    const itemWidth = Math.min(maxItemWidth, Math.max(0, (layoutWidth - gap * (columns - 1)) / columns));
    // The art, the space under it, then ImageCard's three caption rows (20px each, 2px apart) and the row gap.
    const estimatedHeight = itemWidth * (aspect === 'poster' ? 1.5 : 1) + 8 + captionRows * 22 - 2 + rowGap;
    // Rows grow, all together, to the tallest card measured at this layout, such as one with art of its own ratio;
    // they never shrink below the estimate, so the size only ever grows and settles.
    const layout = `${columns}:${estimatedHeight}`;
    const [tallest, setTallest] = useState<{ layout: string; height: number }>();
    const rowHeight = Math.max(estimatedHeight, tallest?.layout === layout ? tallest.height + rowGap : 0);
    const rowCount = Math.ceil(count / columns);
    const virtualizer = useWindowVirtualizer({
        count: rowCount,
        estimateSize: () => rowHeight,
        overscan: 2,
        scrollMargin,
    });
    const rows = virtualizer.getVirtualItems();
    const startIndex = (rows[0]?.index ?? 0) * columns;
    const endIndex = Math.min(count - 1, ((rows.at(-1)?.index ?? 0) + 1) * columns - 1);

    useEffect(() => {
        virtualizer.measure();
    }, [columns, rowHeight, virtualizer]);

    const measureCards = useCallback(() => {
        let height = 0;

        for (const item of root.current?.querySelectorAll<HTMLElement>('[data-collection-key]') ?? [])
            height = Math.max(height, item.offsetHeight);

        setTallest((current) =>
            current?.layout === layout && current.height >= height ? current : { layout, height },
        );
    }, [layout]);
    const observer = useRef<ResizeObserver>(undefined);

    useLayoutEffect(() => {
        measureCards();

        if (typeof ResizeObserver === 'undefined') return;

        observer.current?.disconnect();
        observer.current = new ResizeObserver(() => measureCards());
        for (const item of root.current?.querySelectorAll('[data-collection-key]') ?? [])
            observer.current.observe(item);
    });

    useEffect(() => () => observer.current?.disconnect(), []);

    useEffect(() => {
        if (count > 0) onRangeChange(startIndex, endIndex);
    }, [count, endIndex, onRangeChange, startIndex]);

    return (
        <div ref={setCollectionElement} role="region" aria-label={label}>
            <div
                ref={root}
                className="relative w-full"
                aria-busy={loading}
                style={{ height: virtualizer.getTotalSize() }}
            >
                {rows.flatMap((row) =>
                    Array.from({ length: columns }, (_, column) => {
                        const index = row.index * columns + column;
                        const key = itemKey(index);

                        return index < count ? (
                            <div
                                key={key}
                                data-collection-key={key}
                                data-index={index}
                                className="absolute"
                                style={{
                                    left: column * (itemWidth + (layoutWidth - columns * itemWidth) / (columns - 1)),
                                    top: row.start - scrollMargin,
                                    width: itemWidth,
                                }}
                            >
                                {renderItem(index)}
                            </div>
                        ) : null;
                    }),
                )}
            </div>
        </div>
    );
}
