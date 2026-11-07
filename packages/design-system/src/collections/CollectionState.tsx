import type { ReactNode } from 'react';

import { Button } from '../actions/Button';
import { Stack } from '../layout/Flow';
import { Heading, Text } from '../typography/Typography';

const page = { layout: 'max-w-lg px-6 py-16', icon: '[&>svg]:size-8', space: 'group' } as const;
const variants = {
    page,
    /** A placeholder outlining the content that will fill the region. */
    framed: page,
    /** Fits inside a panel or popover instead of owning a page region. */
    compact: { layout: 'max-w-64 px-3 py-6', icon: '[&>svg]:size-6', space: 'related' },
    /** A quiet empty state with the same surface as dashboard content. */
    panel: { layout: 'max-w-md px-4 py-5', icon: '[&>svg]:size-6', space: 'related' },
    /** A first run's welcome in an app's empty main area: its `icon` (such as the brand mark) in its own colours over a
     *  section-sized title. */
    welcome: { layout: 'max-w-xl px-6 py-16', icon: '', space: 'group' },
} as const;

interface CollectionStateProps {
    /** The action in place of `actionLabel` and `onAction`, for a caller whose button has its own look or markers. */
    action?: ReactNode;
    actionLabel?: string;
    description: string;
    icon?: ReactNode;
    onAction?: () => void;
    title: string;
    variant?: keyof typeof variants;
}

export function CollectionState({
    action,
    actionLabel,
    description,
    icon,
    onAction,
    title,
    variant = 'page',
}: CollectionStateProps) {
    const compact = variant === 'compact' || variant === 'panel';
    const state = (
        <Stack
            align="center"
            space={variants[variant].space}
            className={`mx-auto text-center ${variants[variant].layout}`}
        >
            {icon ? (
                variant === 'welcome' ? (
                    icon
                ) : (
                    <span className={`text-base-500 ${variants[variant].icon}`}>{icon}</span>
                )
            ) : null}
            <Stack space="tight">
                {compact ? (
                    <Text variant="label">{title}</Text>
                ) : (
                    <Heading as="h2" variant={variant === 'welcome' ? 'section' : 'subsection'}>
                        {title}
                    </Heading>
                )}
                <Text variant={compact ? 'caption' : 'description'} tone="muted">
                    {description}
                </Text>
            </Stack>
            {action ??
                (actionLabel && onAction ? (
                    <Button type="button" onClick={onAction} variant="secondary">
                        {actionLabel}
                    </Button>
                ) : null)}
        </Stack>
    );

    return variant === 'framed' || variant === 'panel' ? (
        <div
            className={
                variant === 'panel'
                    ? 'border-base-300 bg-base-100 rounded-xl border'
                    : 'border-base-300 rounded-xl border border-dashed'
            }
        >
            {state}
        </div>
    ) : (
        state
    );
}
