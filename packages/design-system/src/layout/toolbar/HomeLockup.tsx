import type { MouseEvent } from 'react';

import { BrandMark } from '../../display/BrandMark';
import { tabbable } from '../../foundations/KeyboardFocus';

/** Where a lockup leads: the app's home. */
export interface HomeLink {
    /** Home's address. */
    href: string;
    /** The link's accessible name, such as "Lar Server, home". */
    label: string;
    /** Called with the `href` on a plain left click, in place of the browser's navigation, for the app's router. */
    onNavigate?: (href: string) => void;
}

/** The lockup's look, a link or not: the mark on the baseline, "ar", then the product's word at 20/500 in the muted
 *  ink, 0.26em after it (BrandMark's own spacing). The word hides under 640px, leaving "Lar". Its box is the 20px
 *  line alone (`leading-none`), so it centres the same in every bar. */
export function ProductLockup({
    label,
    product,
    size = 'md',
    productFolds = true,
}: {
    /** The lockup's accessible name, when it stands alone (not inside a labelled link). */
    label?: string;
    /** The product's word after "Lar", such as "Server"; without it, just "Lar". */
    product?: string;
    /** `md` (20px) in a bar; `lg` (24px) on a sign-in page. */
    size?: 'md' | 'lg';
    /** Hides the product's word under 640px (a bar); false keeps it (a sign-in card). */
    productFolds?: boolean;
}) {
    return (
        <span
            role={label ? 'img' : undefined}
            aria-label={label}
            aria-hidden={label ? undefined : true}
            className={`inline-flex shrink-0 items-baseline leading-none ${size === 'lg' ? 'text-2xl' : 'text-xl'}`}
        >
            <span aria-hidden="true" className="contents">
                <BrandMark label="" size={size} />
            </span>
            {product ? (
                <span
                    aria-hidden="true"
                    className={`text-fg-muted tracking-title ml-[0.26em] font-medium whitespace-nowrap ${productFolds ? 'max-sm:hidden' : ''}`}
                >
                    {product}
                </span>
            ) : null}
        </span>
    );
}

/** The lockup as the link home, as every app's title bar and the site's header draw it: 28px tall, so the mark sits
 *  at one height in every bar, with the focus ring a little outside it. */
export function HomeLockup({
    home,
    product,
}: {
    /** Where it leads, and its name. */
    home: HomeLink;
    /** The product's word after "Lar"; without it, just "Lar". */
    product?: string;
}) {
    const { href, label, onNavigate } = home;

    return (
        <a
            {...tabbable}
            href={href}
            aria-label={label}
            data-slot="home-lockup"
            onClick={(event: MouseEvent<HTMLAnchorElement>) => {
                const modified = event.metaKey || event.ctrlKey || event.shiftKey || event.altKey;

                if (!onNavigate || modified || event.button !== 0) return;

                event.preventDefault();
                onNavigate(href);
            }}
            className="focus-ring -mx-1 inline-flex h-7 shrink-0 items-center rounded-md px-1 no-underline"
        >
            <ProductLockup product={product} />
        </a>
    );
}
