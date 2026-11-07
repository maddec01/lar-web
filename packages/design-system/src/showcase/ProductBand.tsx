import { ArrowRightIcon } from 'lucide-react';
import { type CSSProperties, type ReactNode, useId } from 'react';

import { tabbable } from '../foundations/KeyboardFocus';
import { Heading, Text } from '../typography/Typography';

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
    products: readonly ProductEntry[];
    label: string;
    onNavigate: (href: string) => void;
}) {
    return (
        <ul aria-label={label} className="mx-auto flex max-w-[880px] flex-wrap justify-center gap-3">
            {products.map((product) => (
                <li key={product.href} className="w-full sm:w-[calc(50%-0.375rem)] lg:w-[calc(50%-0.375rem)]">
                    <a
                        {...tabbable}
                        href={product.href}
                        onClick={(event) => {
                            if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return;

                            event.preventDefault();
                            onNavigate(product.href);
                        }}
                        className="group/entry border-base-300 bg-base-100/70 hover:border-base-400 focus-visible:outline-primary dark:bg-base-100/50 flex h-full items-center gap-3 rounded-2xl border px-4 py-3 text-left shadow-xs/5 backdrop-blur transition-[border-color,background-color] focus-visible:outline-2"
                    >
                        {product.icon}
                        <span className="flex min-w-0 flex-1 flex-col gap-1">
                            <span className="flex flex-wrap items-center gap-2">
                                <span className="text-base-content text-[15px] font-semibold tracking-[-0.01em]">
                                    {product.name}
                                </span>
                                {product.status}
                            </span>
                            <span className="text-base-700 text-sm leading-5">{product.summary}</span>
                        </span>
                        <span className="text-base-600 inline-flex transition-transform duration-200 group-hover/entry:translate-x-0.5 [&_svg]:size-4">
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
    chroma?: number;
    icon: ReactNode;
    name: string;
    status: ReactNode;
    title: string;
    description: string;
    actions: ReactNode;
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
            className="border-base-300 bg-base-100 dark:bg-base-100/70 relative isolate overflow-hidden rounded-[2rem] border"
            style={{ '--lar-band-hue': hue, '--lar-band-chroma': chroma } as CSSProperties}
        >
            <div
                aria-hidden="true"
                className="absolute inset-0 -z-10 bg-[radial-gradient(70%_90%_at_var(--lar-band-x)_50%,oklch(0.6_var(--lar-band-chroma)_var(--lar-band-hue)/0.24),transparent_70%)] dark:bg-[radial-gradient(70%_90%_at_var(--lar-band-x)_50%,oklch(0.42_var(--lar-band-chroma)_var(--lar-band-hue)/0.45),transparent_70%)]"
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
                    <Heading
                        id={id}
                        as="h2"
                        variant="feature"
                        className="order-2 lg:order-none lg:text-[1.875rem] lg:leading-[1.15]"
                    >
                        {title}
                    </Heading>
                    <Text variant="lead" tone="muted" className="order-4 lg:order-none">
                        {description}
                    </Text>
                    <div className="order-5 mt-1 flex flex-col gap-3 lg:order-none">
                        <div className="flex flex-wrap items-center gap-3 max-sm:flex-col max-sm:[&>a]:w-full">
                            {actions}
                        </div>
                        {note ? (
                            <Text variant="caption" tone="muted" className="dark:text-[#96969f]">
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
export function ProductBands({ children }: { children: ReactNode }) {
    return <div className="flex flex-col gap-6 sm:gap-8">{children}</div>;
}
