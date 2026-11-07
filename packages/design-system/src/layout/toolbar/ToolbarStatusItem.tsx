import { Box } from '@ninna-ui/layout';
import type { ReactNode } from 'react';

import { StatusIndicator, type StatusTone } from '../../feedback/StatusIndicator';

interface ToolbarStatusItemProps {
    icon: ReactNode;
    tone: StatusTone;
}

export function ToolbarStatusItem({ icon, tone }: ToolbarStatusItemProps) {
    return (
        <Box aria-hidden="true" className="relative size-4 shrink-0 text-(--color-header-icon) [&>svg]:size-full">
            {icon}
            <StatusIndicator tone={tone} size="sm" className="absolute -right-0.5 -bottom-0.5" />
        </Box>
    );
}
