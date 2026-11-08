import { useWindowVirtualizer } from '@tanstack/react-virtual';
import { ChevronDownIcon } from 'lucide-react';
import { type CSSProperties, type ReactNode, useCallback, useEffect, useRef } from 'react';

import { SkeletonLoader } from '../feedback/SkeletonLoader';
import { tabbable } from '../foundations/KeyboardFocus';
import { LinkOverlay } from '../typography/Link';
import { columnBreakpoints, columnWidths } from './CollectionTokens';
import { useCollectionViewport } from './CollectionViewport';
import { DataRow } from './DataRow';
import { useCollectionMotion } from './useCollectionMotion';

export interface ListColumn<TItem> {
    id: string;
    label: string;
    hideLabel?: boolean;
    render: (item: TItem, visibleColumns: readonly string[], index: number) => ReactNode;
    size: keyof typeof columnWidths;
    priority?: keyof typeof columnBreakpoints;
    placeholder?: (visibleColumns: readonly string[]) => ReactNode;
    align?: 'right';
}

export interface VirtualListProps<TItem> {
    /** The table's columns, each with its header, width and cell. */
    columns: readonly ListColumn<TItem>[];
    /** How many rows the list holds, loaded or not. */
    count: number;
    /** The item at an index; none while it loads. */
    itemAt: (index: number) => TItem | undefined;
    /** An item's name for screen readers, such as its title. */
    itemLabel: (item: TItem) => string;
    /** Names the table for screen readers, such as "Tracks". */
    label: string;
    /** Called with the first and last index on screen, to load what they need. */
    onRangeChange: (startIndex: number, endIndex: number) => void;
    /** Called with an item as the reader opens its row. */
    onSelect?: (item: TItem) => void;
    /** The page a row opens, making the row a link. */
    itemHref?: (item: TItem) => string | undefined;
    /** Called with a row's href as it is followed, for client-side routing. */
    onNavigate?: (href: string) => void;
    /** Draws the placeholder for a row still loading, in place of the skeleton row. */
    placeholderAt?: (index: number) => ReactNode;
    /** A stable key for the row at an index. */
    itemKey: (index: number) => string;
    /** The first rows are on their way: skeleton rows fill the table. */
    loading?: boolean;
    /** Splits the rows into sections, such as an album's discs: where one starts and its header. */
    section?: {
        isStart: (item: TItem, index: number, previous: TItem | undefined) => boolean;
        render: (item: TItem) => ReactNode;
    };
    /** The column the table is sorted by, marked in its header. */
    sort?: string;
    /** The sort's direction, marked in the sorted column's header. */
    direction?: 'asc' | 'desc';
    /** `compact` rows are 40px instead of 64px, for long lists read line by line, such as tracks. */
    density?: 'default' | 'compact';
}

const rowHeights = { default: 64, compact: 40 } as const;

