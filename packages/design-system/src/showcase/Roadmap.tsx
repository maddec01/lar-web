import type { CSSProperties, ReactNode } from 'react';

import { StatusPill } from './Status';

export interface RoadmapItem {
    icon: ReactNode;
    title: string;
    body: string;
    /** The next big thing: a card of its own above the list, in an app's hue, with its highlights and an
     *  illustration of the idea. */
    featured?: { hue: number; highlights: readonly string[]; visual?: ReactNode; steps?: readonly string[] };
}

/** What is planned: a featured card for the next big thing, then quiet dashed cards that read like promises. */
export function Roadmap({
    items,
    label,
    statusLabel,
}: {
    items: readonly RoadmapItem[];
    label: string;
    statusLabel: string;
}) {
    const featured = items.filter((item) => item.featured);
    const rest = items.filter((item) => !item.featured);

    return (
        <div aria-label={label} role="group" className="flex flex-col gap-3">
            {featured.map((item) => (
                <FeaturedCard key={item.title} item={item} statusLabel={statusLabel} />
            ))}
            <ul className="divide-base-300/70 border-base-400/80 bg-base-100/50 dark:bg-base-100/30 grid divide-y rounded-2xl border border-dashed sm:gap-3 sm:divide-y-0 sm:rounded-none sm:border-0 sm:bg-transparent md:grid-cols-2 lg:grid-cols-3 sm:dark:bg-transparent">
                {rest.map((item) => (
                    <li
                        key={item.title}
                        className="sm:border-base-400/80 flex gap-3 p-4 sm:gap-4 sm:rounded-2xl sm:border sm:border-dashed sm:p-5"
                    >
                        <RoadmapIcon>{item.icon}</RoadmapIcon>
                        <div className="flex min-w-0 flex-1 flex-col gap-1">
                            <span className="flex items-start justify-between gap-3">
                                <span className="text-base-content text-[15px] font-semibold tracking-[-0.01em] text-balance">
                                    {item.title}
                                </span>
                                <span className="shrink-0">
                                    <StatusPill status="planned">{statusLabel}</StatusPill>
                                </span>
                            </span>
                            <span className="text-base-700 text-sm leading-6">{item.body}</span>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}

function FeaturedCard({ item, statusLabel }: { item: RoadmapItem; statusLabel: string }) {
    return (
        <article
            style={{ '--lar-kind-hue': item.featured?.hue } as CSSProperties}
            className="flex flex-col gap-4 rounded-2xl border border-[oklch(0.62_0.1_var(--lar-kind-hue)/0.45)] bg-[radial-gradient(60%_120%_at_85%_50%,oklch(0.62_0.12_var(--lar-kind-hue)/0.14),transparent_70%)] p-5 sm:flex-row sm:p-7"
        >
            <span className="flex items-center justify-between gap-3 sm:block">
                <RoadmapIcon>{item.icon}</RoadmapIcon>
                <span className="sm:hidden">
                    <StatusPill status="planned">{statusLabel}</StatusPill>
                </span>
            </span>
            <div className="flex min-w-0 flex-1 flex-col gap-2">
                <span className="flex items-start justify-between gap-3">
                    <span className="text-base-content text-lg font-semibold tracking-[-0.01em] text-balance sm:text-xl">
                        {item.title}
                    </span>
                    <span className="hidden shrink-0 sm:block">
                        <StatusPill status="planned">{statusLabel}</StatusPill>
                    </span>
                </span>
                <span className="text-base-700 max-w-[620px] text-[15px] leading-6">{item.body}</span>
                {item.featured?.steps ? (
                    <ol className="text-base-800 mt-2 flex flex-col gap-2.5 text-sm">
                        {item.featured.steps.map((step, index) => (
                            <li key={step} className="flex items-center gap-2">
                                <span className="bg-base-200 text-base-800 dark:bg-base-300 inline-flex size-5 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold tabular-nums">
                                    {index + 1}
                                </span>
                                {step}
                            </li>
                        ))}
                    </ol>
                ) : null}
                <span className="mt-2 hidden flex-wrap gap-2 sm:flex">
                    {item.featured?.highlights.map((highlight) => (
                        <span
                            key={highlight}
                            className="kind-badge inline-flex h-7 items-center rounded-full px-3 text-xs font-medium"
                        >
                            {highlight}
                        </span>
                    ))}
                </span>
            </div>
            {item.featured?.visual ? (
                <div className="shrink-0 sm:w-[300px] lg:w-[340px]">{item.featured.visual}</div>
            ) : null}
        </article>
    );
}

function RoadmapIcon({ children }: { children: ReactNode }) {
    return (
        <span className="bg-base-200 text-base-800 ring-base-300/70 dark:bg-base-300/40 inline-flex size-8 shrink-0 items-center justify-center rounded-[0.6rem] ring-1 ring-inset sm:size-10 sm:rounded-[0.7rem] [&>svg]:size-4 sm:[&>svg]:size-5">
            {children}
        </span>
    );
}
