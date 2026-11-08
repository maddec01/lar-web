import { Box } from '@ninna-ui/layout';
import type { ReactNode } from 'react';

import { StatusIndicatorBase } from '../../feedback/StatusIndicator';
import type { StatusColour } from '../../feedback/StatusState';

/** The light in the icon's corner: what the state means (`state`, preferred) or a `tone`. Neither is the quiet state:
 *  the icon alone, with nothing to report, in the same 16px box. */
type ToolbarStatusItemProps = StatusColour & {
    /** What the status is about, such as a server. */
    icon: ReactNode;
};

/** A toolbar button's icon, always in its 16px box, so the bar's icons keep one size whether or not a light is on. */
export function ToolbarStatusItem({ icon, state, tone }: ToolbarStatusItemProps) {
    const quiet = state === undefined && tone === undefined;

    return (
        <Box aria-hidden="true" className="relative size-4 shrink-0 text-(--color-header-icon) [&>svg]:size-full">
            {icon}
            {quiet ? null : (
                <StatusIndicatorBase
                    state={state}
                    tone={tone}
                    size="sm"
                    overlay
                    className="absolute -right-0.5 -bottom-0.5"
                />
            )}
        </Box>
    );
}
