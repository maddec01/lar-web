import type { ReactNode } from 'react';

import { SkeletonLoader } from '../feedback/SkeletonLoader';
import { StackBase } from '../layout/Flow';
import { TextBase } from '../typography/Typography';

interface ResourceCardProps {
    /** `row` is a dense ruled row in a long list, its status beside its name once there is room. */
    presentation?: 'default' | 'overview' | 'row';
    /** Figures in a row under the details, such as "Titles 1,204": each one's label and value. */
    metrics?: readonly { label: ReactNode; value: ReactNode }[];
    /** Names the figures for screen readers, such as "Library totals". */
    metricsLabel?: string;
    /** Buttons in the card's footer, such as Scan and Settings. */
    actions?: ReactNode;
    /** `sm` is tighter padding, for a card among many in a grid; `md` (the default) the full card. */
    size?: 'sm' | 'md';
    /** What it is: its name and a line of facts. */
    details: ReactNode;
    /** An icon or artwork before the details. */
    leading?: ReactNode;
    /** Content in an inset panel under the details, such as a scan's progress. */
    panel?: ReactNode;
    /** Its state, such as a status light and a word, at the top right. */
    status?: ReactNode;
    /** Content at the card's end, such as a menu of more actions. */
    trailing?: ReactNode;
}

