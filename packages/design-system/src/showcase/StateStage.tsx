import type { ReactNode } from 'react';

import { Backdrop } from './Stage';

/** The website's page-state skin: the shared PageError/EmptyState grammar at the hero's display scale. */
export function StateStage({
    children,
}: {
    /** The page state, such as a PageError. */
    children: ReactNode;
}) {
    return (
        <section className="lar-state-stage relative isolate">
            <Backdrop />
            {children}
        </section>
    );
}
