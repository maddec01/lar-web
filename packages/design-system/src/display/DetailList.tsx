import { Box } from '@ninna-ui/layout';
import { Code } from '@ninna-ui/primitives';
import type { ReactNode } from 'react';

import { Stack } from '../layout/Flow';
import { softBreaks } from '../typography/SoftBreaks';
import { Text, TextBase } from '../typography/Typography';

interface DetailListItem {
    /** Controls after the value, such as a Copy button. */
    actions?: ReactNode;
    /** The item's key in the list; its label by default. */
    key?: string;
    /** What the value is, such as "Address". */
    label: string;
    /** The value, in code type, such as an address or a path. */
    value: string;
}

interface DetailListProps {
    /** `inline` is without its title and frame, to sit inside a card or a popover; `framed` (the default) stands on
     *  its own under its title. */
    variant?: 'framed' | 'inline';
    /** Show complete addresses and paths, wrapping inside the available column. */
    wrapValues?: boolean;
    /** The label/value pairs, in order. */
    items: readonly DetailListItem[];
    /** The list's heading, such as "Connection details"; hidden when `inline`. */
    title: string;
}

/** Technical label/value pairs, such as addresses and paths, in code type. */
export function DetailList({ variant = 'framed', wrapValues = false, items, title }: DetailListProps) {
    const inline = variant === 'inline';

    return (
        <Box className={inline ? 'min-w-0' : 'border-line mt-1 border-t px-2 pt-3 pb-1'}>
            {!inline ? (
                <Text as="span" variant="label" tone="muted">
                    {title}
                </Text>
            ) : null}
            <Stack
                as="dl"
                aria-label={title}
                space={inline ? 'none' : 'related'}
                className={inline ? 'min-w-0' : 'mt-2'}
            >
                {items.map((item) => (
                    <div
                        key={item.key ?? item.label}
                        className={
                            inline
                                ? 'grid min-w-0 grid-cols-[minmax(0,5rem)_minmax(0,1fr)] items-center gap-2'
                                : 'flex min-w-0 items-center justify-between gap-3'
                        }
                    >
                        <dt className={inline ? 'min-w-0' : 'shrink-0'}>
                            <TextBase
                                as="span"
                                className={inline ? `block ${wrapValues ? 'break-words' : ''}` : undefined}
                                variant="caption"
                                tone="muted"
                                truncate={inline && !wrapValues}
                                title={item.label}
                            >
                                {item.label}
                            </TextBase>
                        </dt>
                        <dd className="min-w-0">
                            <div className="flex min-w-0 items-center gap-1">
                                <Code
                                    title={item.value}
                                    className={`block max-w-full min-w-0 flex-1 px-1.5 py-0.5 text-xs ${wrapValues ? 'wrap-anywhere whitespace-normal' : 'truncate'}`}
                                >
                                    {wrapValues ? softBreaks(item.value) : item.value}
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
