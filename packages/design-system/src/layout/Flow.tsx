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

/** What a caller of a flow chooses: the space by relationship and the alignment, never a class or a style. */
type Unstyled<Props> = Omit<Props, 'className' | 'style' | 'color'>;

interface StackOwnProps {
    /** The space between its children, by how they relate: `none`, `tight`, `related`, `group` (the default),
     *  `section` or `page`. */
    space?: FlowSpace;
    /** Where the children sit across the stack, such as `start` or `center`; they stretch by default. */
    align?: NinnaStackProps['align'];
    /** Where the children sit along the stack, such as `between`. */
    justify?: NinnaStackProps['justify'];
}

/** The stack for the design system's own compositions, which may fit it to their layout with a class. */
type StackBaseProps<C extends ElementType = 'div'> = Omit<NinnaStackProps<C>, 'gap' | 'direction'> & StackOwnProps;

export type StackProps<C extends ElementType = 'div'> = Unstyled<StackBaseProps<C>> & StackOwnProps;

export function StackBase<C extends ElementType = 'div'>({ space = 'group', ...props }: StackBaseProps<C>) {
    return <NinnaStack {...(props as NinnaStackProps<C>)} gap={spacing[space]} />;
}

/** Children one above the other, spaced by how they relate. */
export function Stack<C extends ElementType = 'div'>(props: StackProps<C>) {
    return <StackBase {...(props as StackBaseProps<C>)} />;
}

interface InlineOwnProps {
    /** The space between its children, by how they relate: `none`, `tight`, `related` (the default), `group`,
     *  `section` or `page`. */
    space?: FlowSpace;
    /** Lets the children wrap onto more lines rather than overflow. */
    wrap?: boolean;
    /** Where the children sit across the row, such as `center` or `baseline`. */
    align?: FlexProps['align'];
    /** Where the children sit along the row, such as `between` or `end`. */
    justify?: FlexProps['justify'];
}

type InlineBaseProps<C extends ElementType> = Omit<FlexProps<C>, 'gap' | 'direction' | 'wrap'> & InlineOwnProps;

type InlineProps<C extends ElementType> = Unstyled<InlineBaseProps<C>> & InlineOwnProps;

/** The row for the design system's own compositions, which may fit it to their layout with a class. */
export function InlineBase<C extends ElementType = 'div'>({ space = 'related', wrap, ...props }: InlineBaseProps<C>) {
    return <NinnaFlex {...(props as FlexProps<C>)} gap={spacing[space]} wrap={wrap ? 'wrap' : 'nowrap'} />;
}

/** Children side by side, spaced by how they relate. */
export function Inline<C extends ElementType = 'div'>(props: InlineProps<C>) {
    return <InlineBase {...(props as InlineBaseProps<C>)} />;
}

interface GridOwnProps {
    /** The grid's columns by what it holds: `metrics` tiles, `content` cards (the default), an `overview`'s cards,
     *  `details` in two columns from md, `pairs` from lg, or `posters`. */
    variant?: 'metrics' | 'content' | 'overview' | 'details' | 'pairs' | 'posters';
}

type GridBaseProps = Omit<ComponentProps<typeof NinnaGrid>, 'gap' | 'minChildWidth' | 'columns'> & GridOwnProps;

type GridProps = Unstyled<GridBaseProps> & GridOwnProps;

/** The grid for the design system's own compositions, which may fit it to their layout with a class. */
export function GridBase({ variant = 'content', ...props }: GridBaseProps) {
    if (variant === 'posters')
        return (
            <NinnaGrid
                {...props}
                gap="4"
                // The width of a catalog's poster cards (VirtualGrid), so a person's titles match the catalog's.
                style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(min(9.5rem, 100%), 1fr))' }}
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

/** Cards, tiles or posters in columns that fit the width. */
export function Grid(props: GridProps) {
    return <GridBase {...props} />;
}
