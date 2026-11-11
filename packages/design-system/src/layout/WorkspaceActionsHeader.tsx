import type { ReactNode } from 'react';

import { ContentContainerBase } from './ContentContainer';

interface WorkspaceActionsHeaderProps {
    /** The page's actions, at the bar's end. */
    children?: ReactNode;
    /** What the page shows, at the bar's start, such as a browse selector. */
    leading?: ReactNode;
}

/** A page's bar above its content: what it shows at the start, its actions at the end. It scrolls with the page and
 *  paints nothing of its own, so whatever lies behind the page's top (a detail hero's poster ambient) shows through. */
export function WorkspaceActionsHeader({ children, leading }: WorkspaceActionsHeaderProps) {
    return (
        <ContentContainerBase className="z-40 flex h-14 shrink-0 items-center gap-2 sm:gap-3">
            {leading ? <div className="flex min-w-0 flex-1 items-center gap-1">{leading}</div> : null}
            {children ? <div className="ml-auto shrink-0">{children}</div> : null}
        </ContentContainerBase>
    );
}
