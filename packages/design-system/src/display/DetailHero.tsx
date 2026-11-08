import { ChevronDownIcon } from 'lucide-react';
import { Children, type CSSProperties, type ReactNode, useId, useState } from 'react';

import { ButtonBase as Button } from '../actions/Button';
import { SkeletonLoader } from '../feedback/SkeletonLoader';
import { Popover } from '../overlays/Popover';
import { softBreaks } from '../typography/SoftBreaks';
import { HeadingBase, Text, TextBase } from '../typography/Typography';
import { BadgeBase as Badge } from './Badge';
import { TextPreview } from './TextPreview';
import { type VisibleBounds, useVisibleBounds } from './VisibleBounds';

type DetailHeroProps =
    | { loading: true; loadingLabel: string; summary?: boolean; description?: boolean; details?: number }
    | {
          loading?: false;
          actions?: ReactNode;
          /** The cover, poster or portrait. With no image of its own, its placeholder in the same frame (a 2:3 poster
           *  for a film, a square for an album), so the page keeps one layout with or without art. */
          artwork: ReactNode;
          /** A backdrop image. With it, or with a `titleLogoSrc`, the hero sits on a dark stage in both themes, so a
           *  light logo and the text over the image stay readable. */
          backgroundSrc?: string;
          children: ReactNode;
          label: string;
          subtitle?: ReactNode;
          summary?: ReactNode;
          /** The work's synopsis or overview, after the facts: set at a reading measure (about 70 characters a line)
           *  however wide the page, so a long plot never runs edge to edge. */
          synopsis?: ReactNode;
          title: string;
          /** The page header defaults to h1. Set h2 only when embedded under another page heading. */
          titleLevel?: 'h1' | 'h2';
          /** The title as artwork (usually a light logo), sized by its visible lettering, not its transparent margins.
           *  The text title shows instead while it loads, if it fails to load, under 40rem, and when it is so wide
           *  that its lettering would be smaller than the heading's. */
          titleLogoSrc?: string;
      };

/**
 * A detail page's opening: artwork, identity, actions and facts. Under 40rem the artwork and identity sit side by
 * side with everything else below at full width; from 40rem the artwork takes its own column.
 */
export function DetailHero(props: DetailHeroProps) {
    const loading = props.loading === true;
    const background = props.loading ? undefined : props.backgroundSrc;
    const logoSrc = props.loading ? undefined : props.titleLogoSrc;
    const measured = useVisibleBounds(logoSrc);
    const logo =
        logoSrc && measured.state === 'ready' && measured.bounds.contentAspect <= maxLogoAspect
            ? { src: logoSrc, bounds: measured.bounds }
            : undefined;
    // The stage follows the logo the page asked for, so it doesn't flip while the logo is measured.
    const stage = Boolean(background ?? (logoSrc && measured.state !== 'failed'));
    const art = props.loading || (props.artwork !== null && props.artwork !== undefined);

    return (
        <SkeletonLoader loading={loading} label={props.loading ? props.loadingLabel : ''}>
            <section
                data-slot="detail-hero"
                className={`relative isolate min-w-0 ${stage ? 'dark lar-dark-palette bg-surface-page text-fg overflow-hidden rounded-2xl p-4 sm:p-6 md:p-8' : 'pb-4'}`}
            >
                {stage ? (
                    <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
                        {background ? (
                            <img src={background} alt="" className="size-full object-cover opacity-70" />
                        ) : null}
                        {/* A fixed dark scrim, strongest behind the text, so contrast holds over any image. */}
                        <div className="bg-surface-page/90 absolute inset-0" />
                        <div className="from-surface-page/80 absolute inset-0 bg-linear-to-t to-transparent to-60%" />
                    </div>
                ) : null}
                <div
                    className={`grid gap-x-4 gap-y-3 sm:gap-x-6 sm:gap-y-5 md:gap-x-8 md:gap-y-6 ${art ? 'grid-cols-[6.5rem_minmax(0,1fr)] sm:grid-cols-[10rem_minmax(0,1fr)] md:grid-cols-[14rem_minmax(0,1fr)]' : 'grid-cols-1'}`}
                >
                    {art ? (
                        <div className="ring-fg/10 self-start overflow-hidden rounded-lg shadow-(--shadow-raised) ring-1 sm:row-span-2">
                            {props.loading ? <SkeletonLoader.Shape presentation="artwork" /> : props.artwork}
                        </div>
                    ) : null}
                    <div className="min-w-0 self-center sm:self-end">
                        <TextBase
                            variant="overline"
                            tone="muted"
                            className={`mb-1.5 sm:mb-2 ${loading ? 'max-w-32' : ''}`}
                            loading={loading}
                        >
                            {!props.loading && props.label}
                        </TextBase>
                        <div className="flex min-w-0 flex-wrap items-start gap-2 sm:gap-3">
                            <HeadingBase
                                as={props.loading ? 'h1' : (props.titleLevel ?? 'h1')}
                                aria-label={props.loading ? undefined : props.title}
                                variant="hero"
                                className={`min-w-0 flex-1 basis-32 wrap-break-word max-sm:text-2xl sm:basis-48 ${logo ? 'leading-none' : ''} ${loading ? 'w-3/4 max-w-xl' : ''}`}
                                loading={loading}
                            >
                                {!props.loading &&
                                    (logo ? (
                                        <>
                                            <span className="sm:hidden">{softBreaks(props.title)}</span>
                                            <TitleLogo src={logo.src} alt={props.title} bounds={logo.bounds} />
                                        </>
                                    ) : (
                                        softBreaks(props.title)
                                    ))}
                            </HeadingBase>
                            {!props.loading && props.actions ? (
                                <div className="ml-auto flex max-w-full shrink-0 flex-wrap items-center justify-end gap-1">
                                    {props.actions}
                                </div>
                            ) : null}
                        </div>
                        {props.loading || props.subtitle ? (
                            <TextBase
                                variant="description"
                                tone="muted"
                                className={`mt-1.5 wrap-break-word sm:mt-2 ${loading ? 'max-w-sm' : ''}`}
                                loading={loading}
                            >
                                {!props.loading && props.subtitle}
                            </TextBase>
                        ) : null}
                    </div>
                    <div
                        // Text the caller passes straight in (a plot in a Text) keeps the same reading measure.
                        className={`flex min-w-0 flex-col gap-3 sm:gap-5 md:gap-6 [&>p]:max-w-[70ch] ${art ? 'col-span-2 sm:col-span-1 sm:col-start-2 sm:self-start' : ''}`}
                    >
                        {props.summary ? (
                            <TextBase tone="muted" className="max-w-xl" loading={loading}>
                                {!props.loading && props.summary}
                            </TextBase>
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
                            <>
                                {props.children}
                                {props.synopsis ? (
                                    <TextBase className="max-w-[70ch] text-pretty">{props.synopsis}</TextBase>
                                ) : null}
                            </>
                        )}
                    </div>
                </div>
            </section>
        </SkeletonLoader>
    );
}

