import type { ReactNode } from 'react';

import { SkeletonLoader } from '../feedback/SkeletonLoader';
import { Stack } from '../layout/Flow';
import { Text } from '../typography/Typography';

interface ResourceCardProps {
    presentation?: 'default' | 'overview' | 'scan';
    metrics?: readonly { label: ReactNode; value: ReactNode }[];
    metricsLabel?: string;
    actions: ReactNode;
    compact?: boolean;
    details: ReactNode;
    leading?: ReactNode;
    panel?: ReactNode;
    status: ReactNode;
    trailing?: ReactNode;
}

export function ResourceCard({
    actions,
    compact = false,
    presentation = 'default',
    metrics,
    metricsLabel,
    details,
    leading,
    panel,
    status,
    trailing,
}: ResourceCardProps) {
    if (presentation === 'scan')
        return (
            <article className="border-base-300 @container border-b last:border-0">
                <div className="grid min-w-0 grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 gap-y-1 px-3 py-1 @min-[40rem]:grid-cols-[minmax(5rem,7rem)_minmax(0,1fr)_auto]">
                    <div className="flex min-w-0 items-center gap-2 pt-1 @min-[40rem]:pt-0">
                        <span aria-hidden="true" className="text-base-700 shrink-0 [&_svg]:size-4">
                            {leading}
                        </span>
                        <div className="min-w-0 flex-1">{details}</div>
                    </div>
                    <div className="col-span-full row-start-3 min-w-0 @min-[28rem]:col-span-1 @min-[28rem]:row-start-2 @min-[40rem]:col-start-2 @min-[40rem]:row-start-1">
                        {status}
                    </div>
                    <div className="col-span-full row-start-2 flex flex-wrap items-center gap-2 @min-[28rem]:col-span-1 @min-[28rem]:col-start-2 @min-[28rem]:row-span-2 @min-[28rem]:row-start-1 @min-[40rem]:col-start-3">
                        {actions}
                    </div>
                </div>
            </article>
        );

    if (presentation === 'overview') {
        return (
            <article className="group border-base-300 from-base-100/70 to-base-50 hover:border-primary/30 flex min-w-0 flex-col overflow-hidden rounded-xl border bg-linear-to-br shadow-xs/5 transition-colors">
                <div className="flex min-w-0 items-center gap-3 p-3 pb-2">
                    {leading ? (
                        <span
                            aria-hidden="true"
                            className="text-base-500 flex shrink-0 self-start pt-0.5 [&_svg]:size-5"
                        >
                            {leading}
                        </span>
                    ) : null}
                    <div className="min-h-10 min-w-0 flex-1 [&_a]:block [&_a]:truncate">{details}</div>
                    <div className="shrink-0 self-start [&>[data-slot=skeleton]]:size-8">{actions}</div>
                </div>
                <dl aria-label={metricsLabel} className="flex flex-1 flex-wrap gap-x-5 gap-y-1 px-3 pb-2">
                    {metrics?.map((metric, index) => (
                        <div key={index} className="flex min-w-16 items-center gap-1.5">
                            <dt className="min-h-4 min-w-10">
                                <Text as="span" variant="caption" tone="muted" className="block">
                                    {metric.label}
                                </Text>
                            </dt>
                            <dd className="order-first min-h-8 min-w-6">
                                <Text as="span" variant="metric" className="block tabular-nums">
                                    {metric.value}
                                </Text>
                            </dd>
                        </div>
                    ))}
                </dl>
                <div className="border-base-300 bg-base-100/40 flex min-h-8 min-w-0 items-center border-t px-3 py-1">
                    {status}
                </div>
            </article>
        );
    }

    if (compact) {
        return (
            <article className="@container">
                <div
                    className={`grid min-w-0 items-center gap-3 px-3 sm:px-4 ${trailing ? 'min-h-18 py-3' : 'min-h-12 py-2'} ${
                        trailing
                            ? leading
                                ? 'grid-cols-1 @min-[36rem]:grid-cols-[auto_minmax(0,1fr)_auto]'
                                : 'grid-cols-1 @min-[36rem]:grid-cols-[minmax(0,1fr)_auto]'
                            : leading
                              ? 'grid-cols-[auto_minmax(0,1fr)_auto]'
                              : 'grid-cols-[minmax(0,1fr)_auto]'
                    }`}
                >
                    {leading ? (
                        <span
                            aria-hidden="true"
                            className={`${trailing ? 'hidden @min-[36rem]:flex' : 'flex'} text-base-500 size-8 items-center justify-center [&_svg]:size-5 [&>[data-slot=skeleton]]:size-full`}
                        >
                            {leading}
                        </span>
                    ) : null}
                    {trailing ? (
                        <Stack space="tight" className="min-w-0">
                            <div className="min-w-0 truncate">{details}</div>
                            <div className="flex min-w-0">{status}</div>
                        </Stack>
                    ) : (
                        <div className="grid min-w-0 items-center gap-x-4 gap-y-1 @min-[40rem]:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
                            <div className="min-w-0 [&_a]:max-w-full [&_a]:min-w-0 [&_a]:truncate">{details}</div>
                            <div className="flex min-w-0 @min-[40rem]:justify-end">{status}</div>
                        </div>
                    )}
                    <div
                        className={`flex min-w-0 shrink-0 flex-wrap items-center gap-2 ${
                            trailing
                                ? 'border-base-300 bg-base-100/40 col-span-full -mx-3 -mb-3 justify-between border-t px-3 py-2 sm:-mx-4 sm:px-4 @min-[36rem]:col-span-1 @min-[36rem]:m-0 @min-[36rem]:justify-end @min-[36rem]:border-0 @min-[36rem]:bg-transparent @min-[36rem]:p-0 [&>button]:min-h-10 @min-[36rem]:[&>button]:min-h-8 [&>label]:min-h-10 @min-[36rem]:[&>label]:min-h-8'
                                : ''
                        }`}
                    >
                        {actions}
                        {trailing}
                    </div>
                </div>
                {panel ? <div className="border-base-300 bg-base-100/40 border-t p-4 sm:p-5">{panel}</div> : null}
            </article>
        );
    }

    return (
        <article className="border-base-300 bg-base-100 hover:border-base-300 overflow-hidden rounded-xl border shadow-xs/5 transition-colors">
            <div className="grid min-w-0 gap-4 p-4 sm:p-5 md:grid-cols-[minmax(0,1fr)_auto] md:items-start">
                <div className="flex min-w-0 items-start gap-3">
                    {leading ? (
                        <div
                            aria-hidden="true"
                            className="bg-base-100 text-base-600 flex size-9 shrink-0 items-center justify-center rounded-lg [&_svg]:size-5"
                        >
                            {leading}
                        </div>
                    ) : null}
                    <div className="min-w-0 flex-1">{details}</div>
                </div>
                <div className="flex min-h-11 min-w-0 flex-col items-start gap-1 md:max-w-72 md:items-end md:text-right">
                    {status}
                </div>
            </div>
            <div className="border-base-300 bg-base-100/60 flex flex-col gap-3 border-t px-3 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-4">
                <div className="-ml-1 flex min-w-0 flex-wrap items-center gap-1">{actions}</div>
                <div className="flex min-w-0 flex-wrap items-center gap-3 sm:justify-end">{trailing}</div>
            </div>
            {panel ? <div className="border-base-300 bg-base-100 border-t">{panel}</div> : null}
        </article>
    );
}

export function ResourceCardSkeleton({ presentation = 'default' }: Pick<ResourceCardProps, 'presentation'>) {
    if (presentation === 'overview')
        return (
            <ResourceCard
                presentation="overview"
                details={
                    <Stack space="tight">
                        <SkeletonLoader.Shape presentation="heading" width="wide" />
                        <SkeletonLoader.Shape width="short" />
                    </Stack>
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
            compact
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
