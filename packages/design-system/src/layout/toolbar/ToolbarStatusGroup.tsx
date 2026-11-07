import type { HTMLAttributes } from 'react';

import { Inline } from '../Flow';

type ToolbarStatusGroupProps = Omit<HTMLAttributes<HTMLDivElement>, 'className'>;

export function ToolbarStatusGroup(props: ToolbarStatusGroupProps) {
    return <Inline align="center" justify="start" {...props} className="h-8 shrink-0 gap-0 sm:gap-2 sm:px-1" />;
}
