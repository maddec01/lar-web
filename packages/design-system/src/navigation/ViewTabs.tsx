import { type ReactNode, useCallback, useRef } from 'react';

import { Count } from '../display/Count';
import { useScrollFade } from '../overlays/useScrollFade';
import { moveTabSelection } from './TabKeys';
import { useRevealSelection } from './useRevealSelection';

export interface ViewTabsItem<T extends string> {
    value: T;
    label: string;
    /** Already formatted for the viewer's locale. */
    count?: string;
    /** Hide the count while this tab’s collection loads. */
    loading?: boolean;
}

interface ViewTabsProps<T extends string> {
    /** The tabs, each with its label and count. */
    items: readonly ViewTabsItem<T>[];
    /** Names the tab list for screen readers. */
    label: string;
    /** Called with a tab's value as it is chosen. */
    onChange: (value: T) => void;
    /** The chosen tab's value. */
    value: T;
    /** A control that acts on the same list, such as its search, beside the tabs on wide screens. */
    end?: ReactNode;
}

/** A row of tabs that switches which list the page shows, each with its count: quiet text tabs and the chosen one a
 *  rounded pill (segment-chosen), unruled. The row bleeds by its tabs' padding (`row-inset`), so the first tab's
 *  label sits on the content edge. */
export function ViewTabs<T extends string>({ items, label, onChange, value, end }: ViewTabsProps<T>) {
    const row = useRef<HTMLDivElement>(null);
    const { setViewport, className: fade } = useScrollFade({ axis: 'horizontal' });
    const attachRow = useCallback(
        (element: HTMLDivElement | null) => {
            row.current = element;
            setViewport(element);
        },
        [setViewport],
    );

    useRevealSelection(row, value);

    const tabs = (
        <div
            ref={attachRow}
            role="tablist"
            aria-label={label}
            className={`-mx-row-inset flex min-w-0 gap-1 overflow-x-auto py-1 ${fade}`}
            onKeyDown={(event) =>
                moveTabSelection(
                    event,
                    items.map((item) => item.value),
                    value,
                    onChange,
                )
            }
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
                        className={`focus-ring-inset px-row-inset flex h-8 shrink-0 items-center gap-2 rounded-lg text-sm font-medium transition-colors motion-reduce:transition-none ${
                            selected ? 'segment-chosen' : 'text-fg-muted hover:text-fg hover:bg-fill-hover'
                        }`}
                        onClick={() => onChange(item.value)}
                    >
                        {item.label}
                        {item.count !== undefined ? ' ' : null}
                        <Count count={item.count} loading={item.loading} />
                    </button>
                );
            })}
        </div>
    );

    return end ? (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">{tabs}</div>
            <div className="sm:w-64">{end}</div>
        </div>
    ) : (
        tabs
    );
}
