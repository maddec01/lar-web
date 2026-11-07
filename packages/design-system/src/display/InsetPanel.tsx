import type { ReactNode } from 'react';

import { tabbable } from '../foundations/KeyboardFocus';
import { Stack } from '../layout/Flow';

interface InsetPanelProps {
    children: ReactNode;
    onClick?: () => void;
    presentation?: 'default' | 'settings';
}

/**
 * A neutral surface that groups related content without adding message or status meaning.
 * Use Alert for current status, InfoBox for optional guidance, and NoticeCard for a decision item.
 */
export function InsetPanel({ children, onClick, presentation = 'default' }: InsetPanelProps) {
    if (presentation === 'settings') {
        return (
            <div className="divide-base-300 border-base-300 bg-base-100 divide-y overflow-hidden rounded-lg border shadow-xs/5">
                {children}
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
            className={`border-base-300 bg-base-100 rounded-lg border p-5 ${onClick ? 'focus-visible:outline-primary w-full cursor-pointer text-left focus-visible:outline-2 focus-visible:outline-offset-2' : ''}`}
        >
            {children}
        </Stack>
    );
}
