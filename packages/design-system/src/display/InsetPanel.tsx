import type { ReactNode } from 'react';

import { FormRowsContext } from '../forms/FormRows';
import { tabbable } from '../foundations/KeyboardFocus';
import { Stack } from '../layout/Flow';

interface InsetPanelProps {
    /** The panel's content. */
    children: ReactNode;
    /** Makes the whole panel a button that calls this. */
    onClick?: () => void;
    /** `default` groups content in a panel (a card when it is a button); `settings` is a settings group's panel of
     *  rows, divided by lines. */
    presentation?: 'default' | 'settings';
    /** Under a `settings` panel's rows, on the sunken surface: the group's own action, such as an add button. */
    footer?: ReactNode;
}

/**
 * A neutral surface that groups related content without adding message or status meaning.
 * Use Alert for current status, InfoBox for optional guidance, and NoticeCard for a decision item.
 */
export function InsetPanel({ children, onClick, presentation = 'default', footer }: InsetPanelProps) {
    if (presentation === 'settings') {
        return (
            <div className="divide-line surface-panel divide-y overflow-hidden rounded-xl border">
                <FormRowsContext value="panel">{children}</FormRowsContext>
                {footer && <div className="bg-surface-sunken px-4 py-2">{footer}</div>}
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
            className={`rounded-xl border p-5 ${onClick ? 'surface-card hover:border-line-hover focus-ring w-full cursor-pointer text-left transition-colors' : 'surface-panel'}`}
        >
            {children}
        </Stack>
    );
}
