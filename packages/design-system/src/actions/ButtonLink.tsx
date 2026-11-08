import { ArrowRightIcon } from 'lucide-react';
import type { AnchorHTMLAttributes, MouseEvent, ReactNode } from 'react';

import { SpinnerIcon } from '../feedback/Loading';
import { tabbable } from '../foundations/KeyboardFocus';
import { ghostRecipe, outlineRecipe, primaryRecipe } from './ButtonRecipes';

/** The marketing pages' calls to action: the Button recipes at a roomier 44px, as links. */
const recipes = {
    primary:
        'border-primary bg-primary text-primary-content shadow-(--shadow-raised) shadow-primary-ring inset-shadow-(--shadow-highlight) hover:bg-primary-fill-hover active:shadow-none',
    secondary: 'border-line-control bg-surface-control text-fg shadow-(--shadow-raised) hover:bg-fill-hover',
    inverse: 'border-transparent bg-fg text-fg-inverse shadow-(--shadow-raised) hover:bg-fg/86',
    quiet: 'border-transparent text-fg hover:text-primary-fg',
} as const;

/** A `sm` link is the app Button's `sm` 28px control with 12px text, in the Button's own recipes, for an action
 *  that opens a page from a dense tool. */
const compactBase =
    'relative isolate inline-flex h-7 items-center justify-center gap-2 rounded-md border px-2.75 text-xs font-medium whitespace-nowrap no-underline transition-[background-color,box-shadow,scale,color] duration-(--motion-duration-fast) active:scale-[0.97] focus-ring-inset [&_[data-slot=icon]>svg]:size-4';
const compactRecipes = {
    primary: primaryRecipe,
    secondary: outlineRecipe,
    inverse: recipes.inverse,
    quiet: ghostRecipe,
} as const;

export interface ButtonLinkProps extends Omit<
    AnchorHTMLAttributes<HTMLAnchorElement>,
    'className' | 'style' | 'color'
> {
    /** Where it goes. */
    href: string;
    /** The link's label. */
    children?: ReactNode;
    /** Its weight among the calls to action around it: `primary` (the default), `secondary`, `inverse` on a dark band,
     *  or `quiet` text. */
    variant?: keyof typeof recipes;
    /** Its scale: `lg` (44px, the default) for a hero, `md` (36px) for a band or a card, both the marketing look; `sm`
     *  is the app Button's dense 28px look, its `icon` leading it, for a dense tool. */
    size?: 'sm' | 'md' | 'lg';
    /** An icon before the label. */
    icon?: ReactNode;
    /** Shows an arrow that nudges forward on hover. */
    arrow?: boolean;
    /** Opens in a new tab, safely, and is left to the browser. */
    external?: boolean;
    /** Called with the `href` on a plain left click, in place of the browser's navigation, for the app's router. */
    onNavigate?: (href: string) => void;
    /** With `size="sm"`, a square link showing its icon alone, named by its `aria-label`. */
    iconOnly?: boolean;
    /** Holds activation while work is in flight, keeping the link in the tab order. */
    busy?: boolean;
}

/** A link that looks like a button: a marketing page's calls to action, or at `sm`, the app Button's dense look. */
export function ButtonLink({
    variant = 'primary',
    size = 'lg',
    icon,
    arrow,
    external,
    onNavigate,
    onClick,
    iconOnly = false,
    busy = false,
    onKeyDown,
    children,
    href,
    ...props
}: ButtonLinkProps) {
    const held = busy || props['aria-disabled'] === true || props['aria-disabled'] === 'true';
    const state = {
        'aria-busy': busy || undefined,
        'aria-disabled': held || props['aria-disabled'],
    };
    const leading = busy ? <SpinnerIcon motion="always" className="size-4" /> : icon;
    // A plain left click routes in the app; a modified or middle click, or an external link, keeps the browser's own.
    const navigate = (event: MouseEvent<HTMLAnchorElement>) => {
        if (held) {
            event.preventDefault();
            event.stopPropagation();

            return;
        }

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
    };

    const keyDown: ButtonLinkProps['onKeyDown'] = (event) => {
        if (held && event.key === 'Enter') {
            event.preventDefault();
            event.stopPropagation();

            return;
        }

        onKeyDown?.(event);
    };

    if (size === 'sm')
        return (
            <a
                {...tabbable}
                {...props}
                {...state}
                onKeyDown={keyDown}
                href={href}
                {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}
                onClick={navigate}
                data-slot="button"
                {...(iconOnly ? { 'data-icon-only': '' } : {})}
                className={`${compactBase} ${compactRecipes[variant]} ${iconOnly ? 'w-7 px-0' : ''}`}
            >
                {leading && <span data-slot="icon">{leading}</span>}
                {children}
            </a>
        );

    return (
        <a
            {...tabbable}
            {...props}
            {...state}
            onKeyDown={keyDown}
            href={href}
            {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}
            onClick={navigate}
            className={`group/button focus-ring inline-flex shrink-0 items-center justify-center gap-2 rounded-lg border font-medium whitespace-nowrap no-underline transition-[background-color,box-shadow,scale,color] duration-(--motion-duration-fast) select-none active:scale-[0.97] [&_svg]:size-4 [&_svg]:shrink-0 ${size === 'lg' ? 'text-md h-11' : 'h-9 text-sm'} ${variant === 'quiet' ? 'px-0' : size === 'lg' ? 'px-4.5' : 'px-3.5'} ${recipes[variant]}`}
        >
            {leading}
            {children}
            {arrow ? (
                <span className="-mr-0.5 inline-flex transition-transform duration-(--motion-duration-base) group-hover/button:translate-x-0.5">
                    <ArrowRightIcon />
                </span>
            ) : null}
        </a>
    );
}
