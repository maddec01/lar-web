import type { ReactNode } from 'react';

import { Inline, Stack } from '../layout/Flow';
import { Text } from '../typography/Typography';

interface DeviceCardProps {
    /** A control in the top corner, for example a limit select. */
    action?: ReactNode;
    /** Beside the name, for example a status badge. */
    badge?: ReactNode;
    children: ReactNode;
    detail?: string;
    /** Below the content, past a divider, for example the device's encoder. */
    footer?: ReactNode;
    /** Dashed, for a device that is detected but cannot be used. */
    unavailable?: boolean;
    name: string;
}

/** One piece of hardware: its name and detail, a corner control and its content. */
export function DeviceCard({ action, badge, children, detail, footer, name, unavailable = false }: DeviceCardProps) {
    return (
        <article
            aria-label={name}
            className={`flex min-w-0 flex-col gap-4 rounded-lg p-4 ${
                unavailable ? 'border-base-300 border border-dashed' : 'border-base-300 bg-base-100 border shadow-xs'
            }`}
        >
            <div className="flex min-w-0 items-start justify-between gap-3">
                <Stack space="none" className="min-w-0">
                    <Inline align="center" space="related" className="min-w-0">
                        <Text as="span" variant="label" truncate title={name}>
                            {name}
                        </Text>
                        {badge}
                    </Inline>
                    {detail ? (
                        <Text as="span" variant="caption" tone="muted">
                            {detail}
                        </Text>
                    ) : null}
                </Stack>
                {action ? <div className="w-28 shrink-0">{action}</div> : null}
            </div>
            {children}
            {footer ? <div className="border-base-300 border-t pt-3">{footer}</div> : null}
        </article>
    );
}
