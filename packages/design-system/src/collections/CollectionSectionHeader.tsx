import type { ReactNode } from 'react';

import { TextBase } from '../typography/Typography';

export function CollectionSectionHeader({
    children,
}: {
    /** The section's label, such as an album's disc or a letter of the alphabet. */
    children: ReactNode;
}) {
    return (
        <div className="border-line bg-surface-raised/65 flex h-10 items-center border-b px-3" role="presentation">
            <TextBase as="span" className="shrink-0" variant="label">
                {children}
            </TextBase>
        </div>
    );
}
