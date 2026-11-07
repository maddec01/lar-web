import { Box } from '@ninna-ui/layout';
import { Code } from '@ninna-ui/primitives';
import type { ReactNode } from 'react';

import { Stack } from '../layout/Flow';
import { Text } from '../typography/Typography';

interface DetailListItem {
    actions?: ReactNode;
    key?: string;
    label: string;
    value: string;
}

interface DetailListProps {
    compact?: boolean;
    items: readonly DetailListItem[];
    title: string;
}

export function DetailList({ compact = false, items, title }: DetailListProps) {
    return (
        <Box className={compact ? 'min-w-0' : 'border-base-300 mt-1 border-t px-2 pt-3 pb-1'}>
            {!compact ? (
                <Text as="span" variant="overline" tone="muted">
                    {title}
                </Text>
            ) : null}
            <Stack
                as="dl"
                aria-label={title}
                space={compact ? 'none' : 'related'}
                className={compact ? 'min-w-0' : 'mt-2'}
            >
                {items.map((item) => (
                    <div
                        key={item.key ?? item.label}
                        className={
                            compact
                                ? 'grid min-w-0 grid-cols-[minmax(0,5rem)_minmax(0,1fr)] items-center gap-2'
                                : 'flex min-w-0 items-center justify-between gap-3'
                        }
                    >
                        <dt className={compact ? 'min-w-0' : 'shrink-0'}>
                            <Text
                                as="span"
                                className={compact ? 'block' : undefined}
                                variant="caption"
                                tone="muted"
                                truncate={compact}
                                title={item.label}
                            >
                                {item.label}
                            </Text>
                        </dt>
                        <dd className="min-w-0">
                            <div className="flex min-w-0 items-center gap-1">
                                <Code
                                    title={item.value}
                                    className="block max-w-full min-w-0 flex-1 truncate px-1.5 py-0.5 text-xs"
                                >
                                    {item.value}
                                </Code>
                                {item.actions ? (
                                    <span className="flex shrink-0 items-center">{item.actions}</span>
                                ) : null}
                            </div>
                        </dd>
                    </div>
                ))}
            </Stack>
        </Box>
    );
}
