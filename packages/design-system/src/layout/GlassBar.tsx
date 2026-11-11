import type { ReactNode, Ref } from 'react';

type DataAttributes = { [key: `data-${string}`]: string | boolean | undefined };

interface GlassBarProps extends DataAttributes {
    /** The bar's content, such as a title bar's row. */
    children: ReactNode;
    /** Whatever scrolls under the bar has left the top, which shows the bar's hairline. Without it, the bar follows
     *  the nearest `data-scrolled` above it, as a contained AppShell's scroller sets. */
    scrolled?: boolean;
    /** The bar's element, for measuring it or moving focus to it. */
    ref?: Ref<HTMLDivElement>;
}

interface GlassBarBaseProps extends GlassBarProps {
    /** The design system's own layout on the bar, such as a desktop window's drag region and its padding past the
     *  traffic lights (AppShell `scroll="contained"`). */
    className?: string;
}

/** The bar for the design system's own compositions, which may fit it to their layout with a class. */
export function GlassBarBase({ children, scrolled, className = '', ref, ...data }: GlassBarBaseProps) {
    return (
        <div
            ref={ref}
            {...data}
            data-scrolled={scrolled || undefined}
            className={`glass-bar sticky top-0 z-50 shrink-0 border-b border-transparent pt-[env(safe-area-inset-top)] transition-[border-color] duration-(--motion-duration-slow) in-data-scrolled:border-(--lar-glass-bar-edge) data-scrolled:border-(--lar-glass-bar-edge) ${className}`}
        >
            {children}
        </div>
    );
}

/**
 * The one header surface of every Lar app, the glass ladder's bar tier (glass-bar): it sticks to the top of what
 * scrolls, and the content passes under it, blurred, with a hairline once it has scrolled. A marketing site's header
 * and an app's title bar both sit on it.
 */
export function GlassBar(props: GlassBarProps) {
    return <GlassBarBase {...props} />;
}
