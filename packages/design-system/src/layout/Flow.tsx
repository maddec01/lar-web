import {
    Flex as NinnaFlex,
    type FlexProps,
    Grid as NinnaResponsiveGrid,
    SimpleGrid as NinnaGrid,
    Stack as NinnaStack,
    type StackProps as NinnaStackProps,
} from '@ninna-ui/layout';
import type { ComponentProps, ElementType } from 'react';

const spacing = { none: '0', tight: '1', related: '2', group: '3', section: '4', page: '6' } as const;

export type FlowSpace = keyof typeof spacing;

export type StackProps<C extends ElementType = 'div'> = Omit<NinnaStackProps<C>, 'gap' | 'direction'> & {
    space?: FlowSpace;
};

export function Stack<C extends ElementType = 'div'>({ space = 'group', ...props }: StackProps<C>) {
    return <NinnaStack {...(props as NinnaStackProps<C>)} gap={spacing[space]} />;
}

type InlineProps<C extends ElementType> = Omit<FlexProps<C>, 'gap' | 'direction' | 'wrap'> & {
    space?: FlowSpace;
    wrap?: boolean;
};

export function Inline<C extends ElementType = 'div'>({ space = 'related', wrap, ...props }: InlineProps<C>) {
    return <NinnaFlex {...(props as FlexProps<C>)} gap={spacing[space]} wrap={wrap ? 'wrap' : 'nowrap'} />;
}

type GridProps = Omit<ComponentProps<typeof NinnaGrid>, 'gap' | 'minChildWidth' | 'columns'> & {
    variant?: 'metrics' | 'content' | 'overview' | 'details' | 'pairs' | 'posters';
};

export function Grid({ variant = 'content', ...props }: GridProps) {
    if (variant === 'posters')
        return (
            <NinnaGrid
                {...props}
                gap="4"
                style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(min(6.5rem, 100%), 1fr))' }}
            />
        );

    if (variant === 'details') return <NinnaResponsiveGrid {...props} gap="6" columns={{ base: 1, md: 2 }} />;

    if (variant === 'pairs') return <NinnaResponsiveGrid {...props} gap="3" columns={{ base: 1, lg: 2 }} />;

    if (variant === 'overview')
        return <NinnaResponsiveGrid {...props} gap="3" columns={{ base: 1, md: 2, lg: 3, '2xl': 4 }} />;

    return (
        <NinnaGrid {...props} gap="3" minChildWidth={variant === 'metrics' ? 'min(11rem, 100%)' : 'min(16rem, 100%)'} />
    );
}
