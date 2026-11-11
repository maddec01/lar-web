import { ArrowRightIcon } from 'lucide-react';
import type { AnchorHTMLAttributes, MouseEvent, ReactNode } from 'react';

import { SpinnerIcon } from '../feedback/Loading';
import { tabbable } from '../foundations/KeyboardFocus';
import { ghostRecipe, outlineRecipe, primaryRecipe, tintedRecipe } from './ButtonRecipes';

/** The marketing pages' calls to action: the Button recipes at a roomier 44px, as links. */
const recipes = {
    primary:
        'border-primary bg-primary text-primary-content shadow-(--shadow-raised) shadow-primary-ring inset-shadow-(--shadow-highlight) hover:bg-primary-fill-hover active:shadow-none',
    secondary: 'border-line-control bg-surface-control text-fg shadow-(--shadow-raised) hover:bg-fill-hover',
    inverse: 'border-transparent bg-fg text-fg-inverse shadow-(--shadow-raised) hover:bg-fg/86',
    quiet: 'border-transparent text-fg hover:text-primary-fg',
    tinted: tintedRecipe,
} as const;

/** The `app` look is the app Button as a link, in the Button's own recipes and sizes with its 13px label: `sm` 28px
 *  for an action that opens a page from a row, a card or a toolbar, `md` 32px in a form or a dialog's footer. */
const compactBase =
    'group/button relative isolate inline-flex items-center justify-center gap-2 rounded-md border px-2.75 text-ui font-medium whitespace-nowrap no-underline transition-[background-color,box-shadow,scale,color] duration-(--motion-duration-fast) active:scale-[0.97] focus-ring-inset [&_[data-slot=icon]>svg]:size-4';
const compactSizes = { sm: 'h-7', md: 'h-8' } as const;
const compactSquare = { sm: 'w-7 px-0', md: 'w-8 px-0' } as const;
const compactRecipes = {
    primary: primaryRecipe,
    secondary: outlineRecipe,
    inverse: recipes.inverse,
    quiet: ghostRecipe,
    tinted: tintedRecipe,
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
     *  `quiet` (text in the marketing look, the ghost in the app look), or `tinted`, the Button's "you can start
     *  this". */
    variant?: keyof typeof recipes;
    /** Its scale. In the marketing look (the default), `lg` (44px, the default) for a hero and `md` (36px) for a band
     *  or a card. `sm` is always the app look's 28px. In the app look, `md` (its default; `lg` draws as `md`) is the
     *  app Button's 32px. */
    size?: 'sm' | 'md' | 'lg';
    /** `marketing` (the default): the website's roomier calls to action. `app`: the app Button as a link, at its own
     *  sizes (`sm` 28px, `md` 32px, both with the 13px label) and recipes, so a link sits beside a Button and matches
     *  it; spread the same `variant` and `size` on either. `size="sm"` takes this look whatever `look` says. */
    look?: 'marketing' | 'app';
    /** An icon before the label. */
    icon?: ReactNode;
    /** Shows an arrow that nudges forward on hover. */
    arrow?: boolean;
    /** Opens in a new tab, safely, and is left to the browser. */
    external?: boolean;
    /** Called with the `href` on a plain left click, in place of the browser's navigation, for the app's router. */
    onNavigate?: (href: string) => void;
    /** In the app look, a square link showing its icon alone, named by its `aria-label`. */
    iconOnly?: boolean;
    /** Holds activation while work is in flight, keeping the link in the tab order. */
    busy?: boolean;
}

/** A link that looks like a button: a marketing page's calls to action, or in the app look, the app Button. */
export function ButtonLink({
    variant = 'primary',
    look = 'marketing',
    size = look === 'app' ? 'md' : 'lg',
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

    if (size === 'sm' || look === 'app') {
        const appSize = size === 'sm' ? 'sm' : 'md';

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
                className={`${compactBase} ${compactSizes[appSize]} ${compactRecipes[variant]} ${iconOnly ? compactSquare[appSize] : ''}`}
            >
                {leading && <span data-slot="icon">{leading}</span>}
                {children}
                {arrow ? (
                    <span
                        data-slot="icon"
                        className="-mr-0.5 inline-flex transition-transform duration-(--motion-duration-base) group-hover/button:translate-x-0.5"
                    >
                        <ArrowRightIcon />
                    </span>
                ) : null}
            </a>
        );
    }

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
