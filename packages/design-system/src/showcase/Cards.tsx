import { ArrowRightIcon } from 'lucide-react';
import type { CSSProperties, ReactNode } from 'react';

import { tabbable } from '../foundations/KeyboardFocus';
import { HeadingBase, Text, TextBase } from '../typography/Typography';

interface ProductCardProps {
    /** A lar-brand app hue; omit for Factory's neutral graphite. */
    hue?: number;
    /** The product's app icon. */
    icon: ReactNode;
    /** The product's name. */
    name: string;
    /** Where the product stands, such as a ReadinessStatus. */
    status: ReactNode;
    /** The product's promise, as the card's title. */
    title: string;
    /** A sentence or two on what the product does. */
    description: string;
    /** The link's text, such as "Explore Lar Server". */
    linkLabel: string;
    /** The product's page. */
    href: string;
    /** Called with the href as the link is followed, for client-side routing. */
    onNavigate: (href: string) => void;
    /** The screenshot that runs off the card's edge. */
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
            className="group/product border-line bg-surface-raised hover:border-line-hover relative isolate flex flex-col overflow-hidden rounded-3xl border shadow-(--shadow-showcase-card) transition-[border-color,box-shadow] duration-(--motion-duration-slow) hover:shadow-(--shadow-showcase-card-hover)"
            style={
                { '--lar-card-hue': hue ?? 264, '--lar-card-chroma': hue === undefined ? 0.01 : 0.12 } as CSSProperties
            }
        >
            <div
                aria-hidden="true"
                className="absolute inset-0 -z-10 bg-[radial-gradient(80%_60%_at_100%_0%,oklch(var(--lar-card-glow-lightness)_var(--lar-card-chroma)_var(--lar-card-hue)/var(--lar-card-glow-alpha)),transparent_70%)] transition-opacity duration-(--motion-duration-deliberate) group-hover/product:opacity-150"
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
                <HeadingBase as="h3" variant="feature" className="max-w-110">
                    {title}
                </HeadingBase>
                <TextBase variant="prose" tone="muted" className="max-w-115">
                    {description}
                </TextBase>
                <a
                    {...tabbable}
                    href={href}
                    onClick={(event) => {
                        if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return;

                        event.preventDefault();
                        onNavigate(href);
                    }}
                    className="text-fg focus-ring-stretched text-md inline-flex w-fit items-center gap-1.5 font-medium before:absolute before:inset-0 before:z-10 before:rounded-[inherit] [&_svg]:size-4"
                >
                    {linkLabel}
                    <span className="inline-flex transition-transform duration-(--motion-duration-base) group-hover/product:translate-x-1">
                        <ArrowRightIcon />
                    </span>
                </a>
            </div>
            <div className="relative h-60 overflow-hidden [mask-image:linear-gradient(to_bottom,#000_calc(100%-56px),transparent)] pl-7 sm:h-80 sm:pl-9">
                <div className="ease-emphasized transition-transform duration-(--motion-duration-deliberate) group-hover/product:-translate-y-2">
                    {media}
                </div>
            </div>
        </article>
    );
}

/** Two or three product cards side by side. */
export function ProductGrid({
    children,
}: {
    /** The ProductCards. */
    children: ReactNode;
}) {
    return <div className="grid gap-5 lg:grid-cols-2">{children}</div>;
}

interface FeatureTileProps {
    /** The benefit's icon, in a tinted square. */
    icon: ReactNode;
    /** The benefit's title. */
    title: string;
    /** A sentence or two on the benefit. */
    children: ReactNode;
    /** A product's hue that tints the icon's square; the brand navy without one. */
    hue?: number;
}

/** A short benefit: an icon in a tinted square, a title and a sentence or two. */
export function FeatureTile({ icon, title, children, hue }: FeatureTileProps) {
    return (
        <div className="sm:border-line/80 sm:bg-surface-glass grid grid-cols-[auto_1fr] gap-x-3 gap-y-0.5 p-4 sm:flex sm:flex-col sm:gap-3 sm:rounded-2xl sm:border sm:p-6">
            <span
                className={`row-span-2 inline-flex size-8 items-center justify-center rounded-lg ring-1 ring-inset sm:size-10 sm:rounded-lg [&>svg]:size-4 sm:[&>svg]:size-5 ${hue === undefined ? 'bg-primary-surface text-primary-fg ring-primary-ring' : 'kind-badge ring-current/10'}`}
                style={hue === undefined ? undefined : ({ '--lar-kind-hue': hue } as CSSProperties)}
            >
                {icon}
            </span>
            <HeadingBase as="h3" variant="subsection" className="self-center sm:mt-1 sm:self-auto">
                {title}
            </HeadingBase>
            <TextBase variant="prose" tone="muted" className="col-start-2">
                {children}
            </TextBase>
        </div>
    );
}

export function FeatureGrid({
    children,
    columns = 3,
}: {
    /** The FeatureTiles. */
    children: ReactNode;
    /** How many columns the tiles take on wide screens. */
    columns?: 2 | 3 | 4;
}) {
    const layouts = {
        2: 'sm:grid-cols-2',
        3: 'sm:grid-cols-2 lg:grid-cols-3',
        4: 'sm:grid-cols-2 lg:grid-cols-4',
    };

    return (
        <div
            className={`divide-line/70 border-line/80 bg-surface-glass grid divide-y rounded-2xl border sm:gap-4 sm:divide-y-0 sm:rounded-none sm:border-0 sm:bg-transparent ${layouts[columns]}`}
        >
            {children}
        </div>
    );
}