export function VirtualList<TItem>({
    columns,
    count,
    itemAt,
    itemLabel,
    label,
    onRangeChange,
    onSelect,
    itemHref,
    onNavigate,
    placeholderAt,
    itemKey,
    loading,
    section,
    sort,
    direction = 'asc',
    density = 'default',
}: VirtualListProps<TItem>) {
    const { scrollMargin, setCollectionElement, width } = useCollectionViewport();
    const root = useRef<HTMLDivElement>(null);
    const attachRoot = useCallback(
        (element: HTMLDivElement | null) => {
            root.current = element;
            setCollectionElement(element);
        },
        [setCollectionElement],
    );

    useCollectionMotion(root);

    const visibleColumns = columns.filter(
        (column) => column.id === sort || width >= columnBreakpoints[column.priority ?? 'primary'],
    );
    const visibleColumnIds = visibleColumns.map((column) => column.id);
    const virtualizer = useWindowVirtualizer({
        count,
        // Layout belongs to stable collection slots. Domain keys still identify
        // mounted rows below; changing page data must not remeasure every slot.
        // Section headers are measured with their mounted row wrappers.
        estimateSize: () => rowHeights[density],
        overscan: 8,
        scrollMargin,
    });
    const virtualItems = virtualizer.getVirtualItems();
    const startIndex = Math.max(0, virtualItems[0]?.index ?? 0);
    const endIndex = Math.min(count - 1, virtualItems.at(-1)?.index ?? 0);

    useEffect(() => {
        if (endIndex >= startIndex) onRangeChange(startIndex, endIndex);
    }, [endIndex, onRangeChange, startIndex]);

    return (
        <div
            role="table"
            aria-label={label}
            aria-busy={loading}
            aria-rowcount={count + 1}
            aria-colcount={visibleColumns.length}
            data-density={density}
            className="group/list border-line bg-surface-raised @container min-w-0 rounded-b-xl border-x border-b"
            style={
                {
                    '--lar-list-columns': visibleColumns.map((column) => columnWidths[column.size]).join(' '),
                } as CSSProperties
            }
        >
            <div
                role="rowgroup"
                className="bg-surface-page sticky top-(--lar-header-height,0px) z-20 -mx-px -mt-(--lar-page-gutter,0px) pt-(--lar-page-gutter,0px)"
            >
                <div
                    role="row"
                    aria-rowindex={1}
                    className="border-line bg-surface-raised box-content grid h-10 grid-cols-(--lar-list-columns) items-center gap-4 rounded-t-xl border px-3"
                >
                    {visibleColumns.map((column) => (
                        <div
                            key={column.id}
                            role="columnheader"
                            aria-sort={
                                column.id === sort ? (direction === 'asc' ? 'ascending' : 'descending') : undefined
                            }
                            className={`flex min-w-0 items-center gap-1 text-xs font-medium ${column.align === 'right' ? 'justify-end' : ''} ${column.id === sort ? 'text-fg' : 'text-fg-muted'}`}
                        >
                            <span className={column.hideLabel ? 'sr-only' : 'truncate'}>{column.label}</span>
                            {column.id === sort ? (
                                <ChevronDownIcon
                                    aria-hidden="true"
                                    className={`size-3.5 shrink-0 transition-transform ${direction === 'asc' ? 'rotate-180' : ''}`}
                                />
                            ) : null}
                        </div>
                    ))}
                </div>
            </div>
            <div
                ref={attachRoot}
                role="rowgroup"
                className="relative w-full"
                style={{ height: virtualizer.getTotalSize() }}
            >
                {virtualItems.map((item) => {
                    const index = item.index;
                    const key = itemKey(index);
                    const value = itemAt(index);
                    const href = value ? itemHref?.(value) : undefined;
                    const placeholder = placeholderAt?.(index);
                    const sectionStart = value && section?.isStart(value, index, itemAt(index - 1));

                    return (
                        <div
                            key={key}
                            data-collection-key={key}
                            role="presentation"
                            ref={virtualizer.measureElement}
                            data-index={item.index}
                            className="absolute top-0 left-0 w-full"
                            style={{ top: item.start - scrollMargin }}
                        >
                            {sectionStart ? section?.render(value) : null}
                            <div style={{ height: rowHeights[density] }}>
                                <DataRow rowIndex={item.index + 2} interactive={Boolean(value && (href || onSelect))}>
                                    {placeholder ? (
                                        <div
                                            role="cell"
                                            aria-colspan={visibleColumns.length}
                                            className="col-span-full min-w-0"
                                        >
                                            {placeholder}
                                        </div>
                                    ) : (
                                        visibleColumns.map((column, columnIndex) => {
                                            const content = value
                                                ? column.render(value, visibleColumnIds, index)
                                                : undefined;

                                            return (
                                                <div
                                                    key={column.id}
                                                    role="cell"
                                                    title={typeof content === 'string' ? content : undefined}
                                                    className={`min-w-0 truncate text-sm ${column.align === 'right' ? 'text-right tabular-nums' : ''} ${column.id === sort || columnIndex === 0 ? 'text-fg' : 'text-fg-muted'}`}
                                                >
                                                    {!value ? (
                                                        (column.placeholder?.(visibleColumnIds) ?? (
                                                            <SkeletonLoader.Shape width="wide" />
                                                        ))
                                                    ) : columnIndex === 0 ? (
                                                        <>
                                                            {href ? (
                                                                <LinkOverlay
                                                                    href={href}
                                                                    onNavigate={onNavigate}
                                                                    aria-label={itemLabel(value)}
                                                                />
                                                            ) : onSelect ? (
                                                                <button
                                                                    {...tabbable}
                                                                    type="button"
                                                                    data-slot="action-overlay"
                                                                    aria-label={itemLabel(value)}
                                                                    onClick={() => onSelect(value)}
                                                                    className="focus-ring-inset absolute inset-0 z-1 block w-full cursor-pointer rounded-md"
                                                                />
                                                            ) : null}
                                                            <div className="py-2 group-data-[density=compact]/list:py-0">
                                                                {content}
                                                            </div>
                                                        </>
                                                    ) : (
                                                        content
                                                    )}
                                                </div>
                                            );
                                        })
                                    )}
                                </DataRow>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
