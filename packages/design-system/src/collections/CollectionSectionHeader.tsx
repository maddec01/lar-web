import type { ReactNode } from 'react';

import { Count } from '../display/Count';

/** A section's header inside a list (an album's disc, a letter of the alphabet): the same anatomy as a Panel's header
 *  and a SectionTitle, a 40px line with the label at 14/600 and its count at 14/400 muted, over the list's hairline. */
export function CollectionSectionHeader({
    children,
    count,
    countLabel,
}: {
    /** The section's label, such as an album's disc or a letter of the alphabet. */
    children: ReactNode;
    /** How many rows the section holds, as a plain muted figure after the label. */
    count?: number;
    /** The count in words for screen readers, such as "12 tracks". */
    countLabel?: string;
}) {
    return (
        <div
            className="border-line text-fg flex h-10 min-w-0 items-center gap-2 border-b px-3 text-sm leading-5 font-semibold"
            role="presentation"
        >
            <span className="min-w-0 truncate">{children}</span>
            <Count count={count} label={countLabel} />
        </div>
    );
}
