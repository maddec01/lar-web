import type { ReactNode } from 'react';

import { Button } from '../actions/Button';
import { SkeletonLoader } from '../feedback/SkeletonLoader';
import { Popover } from '../overlays/Popover';
import { Heading, Text } from '../typography/Typography';
import { Badge } from './Badge';
import { TextPreview } from './TextPreview';

type DetailHeroProps =
    | { loading: true; loadingLabel: string; summary?: boolean; description?: boolean; details?: number }
    | {
          loading?: false;
          actions?: ReactNode;
          artwork: ReactNode;
          backgroundSrc?: string;
          children: ReactNode;
          label: string;
          subtitle?: ReactNode;
          summary?: ReactNode;
          title: string;
          titleLevel?: 'h1' | 'h2';
          titleLogoSrc?: string;
      };

export function DetailHero(props: DetailHeroProps) {
    const loading = props.loading === true;
    const background = !props.loading && props.backgroundSrc;

    return (
        <SkeletonLoader loading={loading} label={props.loading ? props.loadingLabel : ''}>
            <section className="relative isolate min-w-0 pb-4">
                {background ? (
                    <div
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-x-0 -top-2 bottom-0 -z-10 overflow-hidden rounded-2xl [mask-image:linear-gradient(to_bottom,black_55%,transparent)]"
                    >
                        <img src={background} alt="" className="size-full object-cover opacity-35" />
                        <div className="from-base-50 via-base-50/60 to-base-50/20 absolute inset-0 bg-linear-to-t" />
                    </div>
                ) : null}
                <div
                    className={`grid gap-6 sm:grid-cols-[10rem_minmax(0,1fr)] sm:items-center md:grid-cols-[14rem_minmax(0,1fr)] md:gap-8 ${background ? 'p-4 sm:p-5' : ''}`}
                >
                    <div className="ring-base-900/10 w-40 self-start overflow-hidden rounded-lg shadow-md ring-1 md:w-full">
                        {props.loading ? <SkeletonLoader.Shape presentation="artwork" /> : props.artwork}
                    </div>
                    <div className="flex min-w-0 flex-col gap-5 md:gap-6">
                        <div className="min-w-0">
                            <Text
                                variant="overline"
                                tone="muted"
                                className={`mb-2 ${loading ? 'max-w-32' : ''}`}
                                loading={loading}
                            >
                                {!props.loading && props.label}
                            </Text>
                            <div className="flex min-h-8 min-w-0 flex-wrap items-center gap-5">
                                <Heading
                                    as={props.loading ? 'h2' : (props.titleLevel ?? 'h2')}
                                    variant="hero"
                                    className={`min-w-0 wrap-break-word ${loading ? 'w-3/4 max-w-xl' : ''}`}
                                    loading={loading}
                                >
                                    {!props.loading &&
                                        (props.titleLogoSrc ? (
                                            <img
                                                src={props.titleLogoSrc}
                                                alt={props.title}
                                                className="max-h-28 w-auto max-w-full object-contain object-left sm:max-w-sm"
                                            />
                                        ) : (
                                            props.title
                                        ))}
                                </Heading>
                                {!props.loading && props.actions ? (
                                    <div className="flex max-w-full shrink-0 flex-wrap items-center gap-3">
                                        {props.actions}
                                    </div>
                                ) : null}
                            </div>
                            {props.loading || props.subtitle ? (
                                <Text
                                    variant="description"
                                    tone="muted"
                                    className={`mt-2 wrap-break-word ${loading ? 'max-w-sm' : ''}`}
                                    loading={loading}
                                >
                                    {!props.loading && props.subtitle}
                                </Text>
                            ) : null}
                        </div>
                        {props.summary ? (
                            <Text tone="muted" className="max-w-xl" loading={loading}>
                                {!props.loading && props.summary}
                            </Text>
                        ) : null}
                        {props.loading ? (
                            <>
                                <DetailHeroDetails>
                                    {Array.from({ length: props.details ?? 3 }, (_, index) => (
                                        <DetailHeroDetail key={index} loading />
                                    ))}
                                </DetailHeroDetails>
                                {props.description ? <TextPreview loading /> : null}
                            </>
                        ) : (
                            props.children
                        )}
                    </div>
                </div>
            </section>
        </SkeletonLoader>
    );
}

export function DetailHeroDetails({ children }: { children: ReactNode }) {
    return <dl className="grid grid-cols-2 gap-x-8 gap-y-4 sm:flex sm:flex-wrap">{children}</dl>;
}

type DetailProps = { loading: true } | { loading?: false; label: string; value: ReactNode };

export function DetailHeroDetail(props: DetailProps) {
    return (
        <div className={props.loading ? 'w-24' : 'max-w-full min-w-0'}>
            <dt>
                <Text as="span" variant="caption" tone="muted" loading={props.loading}>
                    {!props.loading && props.label}
                </Text>
            </dt>
            <dd className="mt-1 min-h-6 wrap-break-word">
                <Text as="div" variant="label" loading={props.loading}>
                    {!props.loading && props.value}
                </Text>
            </dd>
        </div>
    );
}

export function DetailHeroTags({
    label,
    moreLabel,
    values,
}: {
    label: string;
    moreLabel: string;
    values: readonly string[];
}) {
    if (!values.length) return null;

    return (
        <DetailHeroDetail
            label={label}
            value={
                <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                    <span>{values[0]}</span>
                    {values.length > 1 ? (
                        <Popover>
                            <Popover.Trigger asChild>
                                {/* One line of the label's height at every width, so the row matches the others;
                                    the hit area extends past it instead. */}
                                <Button
                                    className="h-5 px-1.5 py-0 text-xs leading-5 before:-inset-y-3 sm:h-5"
                                    aria-label={`${label}: ${moreLabel}`}
                                    variant="quiet"
                                >
                                    {moreLabel}
                                </Button>
                            </Popover.Trigger>
                            <Popover.Content align="start" width="sm" aria-label={label}>
                                <Text variant="label">{label}</Text>
                                <ul className="mt-3 flex flex-wrap gap-2">
                                    {values.map((value) => (
                                        <li key={value} className="max-w-full min-w-0">
                                            <Badge
                                                tone="neutral"
                                                className="max-w-full wrap-break-word whitespace-normal"
                                            >
                                                {value}
                                            </Badge>
                                        </li>
                                    ))}
                                </ul>
                            </Popover.Content>
                        </Popover>
                    ) : null}
                </div>
            }
        />
    );
}
