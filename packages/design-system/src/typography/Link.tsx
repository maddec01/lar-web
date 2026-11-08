import {
    Link as NinnaLink,
    LinkBox as NinnaLinkBox,
    type LinkBoxProps as NinnaLinkBoxProps,
    LinkOverlay as NinnaLinkOverlay,
    type LinkOverlayProps as NinnaLinkOverlayProps,
    type LinkProps as NinnaLinkProps,
} from '@ninna-ui/primitives';
import { forwardRef, type ReactNode } from 'react';

import { tabbable } from '../foundations/KeyboardFocus';
import { linkRecipe } from './LinkRecipe';

/** A link's look is its variant and tone, never a class of the caller's. */
export interface LinkProps extends Omit<
    NinnaLinkProps,
    'size' | 'color' | 'underline' | 'externalIcon' | 'className' | 'style'
> {
    /** Where it goes. */
    href?: string;
    /** The link's text. */
    children?: ReactNode;
    /** Opens in a new tab, safely (`target="_blank"` with `rel="noopener noreferrer"`), and is left to the browser. */
    external?: boolean;
    /** Marks an `external` link with the external-link icon after its text. */
    showExternalIcon?: boolean;
    /** `body` (14px) for a link on its own line, `caption` (12px) for one among small text. */
    variant?: 'body' | 'caption';
    /** A standalone navigation instruction ("Go to the dashboard"): appends a decorative right arrow.
     *  Omit for inline prose, navigation labels, downloads and external links with their own icon. */
    arrow?: boolean;
    /** `accent` (the default) for a link that stands on its own, `muted` for a navigation trail's quiet link,
     *  `inherit` for a link inside text of another colour (a note, an alert), and `default` for a cluster of parts
     *  that reads as one fact (a rating), in body text with its underline on hover. */
    tone?: keyof typeof linkRecipe;
    /** Called with the `href` on a plain left click, in place of the browser's navigation, for the app's router; a
     *  modified click (new tab, download) is left to the browser. */
    onNavigate?: (href: string) => void;
}

type LinkBaseProps = LinkProps & Pick<NinnaLinkProps, 'className' | 'style'>;

/** The stretched link's look is fixed, never a class of the caller's. */
export interface LinkOverlayProps extends Omit<NinnaLinkOverlayProps, 'className' | 'style' | 'color'> {
    /** Where the whole box goes. */
    href?: string;
    /** The link's text, usually the box's title. */
    children?: ReactNode;
    /** Opens in a new tab, safely, and is left to the browser. */
    external?: boolean;
    /** Called with the `href` on a plain left click, in place of the browser's navigation, for the app's router. */
    onNavigate?: (href: string) => void;
}

type LinkOverlayBaseProps = LinkOverlayProps & Pick<NinnaLinkOverlayProps, 'className' | 'style'>;

/** The box's look comes from what it holds, never a class of the caller's. */
export interface LinkBoxProps extends Omit<NinnaLinkBoxProps, 'className' | 'style' | 'color'> {
    /** The element it renders: a `div` (the default), or a landmark such as `article` or `li`'s content. */
    as?: NinnaLinkBoxProps['as'];
    /** The box's content: a `LinkOverlay` for its one destination, and any secondary links or buttons. */
    children?: ReactNode;
}

type LinkBoxBaseProps = LinkBoxProps & Pick<NinnaLinkBoxProps, 'className' | 'style'>;

/** The link box for the design system's own compositions, which may fit it to their layout with a class. */
export function LinkBoxBase({ className = '', ...props }: LinkBoxBaseProps) {
    return (
        <NinnaLinkBox
            {...props}
            className={`isolate [&_:is(a,button):not([data-slot=link-overlay]):not([data-slot=action-overlay])]:relative [&_:is(a,button):not([data-slot=link-overlay]):not([data-slot=action-overlay])]:z-10 ${className}`}
        />
    );
}

/** A box, such as a card, that one link covers: secondary links and buttons inside it stay above that link. */
export function LinkBox(props: LinkBoxProps) {
    return <LinkBoxBase {...props} />;
}

/** The stretched link for the design system's own compositions, which may fit it to their layout with a class. */
export const LinkOverlayBase = forwardRef<HTMLAnchorElement, LinkOverlayBaseProps>(
    ({ onNavigate, onClick, className = '', ...props }, ref) => (
        <NinnaLinkOverlay
            {...tabbable}
            {...props}
            ref={ref}
            className={`focus-ring-stretched before:z-1 before:rounded-[inherit] ${className}`}
            onClick={navigationClick({ ...props, onClick, onNavigate })}
        />
    ),
);

LinkOverlayBase.displayName = 'LinkOverlayBase';

/** A box's one link, stretched over the whole of its `LinkBox`, focus ring and all. */
export const LinkOverlay = forwardRef<HTMLAnchorElement, LinkOverlayProps>((props, ref) => (
    <LinkOverlayBase ref={ref} {...props} />
));

LinkOverlay.displayName = 'LinkOverlay';

/** The link for the design system's own compositions, which may fit it to their layout with a class. */
export const LinkBase = forwardRef<HTMLAnchorElement, LinkBaseProps>(
    (
        { variant = 'body', tone = 'accent', arrow = false, children, onNavigate, onClick, className = '', ...props },
        ref,
    ) => (
        <NinnaLink
            {...tabbable}
            {...props}
            ref={ref}
            size={variant === 'caption' ? 'xs' : 'sm'}
            underline="none"
            className={`${linkRecipe[tone]} ${className}`}
            onClick={navigationClick({ ...props, onClick, onNavigate })}
        >
            {children}
            {arrow ? <span aria-hidden="true">{' →'}</span> : null}
        </NinnaLink>
    ),
);

LinkBase.displayName = 'LinkBase';

/** Lar's link: accent, muted or the surrounding colour, handing a plain click to the app's router with `onNavigate`. */
export const Link = forwardRef<HTMLAnchorElement, LinkProps>((props, ref) => <LinkBase ref={ref} {...props} />);

Link.displayName = 'Link';

function navigationClick({
    href,
    onNavigate,
    onClick,
    external,
    target,
    download,
}: LinkOverlayBaseProps): LinkBaseProps['onClick'] {
    return (event) => {
        if (onNavigate) event.stopPropagation();

        onClick?.(event);

        if (
            !onNavigate ||
            !href ||
            event.defaultPrevented ||
            event.button !== 0 ||
            event.metaKey ||
            event.ctrlKey ||
            event.shiftKey ||
            event.altKey ||
            external ||
            (target && target !== '_self') ||
            (download !== undefined && download !== false)
        )
            return;

        event.preventDefault();
        onNavigate(href);
    };
}

const inline = `focus-ring ${linkRecipe.inherit}`;

/** A link inside running text or a note: the surrounding size and colour, underlined. With `onClick` in place of
 *  `href` it is a button with the same look, such as "Change" after what was kept, and can be `disabled`. */
export function InlineLink(
    props:
        | {
              /** Where it goes, in a new tab. */
              href: string;
              /** The link's text. */
              children?: ReactNode;
          }
        | {
              /** Makes it a button with the link's look, which calls this. */
              onClick: () => void;
              /** Holds the button. */
              disabled?: boolean | undefined;
              /** The button's text. */
              children?: ReactNode;
          },
) {
    if ('onClick' in props)
        return (
            <button {...tabbable} type="button" disabled={props.disabled} onClick={props.onClick} className={inline}>
                {props.children}
            </button>
        );

    return (
        <a {...tabbable} href={props.href} target="_blank" rel="noreferrer" className={inline}>
            {props.children}
        </a>
    );
}
