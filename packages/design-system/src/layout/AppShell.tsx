import { type ReactNode, useLayoutEffect, useRef } from 'react';

import { GlassBar } from './GlassBar';
import { useScrolled } from './useScrolled';

interface AppShellProps {
    /** The page under the header, such as a PageLayout. */
    children: ReactNode;
    /** The app's title bar, which sticks to the top as glass. */
    header: ReactNode;
}

/** The page frame: a column whose header sticks to the top as glass. The document itself
 *  scrolls, so content passes under the header and Safari tints its toolbar to match. The header's hairline
 *  appears once the page has scrolled, as on t3.codes. */
export function AppShell({ children, header }: AppShellProps) {
    const shell = useRef<HTMLDivElement>(null);
    const headerContainer = useRef<HTMLDivElement>(null);
    const scrolled = useScrolled();

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

    return (
        <div
            ref={shell}
            className="flex min-h-dvh min-w-0 flex-col pr-[env(safe-area-inset-right)] pl-[env(safe-area-inset-left)]"
        >
            <GlassBar ref={headerContainer} scrolled={scrolled}>
                {header}
            </GlassBar>
            {children}
        </div>
    );
}
