import type { ReactNode } from 'react';

import { InlineBase, StackBase } from '../layout/Flow';
import { Text } from '../typography/Typography';

interface DeviceCardProps {
    /** A control in the top corner, for example a limit select. */
    action?: ReactNode;
    /** Beside the name: the device's state, a StatusIndicator with its word (never a tinted Badge), or a category
     *  badge. */
    badge?: ReactNode;
    /** The device's content, such as its status rows. */
    children: ReactNode;
    /** A line under the name, such as the model. */
    detail?: string;
    /** Below the content, past a divider, for example the device's encoder. */
    footer?: ReactNode;
    /** Dashed, for a device that is detected but cannot be used. */
    unavailable?: boolean;
    /** The device's name. */
    name: string;
}

/** One piece of hardware: its name and detail, a corner control and its content. */
export function DeviceCard({ action, badge, children, detail, footer, name, unavailable = false }: DeviceCardProps) {
    return (
        <article
            aria-label={name}
            // The page's one card surface (as a catalog's or a chart's); a device that can't be used is only outlined.
            className={`flex min-w-0 flex-col gap-4 rounded-xl border p-4 ${
                unavailable ? 'border-line border-dashed' : 'surface-card'
            }`}
        >
            <div className="flex min-w-0 items-start justify-between gap-3">
                <StackBase space="none" className="min-w-0">
                    <InlineBase align="center" space="related" className="min-w-0">
                        <Text as="span" variant="label" truncate title={name}>
                            {name}
                        </Text>
                        {badge}
                    </InlineBase>
                    {detail ? (
                        <Text as="span" variant="caption" tone="muted">
                            {detail}
                        </Text>
                    ) : null}
                </StackBase>
                {action ? <div className="w-28 shrink-0">{action}</div> : null}
            </div>
            {children}
            {footer ? <div className="border-line border-t pt-3">{footer}</div> : null}
        </article>
    );
}
