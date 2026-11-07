import { CheckIcon } from 'lucide-react';
import { type ReactNode, useId } from 'react';

import { Eyebrow } from '../layout/PageSection';
import { Heading, Text } from '../typography/Typography';

interface FeatureRowProps {
    eyebrow?: string;
    title: string;
    children: ReactNode;
    points?: readonly string[];
    media: ReactNode;
    /** Puts the media on the left. */
    reverse?: boolean;
    /** Copy in two columns above media that spans the full width, for detailed screenshots. */
    wide?: boolean;
    /** A status chip beside the eyebrow. */
    badge?: ReactNode;
    /** How wide a wide row's media runs: the whole column, or a centred, readable measure. */
    mediaWidth?: 'full' | 'measure';
    /** Gives the media two-thirds of a side-by-side row instead of seven twelfths. */
    largeMedia?: boolean;
}

/** A feature told in copy on one side and shown on a device on the other. */
export function FeatureRow({
    eyebrow,
    title,
    children,
    points,
    media,
    reverse,
    wide,
    badge,
    mediaWidth = 'measure',
    largeMedia,
}: FeatureRowProps) {
    const id = useId();

    if (wide)
        return (
            <article aria-labelledby={id} className="flex flex-col gap-12">
                <div className="grid gap-x-16 gap-y-4 lg:grid-cols-2">
                    <div className="flex flex-col gap-4">
                        {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
                        <Heading id={id} as="h3" variant="feature">
                            {title}
                        </Heading>
                        <Text variant="prose" tone="muted">
                            {children}
                        </Text>
                    </div>
                    {points?.length ? (
                        <div className="lg:pt-9">
                            <PointList points={points} />
                        </div>
                    ) : null}
                </div>
                <div className={`mx-auto w-full ${mediaWidth === 'full' ? '' : 'max-w-[780px]'}`}>{media}</div>
            </article>
        );

    return (
        <article
            aria-labelledby={id}
            className={`grid items-center gap-8 sm:gap-12 lg:gap-16 ${reverse ? (largeMedia ? 'lg:grid-cols-[minmax(0,8fr)_minmax(0,4fr)]' : 'lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]') : largeMedia ? 'lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)]' : 'lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]'}`}
        >
            <div className={`flex flex-col gap-4 max-sm:[&>h3]:mb-1 ${reverse ? 'lg:order-2' : ''}`}>
                {eyebrow ? (
                    <div className="flex items-center gap-3">
                        <Eyebrow>{eyebrow}</Eyebrow>
                        {badge}
                    </div>
                ) : null}
                <Heading id={id} as="h3" variant="feature">
                    {title}
                </Heading>
                <Text variant="prose" tone="muted">
                    {children}
                </Text>
                {points?.length ? <PointList points={points} /> : null}
            </div>
            <div className={reverse ? 'lg:order-1' : ''}>{media}</div>
        </article>
    );
}

/** Checked lines under a feature. */
export function PointList({ points }: { points: readonly string[] }) {
    return (
        <ul className="mt-2 flex flex-col gap-2.5">
            {points.map((point) => (
                <li key={point} className="text-base-800 flex gap-2.5 text-[15px] leading-6">
                    <span className="bg-primary/12 text-primary dark:bg-primary/25 mt-[3px] inline-flex size-[18px] shrink-0 items-center justify-center rounded-full dark:text-[color-mix(in_srgb,var(--color-primary)_45%,white)] [&>svg]:size-3">
                        <CheckIcon />
                    </span>
                    {point}
                </li>
            ))}
        </ul>
    );
}

/** A stack of feature rows with room between them. */
export function FeatureRows({ children }: { children: ReactNode }) {
    return <div className="flex flex-col gap-16 sm:gap-24">{children}</div>;
}
