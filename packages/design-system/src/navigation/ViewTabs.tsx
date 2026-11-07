import type { ReactNode } from 'react';

import { Text } from '../typography/Typography';
import { moveTabSelection } from './TabKeys';

export interface ViewTabsItem<T extends string> {
    value: T;
    label: string;
    /** Already formatted for the viewer's locale. */
    count?: string;
}

interface ViewTabsProps<T extends string> {
    items: readonly ViewTabsItem<T>[];
    label: string;
    onChange: (value: T) => void;
    value: T;
    /** A control that acts on the same list, such as its search, beside the tabs on wide screens. */
    end?: ReactNode;
}

/** A row of tabs that switches which list the page shows, each with its count. */
export function ViewTabs<T extends string>({ items, label, onChange, value, end }: ViewTabsProps<T>) {
    const tabs = (
        <div
            role="tablist"
            aria-label={label}
            className="border-base-300 flex min-w-0 gap-1 overflow-x-auto border-b"
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
                        className={`focus-visible:outline-primary -mb-px flex shrink-0 items-center gap-2 border-b-2 px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-[-2px] ${
                            selected
                                ? 'border-base-content text-base-content'
                                : 'text-base-700 hover:text-base-content border-transparent'
                        }`}
                        onClick={() => onChange(item.value)}
                    >
                        {item.label}
                        {item.count !== undefined ? ' ' : null}
                        {item.count !== undefined ? (
                            <Text
                                as="span"
                                variant="caption"
                                className={`rounded-full px-1.5 tabular-nums ${
                                    selected
                                        ? 'bg-base-content/10 text-base-content'
                                        : 'bg-base-200 text-base-700 dark:bg-base-300'
                                }`}
                            >
                                {item.count}
                            </Text>
                        ) : null}
                    </button>
                );
            })}
        </div>
    );

    return end ? (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div className="min-w-0">{tabs}</div>
            <div className="sm:w-64 sm:pb-1">{end}</div>
        </div>
    ) : (
        tabs
    );
}
