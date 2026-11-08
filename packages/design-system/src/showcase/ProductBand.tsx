import { ArrowRightIcon } from 'lucide-react';
import { type CSSProperties, type ReactNode, useId } from 'react';

import { tabbable } from '../foundations/KeyboardFocus';
import { HeadingBase, Text, TextBase } from '../typography/Typography';

export interface ProductEntry {
    name: string;
    icon: ReactNode;
    status: ReactNode;
    summary: string;
    href: string;
}

/** The family of products under a hero, one compact entry each, wrapping as the family grows. */
export function ProductIndex({
    products,
    label,
    onNavigate,
}: {
    /** The products, each with its icon, name, status and page. */
    products: readonly ProductEntry[];
    /** Names the list for screen readers. */
    label: string;
    /** Called with a product's href as it is followed, for client-side routing. */
    onNavigate: (href: string) => void;
}) {
    return (
        <ul aria-label={label} className="mx-auto flex max-w-220 flex-wrap justify-center gap-3">
            {products.map((product) => (
                <li key={product.href} className="w-full sm:w-[calc(50%-0.375rem)]">
                    <a
                        {...tabbable}
                        href={product.href}
                        onClick={(event) => {
                            if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return;

                            event.preventDefault();
                            onNavigate(product.href);
                        }}
                        className="group/entry border-line bg-surface-glass hover:border-line-hover focus-ring flex h-full items-center gap-3 rounded-2xl border px-4 py-3 text-left shadow-(--shadow-raised) backdrop-blur transition-[border-color,background-color]"
                    >
                        {product.icon}
                        <span className="flex min-w-0 flex-1 flex-col gap-1">
                            <span className="flex flex-wrap items-center gap-2">
                                <span className="text-fg text-md tracking-heading font-semibold">{product.name}</span>
                                {product.status}
                            </span>
                            <span className="text-fg-muted text-sm leading-5">{product.summary}</span>
                        </span>
                        <span className="text-fg-muted inline-flex transition-transform duration-(--motion-duration-base) group-hover/entry:translate-x-0.5 [&_svg]:size-4">
                            <ArrowRightIcon />
                        </span>
                    </a>
                </li>
            ))}
        </ul>
    );
}

interface ProductBandProps {
    /** The band's colour world: a hue and how strongly it shows. */
    hue: number;
    /** How strongly the product's hue colours the band: 0.13 by default. */
    chroma?: number;
    /** The product's app icon. */
    icon: ReactNode;
    /** The product's name. */
    name: string;
    /** Where the product stands, such as a ReadinessStatus. */
    status: ReactNode;
    /** The product's promise, as the band's title. */
    title: string;
    /** A sentence or two on what the product does. */
    description: string;
    /** The product's ways in. */
    actions: ReactNode;
    /** The product on its devices. */
    media: ReactNode;
    /** Puts the media on the left. */
    reverse?: boolean;
    /** A short line under the actions, such as requirements. */
    note?: ReactNode;
}

/** One product's own space on a page that presents several: its colour, its devices, its way in. */
export function ProductBand({
    hue,
    chroma = 0.13,
    icon,
    name,
    status,
    title,
    description,
    actions,
    media,
    reverse,
    note,
}: ProductBandProps) {
    const id = useId();

    return (
        <article
            aria-labelledby={id}
            className="border-line bg-surface-raised relative isolate overflow-hidden rounded-3xl border"
            style={{ '--lar-band-hue': hue, '--lar-band-chroma': chroma } as CSSProperties}
        >
            <div
                aria-hidden="true"
                className="absolute inset-0 -z-10 bg-[radial-gradient(70%_90%_at_var(--lar-band-x)_50%,oklch(var(--lar-band-glow-lightness)_var(--lar-band-chroma)_var(--lar-band-hue)/var(--lar-band-glow-alpha)),transparent_70%)]"
                style={{ '--lar-band-x': reverse ? '20%' : '80%' } as CSSProperties}
            />
            {/* On narrow screens the text wrapper dissolves, so the product's picture sits right under its
                heading, before the description and actions. */}
            <div
                className={`grid items-center gap-5 p-6 sm:p-10 lg:gap-12 lg:p-12 ${reverse ? 'lg:grid-cols-[minmax(0,8fr)_minmax(0,4fr)]' : 'lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)]'}`}
            >
                <div className={`contents lg:flex lg:flex-col lg:gap-5 ${reverse ? 'lg:order-2' : ''}`}>
                    <div className="order-1 flex items-center gap-3 lg:order-none">
                        {icon}
                        <Text as="span" variant="label">
                            {name}
                        </Text>
                        {status}
                    </div>
                    <HeadingBase
                        id={id}
                        as="h2"
                        variant="feature"
                        className="order-2 lg:order-none lg:text-3xl lg:leading-[1.15]"
                    >
                        {title}
                    </HeadingBase>
                    <TextBase variant="lead" tone="muted" className="order-4 lg:order-none">
                        {description}
                    </TextBase>
                    <div className="order-5 mt-1 flex flex-col gap-3 lg:order-none">
                        <div className="flex flex-wrap items-center gap-3 max-sm:flex-col max-sm:[&>a]:w-full">
                            {actions}
                        </div>
                        {note ? (
                            <Text variant="caption" tone="lead">
                                {note}
                            </Text>
                        ) : null}
                    </div>
                </div>
                <div className={`order-3 my-3 lg:my-0 ${reverse ? 'lg:order-1' : 'lg:order-none'}`}>{media}</div>
            </div>
        </article>
    );
}

/** Product bands one after another, as many as the family has. */
export function ProductBands({
    children,
}: {
    /** The ProductBands. */
    children: ReactNode;
}) {
    return <div className="flex flex-col gap-6 sm:gap-8">{children}</div>;
}
