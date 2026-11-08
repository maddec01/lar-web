import type { ReactNode } from 'react';

import { ContentContainerBase } from './ContentContainer';

interface WorkspaceActionsHeaderProps {
    /** The page's actions, at the bar's end. */
    children?: ReactNode;
    /** What the page shows, at the bar's start, such as a browse selector. */
    leading?: ReactNode;
}

export function WorkspaceActionsHeader({ children, leading }: WorkspaceActionsHeaderProps) {
    return (
        <ContentContainerBase className="bg-surface-page z-40 flex h-14 shrink-0 items-center gap-2 sm:gap-3">
            {leading ? <div className="flex min-w-0 flex-1 items-center gap-1">{leading}</div> : null}
            {children ? <div className="ml-auto shrink-0">{children}</div> : null}
        </ContentContainerBase>
    );
}
