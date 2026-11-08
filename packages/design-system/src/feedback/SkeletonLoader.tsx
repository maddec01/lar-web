/* oxlint-disable react/only-export-components -- Compound members are exported through SkeletonLoader. */

import { Fragment, type ReactNode } from 'react';

type SkeletonPresentation =
    | 'artwork'
    | 'poster'
    | 'video'
    | 'card'
    | 'chart'
    | 'circle'
    | 'control'
    | 'heading'
    | 'line'
    | 'metric';
type SkeletonWidth = 'action' | 'full' | 'medium' | 'short' | 'wide';

const presentationClasses: Record<SkeletonPresentation, string> = {
    artwork: 'aspect-square',
    poster: 'aspect-[2/3]',
    video: 'aspect-video',
    card: 'h-32',
    chart: 'h-36',
    circle: 'size-9',
    control: 'h-10',
    heading: 'h-[1cap]',
    line: 'h-3.5',
    metric: 'h-8',
};

const presentationRadius = {
    artwork: 'rounded-lg',
    poster: 'rounded-lg',
    video: 'rounded-lg',
    card: 'rounded-xl',
    chart: 'rounded-md',
    circle: 'rounded-full',
    control: 'rounded-md',
    heading: 'rounded-md',
    line: 'rounded-full',
    metric: 'rounded-md',
} as const;

const widthClasses: Record<SkeletonWidth, string> = {
    action: 'w-20',
    full: 'w-full',
    medium: 'w-1/2',
    short: 'w-1/3',
    wide: 'w-3/4',
};

interface SkeletonLoaderProps {
    /** The skeleton (shapes in the layout of what loads), or what loaded once `loading` is false. */
    children: ReactNode;
    /** Names what is loading for screen readers. */
    label: string;
    /** Shows the skeleton (the default); false shows `children` as they are. */
    loading?: boolean;
}

function SkeletonLoaderRoot({ children, label, loading = true }: SkeletonLoaderProps) {
    if (!loading) return <Fragment>{children}</Fragment>;

    return (
        <div role="status" aria-busy="true" aria-label={label}>
            <div aria-hidden="true" inert>
                {children}
            </div>
        </div>
    );
}

interface SkeletonShapeProps {
    /** The shape: a `line` of text (the default), a heading, a control, a card, a circle and the like. */
    presentation?: SkeletonPresentation;
    /** The shape's width, from `full` down to `short`; a circle keeps its own. */
    width?: SkeletonWidth;
}

function SkeletonShape({ presentation = 'line', width = 'full' }: SkeletonShapeProps) {
    const classes = [presentationClasses[presentation], presentation === 'circle' ? null : widthClasses[width]]
        .filter(Boolean)
        .join(' ');

    return (
        <span
            aria-hidden="true"
            role="presentation"
            data-slot="skeleton"
            className={`lar-skeleton block ${classes} ${presentationRadius[presentation]}`}
        />
    );
}

export const SkeletonLoader = Object.assign(SkeletonLoaderRoot, { Shape: SkeletonShape });
