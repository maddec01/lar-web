import { type ReactNode, useEffect, useLayoutEffect, useRef, useState } from 'react';

interface AppShellProps {
    children: ReactNode;
    header: ReactNode;
}

/** The page frame: a column whose header sticks to the top as glass. The document itself
 *  scrolls, so content passes under the header and Safari tints its toolbar to match. The header's hairline
 *  appears once the page has scrolled, as on t3.codes. */
export function AppShell({ children, header }: AppShellProps) {
    const shell = useRef<HTMLDivElement>(null);
    const headerContainer = useRef<HTMLDivElement>(null);
    const scrolled = useDocumentScrolled();

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
            <div
                ref={headerContainer}
                data-scrolled={scrolled || undefined}
                className="glass-bar data-scrolled:border-base-300 sticky top-0 z-50 shrink-0 border-b border-transparent pt-[env(safe-area-inset-top)] transition-[border-color] duration-300"
            >
                {header}
            </div>
            {children}
        </div>
    );
}

function useDocumentScrolled() {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const update = () => setScrolled(window.scrollY > 2);

        update();
        window.addEventListener('scroll', update, { passive: true });

        return () => window.removeEventListener('scroll', update);
    }, []);

    return scrolled;
}
