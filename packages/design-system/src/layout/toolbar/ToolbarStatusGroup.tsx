import type { HTMLAttributes } from 'react';

import { InlineBase } from '../Flow';

type ToolbarStatusGroupProps = Omit<HTMLAttributes<HTMLDivElement>, 'className' | 'color' | 'style'> & {
    /** The toolbar's status items, such as ToolbarStatusItem's. */
    children?: HTMLAttributes<HTMLDivElement>['children'];
};

/** A row of toolbar status items, tight on a phone and spaced from sm by the title bar's own 8px step. */
export function ToolbarStatusGroup(props: ToolbarStatusGroupProps) {
    return <InlineBase align="center" justify="start" {...props} className="h-8 shrink-0 gap-0 sm:gap-2" />;
}