/** A thing the server manages, such as a catalog or a device: what it is, its state, its figures and its actions. */
export function ResourceCard({
    actions,
    size = 'md',
    presentation = 'default',
    metrics,
    metricsLabel,
    details,
    leading,
    panel,
    status,
    trailing,
}: ResourceCardProps) {
    if (presentation === 'row')
        return (
            <article className="border-line @container border-b last:border-0">
                <div className="@pane:grid-cols-[minmax(5rem,7rem)_minmax(0,1fr)_auto] grid min-w-0 grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 gap-y-1 px-3 py-1">
                    <div className="@pane:pt-0 flex min-w-0 items-center gap-2 pt-1">
                        <span aria-hidden="true" className="text-fg-muted shrink-0 [&_svg]:size-4">
                            {leading}
                        </span>
                        <div className="min-w-0 flex-1">{details}</div>
                    </div>
                    {status ? (
                        <div className="@pane:col-start-2 @pane:row-start-1 col-span-full row-start-3 min-w-0 @md:col-span-1 @md:row-start-2">
                            {status}
                        </div>
                    ) : null}
                    <div className="@pane:col-start-3 col-span-full row-start-2 flex flex-wrap items-center gap-2 @md:col-span-1 @md:col-start-2 @md:row-span-2 @md:row-start-1">
                        {actions}
                    </div>
                </div>
            </article>
        );

    if (presentation === 'overview') {
        return (
            <article
                data-slot="resource-card-overview"
                className="group surface-card hover:border-primary-ring row-span-3 grid min-w-0 grid-rows-subgrid gap-y-0 overflow-hidden rounded-xl border transition-colors"
            >
                <div className="flex min-w-0 items-center gap-3 p-3 pb-2">
                    {leading ? (
                        <span
                            aria-hidden="true"
                            className="border-line bg-surface-sunken text-fg-muted flex size-9 shrink-0 items-center justify-center self-start rounded-lg border [&_svg]:size-4.5"
                        >
                            {leading}
                        </span>
                    ) : null}
                    <div className="min-h-10 min-w-0 flex-1 [&_a]:block [&_a]:truncate">{details}</div>
                    <div className="shrink-0 self-start [&>[data-slot=skeleton]]:size-8">{actions}</div>
                </div>
                <dl
                    aria-label={metricsLabel}
                    className="flex flex-1 flex-wrap content-start items-start gap-x-5 gap-y-1 px-3 pb-2"
                >
                    {metrics?.map((metric, index) => (
                        <div key={index} className="flex min-w-16 items-center gap-1.5">
                            <dt className="min-h-4 min-w-10">
                                <TextBase as="span" variant="caption" tone="muted" className="block">
                                    {metric.label}
                                </TextBase>
                            </dt>
                            <dd className="order-first min-h-8 min-w-6">
                                <TextBase as="span" variant="metric" className="block tabular-nums">
                                    {metric.value}
                                </TextBase>
                            </dd>
                        </div>
                    ))}
                </dl>
                {status ? (
                    <div className="border-line bg-surface-sunken flex min-h-8 min-w-0 items-center border-t px-3 py-1">
                        {status}
                    </div>
                ) : null}
            </article>
        );
    }

    if (size === 'sm') {
        return (
            <article className="@container">
                <div
                    className={`grid min-w-0 items-center gap-3 px-3 sm:px-4 ${trailing ? 'min-h-18 py-3' : 'min-h-12 py-2'} ${
                        trailing
                            ? leading
                                ? 'grid-cols-1 @xl:grid-cols-[auto_minmax(0,1fr)_auto]'
                                : 'grid-cols-1 @xl:grid-cols-[minmax(0,1fr)_auto]'
                            : leading
                              ? 'grid-cols-[auto_minmax(0,1fr)_auto]'
                              : 'grid-cols-[minmax(0,1fr)_auto]'
                    }`}
                >
                    {leading ? (
                        <span
                            aria-hidden="true"
                            className={`${trailing ? 'hidden @xl:flex' : 'flex'} text-fg-muted size-8 items-center justify-center [&_svg]:size-5 [&>[data-slot=skeleton]]:size-full`}
                        >
                            {leading}
                        </span>
                    ) : null}
                    {trailing ? (
                        <StackBase space="tight" className="min-w-0">
                            <div className="min-w-0 truncate">{details}</div>
                            {status ? <div className="flex min-w-0">{status}</div> : null}
                        </StackBase>
                    ) : (
                        <div className="@pane:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] grid min-w-0 items-center gap-x-4 gap-y-1">
                            <div className="min-w-0 [&_a]:max-w-full [&_a]:min-w-0 [&_a]:truncate">{details}</div>
                            {status ? <div className="@pane:justify-end flex min-w-0">{status}</div> : null}
                        </div>
                    )}
                    <div
                        className={`flex min-w-0 shrink-0 flex-wrap items-center gap-2 ${
                            trailing
                                ? 'border-line bg-surface-raised/40 col-span-full -mx-3 -mb-3 justify-between border-t px-3 py-2 sm:-mx-4 sm:px-4 @xl:col-span-1 @xl:m-0 @xl:justify-end @xl:border-0 @xl:bg-transparent @xl:p-0 [&>button]:min-h-10 @xl:[&>button]:min-h-8 [&>label]:min-h-10 @xl:[&>label]:min-h-8'
                                : ''
                        }`}
                    >
                        {actions}
                        {trailing}
                    </div>
                </div>
                {panel ? <div className="border-line bg-surface-raised/40 border-t p-4 sm:p-5">{panel}</div> : null}
            </article>
        );
    }

    // The status sits beside the details once the card is 36rem wide, in a column of at most half of it that never
    // reaches over them: a long status wraps or truncates in its column (its full words in a hover title), and below
    // that width it takes its own line under the details, from their text's start.
    return (
        <article className="surface-card @container overflow-hidden rounded-xl border transition-colors">
            <div className="grid min-w-0 grid-cols-[minmax(0,1fr)] gap-x-6 gap-y-3 p-4 sm:p-5 @xl:grid-cols-[minmax(0,1fr)_fit-content(50%)] @xl:items-start">
                <div className="flex min-w-0 items-start gap-3">
                    {leading ? (
                        <div
                            aria-hidden="true"
                            className="bg-surface-raised text-fg-muted flex size-9 shrink-0 items-center justify-center rounded-lg [&_svg]:size-5"
                        >
                            {leading}
                        </div>
                    ) : null}
                    <div className="min-w-0 flex-1 [&_a]:max-w-full">{details}</div>
                </div>
                {status ? (
                    <div
                        data-slot="resource-card-status"
                        className={`flex min-w-0 flex-col items-start gap-1 *:max-w-full *:min-w-0 @xl:items-end @xl:pl-0 @xl:text-right ${leading ? 'pl-12' : ''}`}
                    >
                        {status}
                    </div>
                ) : null}
            </div>
            {actions || trailing ? (
                <div className="border-line bg-surface-sunken flex flex-wrap items-center justify-between gap-x-3 gap-y-2 border-t px-3 py-2 sm:px-4">
                    <div className="-ml-1 flex min-w-0 flex-wrap items-center gap-1">{actions}</div>
                    {/* Keeps to the end when it wraps under the actions, as a switch does in every settings row. */}
                    <div className="ml-auto flex min-w-0 flex-wrap items-center justify-end gap-3">{trailing}</div>
                </div>
            ) : null}
            {panel ? <div className="border-line bg-surface-raised border-t">{panel}</div> : null}
        </article>
    );
}

export function ResourceCardSkeleton({ presentation = 'default' }: Pick<ResourceCardProps, 'presentation'>) {
    if (presentation === 'overview')
        return (
            <ResourceCard
                presentation="overview"
                details={
                    <StackBase space="tight">
                        <SkeletonLoader.Shape presentation="heading" width="wide" />
                        <SkeletonLoader.Shape width="short" />
                    </StackBase>
                }
                actions={<SkeletonLoader.Shape presentation="circle" />}
                metrics={[0, 1].map(() => ({
                    value: <SkeletonLoader.Shape presentation="metric" />,
                    label: <SkeletonLoader.Shape />,
                }))}
                status={<SkeletonLoader.Shape width="wide" />}
            />
        );

    return (
        <ResourceCard
            size="sm"
            actions={null}
            leading={<SkeletonLoader.Shape presentation="circle" />}
            details={<SkeletonLoader.Shape width="medium" />}
            status={<SkeletonLoader.Shape width="short" />}
            trailing={
                <div className="flex w-56 max-w-full items-center gap-3 py-1">
                    <SkeletonLoader.Shape presentation="control" width="medium" />
                    <SkeletonLoader.Shape presentation="control" width="medium" />
                </div>
            }
        />
    );
}
