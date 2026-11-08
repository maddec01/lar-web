import type { ReactNode } from 'react';

import { FormRowsContext } from '../forms/FormRows';
import { tabbable } from '../foundations/KeyboardFocus';
import { Stack } from '../layout/Flow';

interface InsetPanelProps {
    /** The panel's content. */
    children: ReactNode;
    /** Makes the whole panel a button that calls this. */
    onClick?: () => void;
    /** `default` groups content on the raised surface; `settings` is a settings group's panel of rows, divided by
     *  lines. */
    presentation?: 'default' | 'settings';
    /** Under a `settings` panel's rows, on the muted surface: the group's own action, such as an add button. */
    footer?: ReactNode;
}

/**
 * A neutral surface that groups related content without adding message or status meaning.
 * Use Alert for current status, InfoBox for optional guidance, and NoticeCard for a decision item.
 */
export function InsetPanel({ children, onClick, presentation = 'default', footer }: InsetPanelProps) {
    if (presentation === 'settings') {
        return (
            <div className="divide-line surface-card divide-y overflow-hidden rounded-lg border">
                <FormRowsContext value="panel">{children}</FormRowsContext>
                {footer && <div className="bg-surface-sunken rounded-b-xl px-4 py-2">{footer}</div>}
            </div>
        );
    }

    return (
        <Stack
            as={onClick ? 'button' : 'div'}
            type={onClick ? 'button' : undefined}
            tabIndex={onClick ? tabbable.tabIndex : undefined}
            onClick={onClick}
            space="related"
            className={`surface-card rounded-lg border p-5 ${onClick ? 'focus-ring w-full cursor-pointer text-left' : ''}`}
        >
            {children}
        </Stack>
    );
}
