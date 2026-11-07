import type { ReactNode } from 'react';

import { ContentContainer } from './ContentContainer';

interface WorkspaceActionsHeaderProps {
    children?: ReactNode;
    leading?: ReactNode;
}

export function WorkspaceActionsHeader({ children, leading }: WorkspaceActionsHeaderProps) {
    return (
        <ContentContainer className="bg-base-50 z-40 flex h-14 shrink-0 items-center gap-2 sm:gap-3">
            {leading ? <div className="flex min-w-0 flex-1 items-center gap-1">{leading}</div> : null}
            {children ? <div className="ml-auto shrink-0">{children}</div> : null}
        </ContentContainer>
    );
}
