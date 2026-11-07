import {
    Link as NinnaLink,
    LinkBox as NinnaLinkBox,
    type LinkBoxProps,
    LinkOverlay as NinnaLinkOverlay,
    type LinkOverlayProps as NinnaLinkOverlayProps,
    type LinkProps as NinnaLinkProps,
} from '@ninna-ui/primitives';
import { forwardRef, type ReactNode } from 'react';

import { tabbable } from '../foundations/KeyboardFocus';

export type LinkProps = Omit<NinnaLinkProps, 'size' | 'color'> & {
    variant?: 'body' | 'caption';
    onNavigate?: (href: string) => void;
};

export type LinkOverlayProps = NinnaLinkOverlayProps & Pick<LinkProps, 'onNavigate'>;

/** Keep secondary links and buttons above the stretched primary link or action. */
export function LinkBox({ className = '', ...props }: LinkBoxProps) {
    return (
        <NinnaLinkBox
            {...props}
            className={`isolate [&_:is(a,button):not([data-slot=link-overlay]):not([data-slot=action-overlay])]:relative [&_:is(a,button):not([data-slot=link-overlay]):not([data-slot=action-overlay])]:z-10 ${className}`}
        />
    );
}

export const LinkOverlay = forwardRef<HTMLAnchorElement, LinkOverlayProps>(
    ({ onNavigate, onClick, className = '', ...props }, ref) => (
        <NinnaLinkOverlay
            {...tabbable}
            {...props}
            ref={ref}
            className={`focus-visible:before:outline-primary before:z-1 before:rounded-[inherit] focus-visible:outline-none focus-visible:before:outline-2 focus-visible:before:-outline-offset-2 ${className}`}
            onClick={navigationClick({ ...props, onClick, onNavigate })}
        />
    ),
);

LinkOverlay.displayName = 'LinkOverlay';

export const Link = forwardRef<HTMLAnchorElement, LinkProps>(
    ({ variant = 'body', onNavigate, onClick, ...props }, ref) => (
        <NinnaLink
            {...tabbable}
            {...props}
            ref={ref}
            size={variant === 'caption' ? 'xs' : 'sm'}
            underline="hover"
            onClick={navigationClick({ ...props, onClick, onNavigate })}
        />
    ),
);

Link.displayName = 'Link';

function navigationClick({
    href,
    onNavigate,
    onClick,
    external,
    target,
    download,
}: LinkOverlayProps): LinkProps['onClick'] {
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

const inline =
    'focus-visible:outline-primary text-inherit underline decoration-current/40 underline-offset-2 transition-colors hover:decoration-current focus-visible:outline-2';

/** A link inside running text or a note: the surrounding size and colour, underlined. */
export function InlineLink({ href, children }: { href: string; children?: ReactNode }) {
    return (
        <a {...tabbable} href={href} target="_blank" rel="noreferrer" className={inline}>
            {children}
        </a>
    );
}

/** A button inside running text or a note, such as "Change" after what was kept: InlineLink's look. */
export function InlineButton({
    onClick,
    disabled,
    children,
}: {
    onClick: () => void;
    disabled?: boolean | undefined;
    children: ReactNode;
}) {
    return (
        <button {...tabbable} type="button" disabled={disabled} onClick={onClick} className={inline}>
            {children}
        </button>
    );
}
