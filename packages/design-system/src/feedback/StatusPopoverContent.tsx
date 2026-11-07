import { Box } from '@ninna-ui/layout';
import { Popover } from '@ninna-ui/overlays';
import type { ReactNode } from 'react';

import { Badge } from '../display/Badge';
import { Inline, Stack } from '../layout/Flow';
import { Text } from '../typography/Typography';
import { type StatusTone } from './StatusIndicator';

interface StatusPopoverContentProps {
    children: ReactNode;
    detail?: string;
    status: string;
    title: string;
    tone: StatusTone;
    width?: 'sm' | 'md';
}

const widthClasses: Record<NonNullable<StatusPopoverContentProps['width']>, string> = {
    sm: 'w-72',
    md: 'w-80',
};

export function StatusPopoverContent({
    children,
    detail,
    status,
    title,
    tone,
    width = 'sm',
}: StatusPopoverContentProps) {
    return (
        <Popover.Content side="bottom" align="end" sideOffset={8} className={`${widthClasses[width]} p-0`}>
            <Box className="border-base-300 border-b p-4">
                <Inline align="center" justify="between" space="group">
                    <Stack space="none">
                        <Text as="span" variant="label">
                            {title}
                        </Text>
                        {detail ? (
                            <Text as="span" variant="caption" tone="muted">
                                {detail}
                            </Text>
                        ) : null}
                    </Stack>
                    <Badge tone={tone}>{status}</Badge>
                </Inline>
            </Box>
            <Stack space="tight" className="p-2">
                {children}
            </Stack>
        </Popover.Content>
    );
}
