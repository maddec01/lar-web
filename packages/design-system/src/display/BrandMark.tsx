import type { AnchorHTMLAttributes } from 'react';

import { tabbable } from '../foundations/KeyboardFocus';

// The lar mark on a 100-unit box: the L takes the ink colour, the block is always lar blue. AppSplash draws the same
// mark, tracing the L along its centre line with a stroke one bar wide.
export const MARK_L = 'M0 0H27.52V72.48H100V100H3a3 3 0 0 1-3-3z';
export const MARK_BAR = 27.52;
export const MARK_CENTRE_LINE = `M${MARK_BAR / 2} 0V${100 - MARK_BAR / 2}H100`;
export const MARK_S =
    'M50.68 0H91.97a8.03 8.03 0 0 1 8.03 8.03V49.32a8.03 8.03 0 0 1-8.03 8.03H50.68a8.03 8.03 0 0 1-8.03-8.03V8.03a8.03 8.03 0 0 1 8.03-8.03z';

const sizes = { md: 'text-xl', lg: 'text-2xl' } as const;

/** The Lar lockup: the mark stands in for the L, on the baseline, then "ar", then an optional product name in grey
 *  after a 0.26em space (lar-brand SPEC.md). */
export function BrandMark({
    label,
    product,
    size = 'md',
}: {
    /** The lockup's accessible name, such as the app's name. */
    label: string;
    /** The product's name after the wordmark, in grey, such as "Factory". */
    product?: string;
    /** `md` (20px, the default) for a header, `lg` (24px) for a sign-in page or a hero. */
    size?: keyof typeof sizes;
}) {
    return (
        <span
            role="img"
            aria-label={label}
            className={`lar-brand-mark inline-flex shrink-0 items-baseline leading-none ${sizes[size]}`}
        >
            <svg aria-hidden viewBox="0 0 100 100" className="mr-[0.07em] size-[0.705em] shrink-0">
                <path d={MARK_L} fill="currentColor" />
                <path d={MARK_S} fill="var(--color-brand-mark)" />
            </svg>
            <span aria-hidden className="tracking-display font-bold">
                ar
            </span>
            {product ? (
                <span aria-hidden className="text-fg-muted tracking-title ml-[0.26em] font-medium">
                    {product}
                </span>
            ) : null}
        </span>
    );
}

interface BrandLinkProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'className' | 'style' | 'color'> {
    /** Home's address. */
    href: string;
    /** The link's accessible name, such as the app's name and "home". */
    label: string;
    /** Called with the `href` on a plain left click, in place of the browser's navigation, for the app's router. */
    onNavigate: (href: string) => void;
}

/** The lockup as the link home. */
export function BrandLink({ href, label, onNavigate, ...props }: BrandLinkProps) {
    return (
        <a
            {...tabbable}
            {...props}
            href={href}
            onClick={(event) => {
                if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return;

                event.preventDefault();
                onNavigate(href);
            }}
            className="focus-ring -mx-1 inline-flex items-center rounded-md px-1 py-1"
        >
            <BrandMark label={label} />
        </a>
    );
}