// A logo wider than this, at the logo's full width, letters smaller than the heading would: the text title reads better.
const maxLogoAspect = 8;

/** The logo cropped to its visible lettering: up to 5rem tall and 24rem wide, whichever it reaches first. */
function TitleLogo({ src, alt, bounds }: { src: string; alt: string; bounds: VisibleBounds }) {
    const frame: CSSProperties = { aspectRatio: bounds.aspect, width: `min(100%, 24rem, ${5 * bounds.aspect}rem)` };
    const crop: CSSProperties = {
        width: `${100 / bounds.width}%`,
        height: `${100 / bounds.height}%`,
        left: `${(-bounds.x / bounds.width) * 100}%`,
        top: `${(-bounds.y / bounds.height) * 100}%`,
    };

    return (
        <span
            data-slot="title-logo"
            style={frame}
            className="relative hidden overflow-hidden drop-shadow-(--shadow-logo) sm:block"
        >
            <img src={src} alt={alt} style={crop} className="absolute max-w-none" />
        </span>
    );
}

/** The hero's facts. Under 40rem, with `moreLabel`, only the first two show until the reader asks for the rest. */
export function DetailHeroDetails({
    children,
    moreLabel,
    lessLabel,
}: {
    children: ReactNode;
    /** The control that shows the rest on a narrow screen, such as “All details”. */
    moreLabel?: string;
    lessLabel?: string;
}) {
    const id = useId();
    const [open, setOpen] = useState(false);
    const collapsible = moreLabel !== undefined && Children.toArray(children).length > collapsedCount;

    return (
        <div className="flex min-w-0 flex-col items-start gap-2 sm:gap-3">
            <dl
                id={id}
                className={`grid w-full grid-cols-2 gap-x-6 gap-y-2 sm:flex sm:flex-wrap sm:gap-x-8 sm:gap-y-4 ${collapsible && !open ? 'max-sm:[&>*:nth-child(n+3)]:hidden' : ''}`}
            >
                {children}
            </dl>
            {collapsible ? (
                <Button
                    type="button"
                    variant="quiet"
                    size="sm"
                    className="-ml-2 sm:hidden"
                    aria-expanded={open}
                    aria-controls={id}
                    rightIcon={<ChevronDownIcon className={`transition-transform ${open ? 'rotate-180' : ''}`} />}
                    onClick={() => setOpen((value) => !value)}
                >
                    {open ? (lessLabel ?? moreLabel) : moreLabel}
                </Button>
            ) : null}
        </div>
    );
}

const collapsedCount = 2;

type DetailProps = { loading: true } | { loading?: false; label: string; value: ReactNode };

export function DetailHeroDetail(props: DetailProps) {
    return (
        <div className={props.loading ? 'w-24' : 'max-w-full min-w-0'}>
            <dt>
                <Text as="span" variant="caption" tone="muted" loading={props.loading}>
                    {!props.loading && props.label}
                </Text>
            </dt>
            <dd className="mt-0.5 min-h-5 wrap-break-word sm:mt-1 sm:min-h-6">
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
