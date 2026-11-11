import type { HTMLAttributes } from 'react';

import { InlineBase } from '../Flow';

type ToolbarStatusGroupProps = Omit<HTMLAttributes<HTMLDivElement>, 'className' | 'color' | 'style'> & {
    /** The toolbar's status items, such as ToolbarStatusItem's. */
    children?: HTMLAttributes<HTMLDivElement>['children'];
};

/** One row in the bar: folded into the TitleBar's status popover (under 40rem) the group is as wide as the popover
 *  and its items wrap onto further lines, rather than running out of it. */
const folded =
    'in-data-toolbar-overflow:h-auto in-data-toolbar-overflow:min-h-7 in-data-toolbar-overflow:min-w-0 in-data-toolbar-overflow:shrink in-data-toolbar-overflow:flex-wrap';

/** A row of toolbar status items (ToolbarStatusItem buttons or ToolbarCounters) on the title bar's own 8px step, in
 *  its `status` slot. Folded into the bar's status popover, its items wrap. */
export function ToolbarStatusGroup(props: ToolbarStatusGroupProps) {
    return <InlineBase align="center" justify="start" {...props} className={`h-7 shrink-0 gap-2 ${folded}`} />;
}
