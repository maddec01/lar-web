import type { ReactNode } from 'react';

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
    nodes: readonly RouteNode[];
    label: string;
    caption: ReactNode;
}) {
    return (
        <figure className="border-base-300 bg-base-100/70 dark:bg-base-100/50 relative isolate overflow-hidden rounded-[1.5rem] border px-6 py-8 sm:px-10 sm:py-12">
            <div
                aria-hidden="true"
                className="absolute inset-0 -z-10 bg-[radial-gradient(60%_70%_at_50%_40%,var(--lar-glow-soft),transparent_70%)]"
            />
            <div className="mb-8 flex sm:justify-center">
                <span className="border-primary/30 bg-primary/8 text-primary dark:bg-primary/16 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium dark:text-[color-mix(in_srgb,var(--color-primary)_45%,white)]">
                    <span aria-hidden="true" className="size-1.5 rounded-full bg-current" />
                    {label}
                </span>
            </div>
            <div className="relative">
                <span
                    aria-hidden="true"
                    className="lar-route-line absolute top-6 bottom-6 left-[23px] w-[1.5px] sm:top-8 sm:right-[calc(100%/6)] sm:bottom-auto sm:left-[calc(100%/6)] sm:h-[1.5px] sm:w-auto"
                />
                <ol className="relative flex flex-col gap-6 sm:grid sm:grid-cols-3 sm:gap-4">
                    {nodes.map((node) => (
                        <li key={node.title} className="flex items-center gap-4 sm:flex-col sm:gap-3 sm:text-center">
                            <span className="border-base-300 bg-base-50 text-base-content inline-flex size-12 shrink-0 items-center justify-center rounded-[0.9rem] border shadow-[0_14px_30px_-16px_rgb(0_0_0/50%)] sm:size-16 sm:rounded-[1.1rem] [&>svg]:size-6 sm:[&>svg]:size-7">
                                {node.icon}
                            </span>
                            <span className="flex flex-col gap-0.5">
                                <span className="text-base-content text-sm font-semibold">{node.title}</span>
                                <span className="text-base-700 text-xs">{node.detail}</span>
                            </span>
                        </li>
                    ))}
                </ol>
            </div>
            <figcaption className="text-base-700 mt-8 text-sm leading-6 text-pretty sm:mt-10 sm:text-center">
                {caption}
            </figcaption>
        </figure>
    );
}
