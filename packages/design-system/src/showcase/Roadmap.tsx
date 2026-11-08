import { type CSSProperties, type ReactNode, useId } from 'react';

import { Heading, Text } from '../typography/Typography';
import { ReadinessStatus } from './Status';

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
    title,
    lead,
}: {
    /** What is planned, the first featured. */
    items: readonly RoadmapItem[];
    /** Names the list for screen readers. */
    label: string;
    /** The status every item carries, such as "Planned". */
    statusLabel: string;
    /** A heading above the list, when the roadmap closes a section that has its own SectionHeading. */
    title?: string;
    /** A sentence under the title. */
    lead?: string;
}) {
    const titleId = useId();
    const featured = items.filter((item) => item.featured);
    const rest = items.filter((item) => !item.featured);

    return (
        <div
            role="group"
            {...(title ? { 'aria-labelledby': titleId } : { 'aria-label': label })}
            className="flex flex-col gap-3"
        >
            {title ? (
                <header className="mb-3 flex flex-col gap-1.5 sm:mb-5">
                    <Heading id={titleId} as="h3" variant="feature">
                        {title}
                    </Heading>
                    {lead ? (
                        <Text variant="prose" tone="muted">
                            {lead}
                        </Text>
                    ) : null}
                </header>
            ) : null}
            {featured.map((item) => (
                <FeaturedCard key={item.title} item={item} statusLabel={statusLabel} />
            ))}
            <ul className="divide-line/70 border-line-control bg-surface-glass grid divide-y rounded-2xl border border-dashed sm:gap-3 sm:divide-y-0 sm:rounded-none sm:border-0 sm:bg-transparent md:grid-cols-2 lg:grid-cols-3">
                {rest.map((item) => (
                    <li
                        key={item.title}
                        className="sm:border-line-control flex gap-3 p-4 sm:gap-4 sm:rounded-2xl sm:border sm:border-dashed sm:p-5"
                    >
                        <RoadmapIcon>{item.icon}</RoadmapIcon>
                        <div className="flex min-w-0 flex-1 flex-col gap-1">
                            <span className="flex items-start justify-between gap-3">
                                <span className="text-fg text-md tracking-heading font-semibold text-balance">
                                    {item.title}
                                </span>
                                <span className="shrink-0">
                                    <ReadinessStatus status="planned">{statusLabel}</ReadinessStatus>
                                </span>
                            </span>
                            <span className="text-fg-muted text-sm leading-6">{item.body}</span>
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
                    <ReadinessStatus status="planned">{statusLabel}</ReadinessStatus>
                </span>
            </span>
            <div className="flex min-w-0 flex-1 flex-col gap-2">
                <span className="flex items-start justify-between gap-3">
                    <span className="text-fg tracking-heading text-lg font-semibold text-balance sm:text-xl">
                        {item.title}
                    </span>
                    <span className="hidden shrink-0 sm:block">
                        <ReadinessStatus status="planned">{statusLabel}</ReadinessStatus>
                    </span>
                </span>
                <span className="text-fg-muted text-md max-w-155 leading-6">{item.body}</span>
                {item.featured?.steps ? (
                    <ol className="text-fg-soft mt-2 flex flex-col gap-2.5 text-sm">
                        {item.featured.steps.map((step, index) => (
                            <li key={step} className="flex items-center gap-2">
                                <span className="bg-fill-muted text-fg-soft text-2xs inline-flex size-5 shrink-0 items-center justify-center rounded-full font-semibold tabular-nums">
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
            {item.featured?.visual ? <div className="shrink-0 sm:w-75 lg:w-85">{item.featured.visual}</div> : null}
        </article>
    );
}

function RoadmapIcon({ children }: { children: ReactNode }) {
    return (
        <span className="bg-fill-muted text-fg-soft ring-line/70 inline-flex size-8 shrink-0 items-center justify-center rounded-lg ring-1 ring-inset sm:size-10 sm:rounded-lg [&>svg]:size-4 sm:[&>svg]:size-5">
            {children}
        </span>
    );
}
