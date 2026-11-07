import { useWindowVirtualizer } from '@tanstack/react-virtual';
import { type ReactNode, useEffect, useRef } from 'react';

import { useCollectionViewport } from './CollectionViewport';
import { useCollectionMotion } from './useCollectionMotion';

interface VirtualGridProps {
    count: number;
    label: string;
    onRangeChange: (startIndex: number, endIndex: number) => void;
    renderItem: (index: number) => ReactNode;
    textRows?: 1 | 2 | 3;
    aspect?: 'square' | 'poster';
    itemKey: (index: number) => string;
    loading?: boolean;
}

export function VirtualGrid({
    count,
    label,
    onRangeChange,
    renderItem,
    itemKey,
    loading,
    textRows = 2,
    aspect = 'square',
}: VirtualGridProps) {
    const { scrollMargin, setCollectionElement, width } = useCollectionViewport();
    const root = useRef<HTMLDivElement>(null);

    useCollectionMotion(root);

    const gap = 16;
    const maxItemWidth = 170;
    // Reserve the tallest grid until measured so history restoration is not clipped.
    const layoutWidth = width || maxItemWidth * 2 + gap;
    const columns = Math.max(2, Math.round((layoutWidth + gap) / (maxItemWidth + gap)));
    const itemWidth = Math.min(maxItemWidth, Math.max(0, (layoutWidth - gap * (columns - 1)) / columns));
    const rowHeight = itemWidth * (aspect === 'poster' ? 1.5 : 1) + 64 + (textRows - 2) * 16;
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
