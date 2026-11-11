import { type ReactNode, useLayoutEffect, useRef } from 'react';

import { GlassBarBase } from './GlassBar';
import { useScrolled } from './useScrolled';

interface AppShellProps {
    /** The page under the header, which holds the main landmark: a PageLayout, or ContentContainer `as="main"`. */
    children: ReactNode;
    /** The app's title bar, which sticks to the top as glass. */
    header: ReactNode;
    /** What scrolls: `document` (the default), the page itself, for a web app (Safari tints its toolbar to match); or
     *  `contained`, a desktop window's: the shell fills the window and its own scroller holds the bar and the
     *  content, so nothing but the content ever scrolls (no rubber band past the window). */
    scroll?: 'document' | 'contained';
    /** `contained` only: what sits over the app, outside the scroller, so it never scrolls with it and its
     *  announcements sit apart from the page, such as dialogs, live regions and notifications. */
    overlays?: ReactNode;
    /** `contained` only, in a macOS window with a hidden-inset title bar, whose traffic lights macOS draws over the
     *  bar's start: the bar starts past them (74px, so the lockup sits 90px in). Off while full screen hides them, and
     *  outside such a window. */
    trafficLights?: boolean;
}

/** A desktop window's bar drags the window, except on its controls. A browser ignores it. */
const dragRegion =
    'select-none [-webkit-app-region:drag] [&_:is(button,a,input,select,textarea,[tabindex])]:[-webkit-app-region:no-drag]';

/** The bar's start past macOS's traffic lights (16px in, three 12px lights 8px apart, centred in the 52px bar). */
const pastTrafficLights = 'pl-18.5';

/** The page frame: a column whose header sticks to the top as glass and whose content passes under it, blurred, with
 *  the bar's hairline once it has scrolled, as on t3.codes. The bar and the content share one 16px gutter
 *  (`px-gutter-app`). A web app lets the document scroll; a desktop window (`scroll="contained"`) fills the window and
 *  scrolls its own main area, and its bar drags the window. Either way `--lar-header-height` holds the bar's height
 *  for anything that sticks under it. */
export function AppShell({ children, header, scroll = 'document', overlays, trafficLights = false }: AppShellProps) {
    const shell = useRef<HTMLDivElement>(null);
    const headerContainer = useRef<HTMLDivElement>(null);
    const scroller = useRef<HTMLDivElement>(null);
    const contained = scroll === 'contained';
    // The document, or the contained scroller once it has mounted.
    const scrolled = useScrolled(contained ? scroller : undefined);

    useLayoutEffect(() => {
        const container = headerContainer.current;
        const root = shell.current;

        if (!container || !root) return;

        const measure = () => {
            root.style.setProperty('--lar-header-height', `${container.getBoundingClientRect().height}px`);
        };
        const observer = new ResizeObserver(measure);

        observer.observe(container);
        measure();

        return () => observer.disconnect();
    }, []);

    if (contained)
        return (
            <div
                ref={shell}
                data-app-shell="contained"
                className="bg-surface-page text-fg fixed inset-0 flex min-w-0 flex-col"
            >
                <div
                    ref={scroller}
                    data-scrolled={scrolled || undefined}
                    // The page itself, which scrolls under the bar's glass: no edge fade.
                    data-scroll-fade="exempt"
                    data-slot="app-shell-scroller"
                    className="flex min-h-0 min-w-0 flex-1 flex-col overflow-y-auto overscroll-contain"
                >
                    <GlassBarBase
                        ref={headerContainer}
                        scrolled={scrolled}
                        data-traffic-lights={trafficLights || undefined}
                        className={`${dragRegion} ${trafficLights ? pastTrafficLights : ''}`}
                    >
                        {header}
                    </GlassBarBase>
                    {children}
                </div>
                {overlays}
            </div>
        );

    return (
        <div
            ref={shell}
            className="flex min-h-dvh min-w-0 flex-col pr-[env(safe-area-inset-right)] pl-[env(safe-area-inset-left)]"
        >
            <GlassBarBase ref={headerContainer} scrolled={scrolled}>
                {header}
            </GlassBarBase>
            {children}
        </div>
    );
}
