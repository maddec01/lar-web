import { type ReactNode, useCallback, useLayoutEffect, useRef, useState } from 'react';

import { revealInRow } from '../../collections/useScrollRow';
import { useScrollFade } from '../../overlays/useScrollFade';
import { TextBase } from '../../typography/Typography';

interface SidebarPaneProps {
    /** The pane's groups and items. */
    children: ReactNode;
    /** Above the groups and outside their scroller, such as settings' search field: on a phone, where the groups
     *  become a sideways row that scrolls to its active item, it stays put above that row, never scrolled away or
     *  clipped with it. */
    header?: ReactNode;
    /** Names the navigation landmark. */
    label: string;
}

export function SidebarPane({ children, header, label }: SidebarPaneProps) {
    // A dialog's pane list fades at its edges like the body beside it, once it is long enough to scroll. As a phone's
    // sideways row it takes the wider 3rem fade of a row of cards: a 1.5rem one only covered the row's own padding,
    // so a cut label ("Metada") read as sliced; 3rem dissolves it, and the selected item is revealed clear of it.
    const nav = useRef<HTMLElement>(null);
    const [horizontal, setHorizontal] = useState(false);
    const { setViewport, className: scrollFadeClassName } = useScrollFade({
        axis: horizontal ? 'horizontal' : 'vertical',
        row: horizontal,
    });
    const attachNav = useCallback(
        (element: HTMLElement | null) => {
            nav.current = element;
            setViewport(element);
        },
        [setViewport],
    );

    useLayoutEffect(() => {
        const row = nav.current;

        if (!row) return;

        const reveal = () => {
            const sideways = getComputedStyle(row).flexDirection === 'row';
            const selected = row.querySelector<HTMLElement>('[aria-current=page]');

            setHorizontal(sideways);

            if (!selected) return;

            if (sideways) revealInRow(row, selected);
            else {
                const bounds = row.getBoundingClientRect();
                const active = selected.getBoundingClientRect();
                const inset = parseFloat(getComputedStyle(row).scrollPaddingTop) || 0;
                const top =
                    active.top < bounds.top + inset
                        ? active.top - bounds.top - inset
                        : active.bottom > bounds.bottom - inset
                          ? active.bottom - bounds.bottom + inset
                          : 0;

                if (top) row.scrollBy({ top, behavior: 'smooth' });
            }
        };
        const observer = new ResizeObserver(reveal);
        const mutations = new MutationObserver(reveal);

        observer.observe(row);
        mutations.observe(row, { childList: true, subtree: true, attributes: true, attributeFilter: ['aria-current'] });
        reveal();

        return () => {
            observer.disconnect();
            mutations.disconnect();
        };
    }, [horizontal]);

    return (
        <aside className="border-line flex w-full flex-col border-y md:h-full md:border-y-0 md:border-r">
            {header ? <div className="shrink-0 px-3 pt-3 md:pt-4">{header}</div> : null}
            <nav
                ref={attachNav}
                aria-label={label}
                className={`flex min-h-0 items-center gap-1 overflow-x-auto overscroll-contain p-3 md:flex-1 md:flex-col md:items-stretch md:gap-1 md:overflow-y-auto md:px-3 ${header ? 'md:pt-3 md:pb-4' : 'md:py-4'} ${horizontal ? 'scroll-px-12' : ''} ${scrollFadeClassName}`}
            >
                {children}
            </nav>
        </aside>
    );
}

interface SidebarNavigationGroupProps {
    /** The group's SidebarNavigationItems. */
    children: ReactNode;
    /** The group's heading, shown from md and naming the group for screen readers. */
    label: string;
}

export function SidebarNavigationGroup({ children, label }: SidebarNavigationGroupProps) {
    return (
        <div role="group" aria-label={label} className="flex shrink-0 gap-1 md:mb-4 md:flex-col md:last:mb-0">
            <TextBase
                as="span"
                className="hidden h-7 px-2 leading-7 font-medium md:block"
                variant="caption"
                tone="muted"
            >
                {label}
            </TextBase>
            {children}
        </div>
    );
}
