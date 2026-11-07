import type { AnchorHTMLAttributes } from 'react';

import { tabbable } from '../foundations/KeyboardFocus';

// The lar mark on a 100-unit box: the L takes the ink colour, the block is always lar blue.
const MARK_L = 'M0 0H27.52V72.48H100V100H3a3 3 0 0 1-3-3z';
const MARK_S =
    'M50.68 0H91.97a8.03 8.03 0 0 1 8.03 8.03V49.32a8.03 8.03 0 0 1-8.03 8.03H50.68a8.03 8.03 0 0 1-8.03-8.03V8.03a8.03 8.03 0 0 1 8.03-8.03z';

const sizes = { md: 'text-xl', lg: 'text-[1.6rem]' } as const;

/** The Lar lockup: the mark stands in for the L, on the baseline, then "ar", then an optional product name in grey
 *  after a 0.26em space (lar-brand SPEC.md). */
export function BrandMark({
    label,
    product,
    size = 'md',
}: {
    label: string;
    product?: string;
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
                <path d={MARK_S} fill="#355292" />
            </svg>
            <span aria-hidden className="font-bold tracking-[-0.03em]">
                ar
            </span>
            {product ? (
                <span
                    aria-hidden
                    className="ml-[0.26em] font-medium tracking-[-0.02em] text-[#6b6b73] dark:text-[#8b8b94]"
                >
                    {product}
                </span>
            ) : null}
        </span>
    );
}

interface BrandLinkProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'className' | 'style'> {
    href: string;
    label: string;
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
            className="focus-visible:outline-primary -mx-1 inline-flex items-center rounded-md px-1 py-1 focus-visible:outline-2"
        >
            <BrandMark label={label} />
        </a>
    );
}
