import { ArrowRightIcon } from 'lucide-react';
import type { AnchorHTMLAttributes, ReactNode } from 'react';

import { tabbable } from '../foundations/KeyboardFocus';
import { ghostRecipe, outlineRecipe, primaryRecipe } from './ButtonRecipes';

/** The marketing pages' calls to action: the Button recipes at a roomier 44px, as links. */
const recipes = {
    primary:
        'border-primary bg-primary text-primary-content shadow-sm shadow-primary/30 inset-shadow-[0_1px_rgb(255_255_255/18%)] hover:bg-[color-mix(in_srgb,var(--color-primary)_88%,white)] active:shadow-none',
    secondary:
        'border-base-400/90 bg-base-100 text-base-content shadow-xs/5 hover:bg-base-200/70 dark:border-base-400 dark:bg-base-300/40 dark:hover:bg-base-400/50',
    inverse:
        'border-transparent bg-base-content text-base-50 shadow-sm hover:bg-[color-mix(in_srgb,var(--color-base-content)_86%,transparent)]',
    quiet: 'border-transparent text-base-content hover:text-primary dark:hover:text-[color-mix(in_srgb,var(--color-primary)_45%,white)]',
} as const;

/** A compact link is the app Button's compact 28px control with 12px text, in the Button's own recipes, for an action
 *  that opens a page from a dense tool (such as Lar Factory's board). */
const compactBase =
    'relative isolate inline-flex h-7 items-center justify-center gap-2 rounded-md border px-[11px] text-xs font-medium whitespace-nowrap transition-[background-color,box-shadow,scale,color] duration-150 active:scale-[0.97] focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary focus-visible:outline-none [&_[data-slot=icon]>svg]:size-4';
const compactRecipes = {
    primary: primaryRecipe,
    secondary: outlineRecipe,
    inverse: recipes.inverse,
    quiet: ghostRecipe,
} as const;

export interface ButtonLinkProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'className' | 'style'> {
    href: string;
    variant?: keyof typeof recipes;
    size?: 'md' | 'lg';
    icon?: ReactNode;
    /** Shows an arrow that nudges forward on hover. */
    arrow?: boolean;
    external?: boolean;
    onNavigate?: (href: string) => void;
    /** The app Button's compact 28px look in place of the marketing one, its `icon` leading it. */
    compact?: boolean;
    /** With `compact`, a square link showing its icon alone, named by its `aria-label`. */
    iconOnly?: boolean;
}

export function ButtonLink({
    variant = 'primary',
    size = 'lg',
    icon,
    arrow,
    external,
    onNavigate,
    onClick,
    compact = false,
    iconOnly = false,
    children,
    href,
    ...props
}: ButtonLinkProps) {
    if (compact)
        return (
            <a
                {...props}
                href={href}
                {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}
                onClick={onClick}
                data-slot="button"
                {...(iconOnly ? { 'data-icon-only': '' } : {})}
                className={`${compactBase} ${compactRecipes[variant]} ${iconOnly ? 'w-7 px-0' : ''}`}
            >
                {icon && <span data-slot="icon">{icon}</span>}
                {children}
            </a>
        );

    return (
        <a
            {...tabbable}
            {...props}
            href={href}
            {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}
            onClick={(event) => {
                onClick?.(event);

                if (
                    !onNavigate ||
                    external ||
                    event.defaultPrevented ||
                    event.button !== 0 ||
                    event.metaKey ||
                    event.ctrlKey ||
                    event.shiftKey ||
                    event.altKey
                )
                    return;

                event.preventDefault();
                onNavigate(href);
            }}
            className={`group/button focus-visible:outline-primary inline-flex shrink-0 items-center justify-center gap-2 rounded-[0.625rem] border font-medium whitespace-nowrap transition-[background-color,box-shadow,scale,color] duration-150 select-none focus-visible:outline-2 focus-visible:outline-offset-2 active:scale-[0.97] [&_svg]:size-4 [&_svg]:shrink-0 ${size === 'lg' ? 'h-11 text-[15px]' : 'h-9 text-sm'} ${variant === 'quiet' ? 'px-0' : size === 'lg' ? 'px-[1.125rem]' : 'px-3.5'} ${recipes[variant]}`}
        >
            {icon}
            {children}
            {arrow ? (
                <span className="-mr-0.5 inline-flex transition-transform duration-200 group-hover/button:translate-x-0.5">
                    <ArrowRightIcon />
                </span>
            ) : null}
        </a>
    );
}
