import type { ReactNode } from 'react';

import { Text } from '../typography/Typography';

export interface PairingListItem {
    key: string;
    /** Short ordinal such as `1` or `2-05`. */
    position: string;
    title: string;
    /** A secondary fact aligned in its own column, such as a duration. */
    detail?: string;
    /** One line under the title; `warning` draws attention to a doubt. */
    note?: string;
    noteTone?: 'muted' | 'warning';
    control: ReactNode;
}

/** Rows that pair a numbered item with a chosen counterpart, such as release tracks and files. */
export function PairingList({ items, label }: { items: readonly PairingListItem[]; label: string }) {
    return (
        <ul aria-label={label} className="divide-base-300 border-base-300 bg-base-100 divide-y rounded-lg border">
            {items.map((item) => (
                <li
                    key={item.key}
                    className="grid min-w-0 grid-cols-[2.5rem_minmax(0,1fr)_auto] items-center gap-x-3 gap-y-2 px-3 py-2.5 sm:grid-cols-[2.5rem_minmax(0,1fr)_3.5rem_minmax(0,20rem)] sm:px-4"
                >
                    <Text as="span" tone="muted" className="tabular-nums">
                        {item.position}
                    </Text>
                    <span className="min-w-0">
                        <Text as="span" className="block" truncate title={item.title} variant="label">
                            {item.title}
                        </Text>
                        {item.note ? (
                            <Text
                                as="span"
                                className="block"
                                truncate
                                title={item.note}
                                variant="caption"
                                tone={item.noteTone === 'warning' ? 'warning' : 'muted'}
                            >
                                {item.note}
                            </Text>
                        ) : null}
                    </span>
                    <Text as="span" tone="muted" className="text-right tabular-nums">
                        {item.detail ?? ''}
                    </Text>
                    <span className="col-span-3 min-w-0 sm:col-span-1">{item.control}</span>
                </li>
            ))}
        </ul>
    );
}
