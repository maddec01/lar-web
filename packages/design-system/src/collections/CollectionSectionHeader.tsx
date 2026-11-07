import type { ReactNode } from 'react';

import { Text } from '../typography/Typography';

export function CollectionSectionHeader({ children }: { children: ReactNode }) {
    return (
        <div className="border-base-300 bg-base-100/65 flex h-10 items-center border-b px-3" role="presentation">
            <Text as="span" className="shrink-0 tracking-[0.12em]" variant="overline">
                {children}
            </Text>
        </div>
    );
}
