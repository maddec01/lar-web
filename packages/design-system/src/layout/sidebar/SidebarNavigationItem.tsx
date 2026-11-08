import { cloneElement, type ComponentPropsWithoutRef, isValidElement } from 'react';

import { StatusIndicatorBase } from '../../feedback/StatusIndicator';
import { tabbable } from '../../foundations/KeyboardFocus';

type SidebarNavigationItemProps = Omit<ComponentPropsWithoutRef<'button'>, 'className' | 'color' | 'style' | 'type'> & {
    /** The page shown now: selected, marked as the current page and scrolled into view. */
    active?: boolean;
    /** Styles its only child, such as a router link, instead of wrapping it in a second tab stop. */
    asChild?: boolean;
    /** Something on that page needs attention, said to screen readers and shown as a warning light. */
    notification?: string;
};

export function SidebarNavigationItem({
    active = false,
    asChild = false,
    children,
    notification,
    ...props
}: SidebarNavigationItemProps) {
    const item = {
        ...tabbable,
        'aria-current': active ? ('page' as const) : undefined,
        'aria-description': notification,
        className: `flex h-8 shrink-0 items-center gap-2 rounded-md px-2 text-sm transition-colors focus-ring-inset [&>svg]:size-4 ${active ? 'bg-fill-selected font-medium text-fg [&>svg]:text-fg' : 'text-fg-soft hover:bg-fill-hover hover:text-fg [&>svg]:text-fg-muted'}`,
    };

    const indicator = notification ? <StatusIndicatorBase tone="warning" size="sm" className="ml-auto" /> : null;

    if (asChild && isValidElement<ComponentPropsWithoutRef<'button'>>(children)) {
        return cloneElement(children, item, children.props.children, indicator);
    }

    return (
        <button {...props} {...item} type="button">
            {children}
            {indicator}
        </button>
    );
}
