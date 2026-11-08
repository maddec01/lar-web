import type { ReactNode } from 'react';

import { BadgeBase as Badge } from '../display/Badge';

export interface RouteNode {
    icon: ReactNode;
    title: string;
    detail: string;
}

/** One connection from end to end, drawn as a line of travelling light through every node it passes, with
 *  what the connection is labelled once above it. */
export function RouteDiagram({
    nodes,
    label,
    caption,
}: {
    /** The stops the connection passes, from end to end. */
    nodes: readonly RouteNode[];
    /** Names the diagram for screen readers. */
    label: string;
    /** What the connection is, labelled above the line. */
    caption: ReactNode;
}) {
    return (
        <figure className="border-line bg-surface-glass relative isolate overflow-hidden rounded-3xl border px-6 py-8 sm:px-10 sm:py-12">
            <div
                aria-hidden="true"
                className="absolute inset-0 -z-10 bg-[radial-gradient(60%_70%_at_50%_40%,var(--lar-glow-soft),transparent_70%)]"
            />
            <div className="mb-8 flex sm:justify-center">
                <Badge tone="accent" size="md">
                    {label}
                </Badge>
            </div>
            <div className="relative">
                <span
                    aria-hidden="true"
                    className="lar-route-line absolute top-6 bottom-6 left-5.75 w-[1.5px] sm:top-8 sm:right-[calc(100%/6)] sm:bottom-auto sm:left-[calc(100%/6)] sm:h-[1.5px] sm:w-auto"
                />
                <ol className="relative flex flex-col gap-6 sm:grid sm:grid-cols-3 sm:gap-4">
                    {nodes.map((node) => (
                        <li key={node.title} className="flex items-center gap-4 sm:flex-col sm:gap-3 sm:text-center">
                            <span className="border-line bg-surface-page text-fg inline-flex size-12 shrink-0 items-center justify-center rounded-xl border shadow-(--shadow-showcase-tile) sm:size-16 sm:rounded-2xl [&>svg]:size-6 sm:[&>svg]:size-7">
                                {node.icon}
                            </span>
                            <span className="flex flex-col gap-0.5">
                                <span className="text-fg text-sm font-semibold">{node.title}</span>
                                <span className="text-fg-muted text-xs">{node.detail}</span>
                            </span>
                        </li>
                    ))}
                </ol>
            </div>
            <figcaption className="text-fg-muted mt-8 text-sm leading-6 text-pretty sm:mt-10 sm:text-center">
                {caption}
            </figcaption>
        </figure>
    );
}
