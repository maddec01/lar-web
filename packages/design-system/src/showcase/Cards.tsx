import { ArrowRightIcon } from 'lucide-react';
import type { CSSProperties, ReactNode } from 'react';

import { tabbable } from '../foundations/KeyboardFocus';
import { Heading, Text } from '../typography/Typography';

interface ProductCardProps {
    /** A lar-brand app hue; omit for Factory's neutral graphite. */
    hue?: number;
    icon: ReactNode;
    name: string;
    status: ReactNode;
    title: string;
    description: string;
    linkLabel: string;
    href: string;
    onNavigate: (href: string) => void;
    media: ReactNode;
}

/** A product on the home page: its name and promise above a screenshot that runs off the card's edge. */
export function ProductCard({
    hue,
    icon,
    name,
    status,
    title,
    description,
    linkLabel,
    href,
    onNavigate,
    media,
}: ProductCardProps) {
    return (
        <article
            className="group/product border-base-300 bg-base-100 hover:border-base-400 dark:bg-base-100/80 relative isolate flex flex-col overflow-hidden rounded-[1.5rem] border shadow-[0_1px_0_rgb(255_255_255/4%)_inset] transition-[border-color,box-shadow] duration-300 hover:shadow-[0_30px_80px_-40px_rgb(0_0_0/45%)]"
            style={
                { '--lar-card-hue': hue ?? 264, '--lar-card-chroma': hue === undefined ? 0.01 : 0.12 } as CSSProperties
            }
        >
            <div
                aria-hidden="true"
                className="absolute inset-0 -z-10 bg-[radial-gradient(80%_60%_at_100%_0%,oklch(0.6_var(--lar-card-chroma)_var(--lar-card-hue)/0.16),transparent_70%)] transition-opacity duration-500 group-hover/product:opacity-150 dark:bg-[radial-gradient(80%_60%_at_100%_0%,oklch(0.5_var(--lar-card-chroma)_var(--lar-card-hue)/0.3),transparent_70%)]"
            />
            <div className="flex flex-col gap-5 p-7 pb-8 sm:p-9 sm:pb-10">
                <div className="flex items-center gap-3">
                    {icon}
                    <div className="flex min-w-0 flex-col">
                        <Text as="span" variant="label">
                            {name}
                        </Text>
                    </div>
                    <span className="ml-auto">{status}</span>
                </div>
                <Heading as="h3" variant="feature" className="max-w-[440px]">
                    {title}
                </Heading>
                <Text variant="prose" tone="muted" className="max-w-[460px]">
                    {description}
                </Text>
                <a
                    {...tabbable}
                    href={href}
                    onClick={(event) => {
                        if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return;

                        event.preventDefault();
                        onNavigate(href);
                    }}
                    className="text-base-content focus-visible:before:outline-primary inline-flex w-fit items-center gap-1.5 text-[15px] font-medium before:absolute before:inset-0 before:z-10 before:rounded-[inherit] focus-visible:outline-none focus-visible:before:outline-2 focus-visible:before:outline-offset-[-2px] [&_svg]:size-4"
                >
                    {linkLabel}
                    <span className="inline-flex transition-transform duration-200 group-hover/product:translate-x-1">
                        <ArrowRightIcon />
                    </span>
                </a>
            </div>
            <div className="relative h-[240px] overflow-hidden [mask-image:linear-gradient(to_bottom,#000_calc(100%-56px),transparent)] pl-7 sm:h-[320px] sm:pl-9">
                <div className="transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/product:-translate-y-2">
                    {media}
                </div>
            </div>
        </article>
    );
}

/** Two or three product cards side by side. */
export function ProductGrid({ children }: { children: ReactNode }) {
    return <div className="grid gap-5 lg:grid-cols-2">{children}</div>;
}

interface FeatureTileProps {
    icon: ReactNode;
    title: string;
    children: ReactNode;
    hue?: number;
}

/** A short benefit: an icon in a tinted square, a title and a sentence or two. */
export function FeatureTile({ icon, title, children, hue }: FeatureTileProps) {
    return (
        <div className="sm:border-base-300/80 sm:bg-base-100/60 sm:dark:bg-base-100/40 grid grid-cols-[auto_1fr] gap-x-3 gap-y-0.5 p-4 sm:flex sm:flex-col sm:gap-3 sm:rounded-[1.125rem] sm:border sm:p-6">
            <span
                className={`row-span-2 inline-flex size-8 items-center justify-center rounded-[0.6rem] ring-1 ring-inset sm:size-10 sm:rounded-[0.7rem] [&>svg]:size-4 sm:[&>svg]:size-5 ${hue === undefined ? 'bg-primary/10 text-primary ring-primary/15 dark:bg-primary/20 dark:ring-primary/30 dark:text-[color-mix(in_srgb,var(--color-primary)_45%,white)]' : 'kind-badge ring-current/10'}`}
                style={hue === undefined ? undefined : ({ '--lar-kind-hue': hue } as CSSProperties)}
            >
                {icon}
            </span>
            <Heading as="h3" variant="subsection" className="self-center sm:mt-1 sm:self-auto">
                {title}
            </Heading>
            <Text variant="prose" tone="muted" className="col-start-2">
                {children}
            </Text>
        </div>
    );
}

export function FeatureGrid({ children, columns = 3 }: { children: ReactNode; columns?: 2 | 3 | 4 }) {
    const layouts = {
        2: 'sm:grid-cols-2',
        3: 'sm:grid-cols-2 lg:grid-cols-3',
        4: 'sm:grid-cols-2 lg:grid-cols-4',
    };

    return (
        <div
            className={`divide-base-300/70 border-base-300/80 bg-base-100/60 dark:bg-base-100/40 grid divide-y rounded-2xl border sm:gap-4 sm:divide-y-0 sm:rounded-none sm:border-0 sm:bg-transparent sm:dark:bg-transparent ${layouts[columns]}`}
        >
            {children}
        </div>
    );
}
