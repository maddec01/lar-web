import type { ReactNode } from 'react';

import { StatusIndicator, type StatusTone } from '../feedback/StatusIndicator';
import { tabbable } from '../foundations/KeyboardFocus';
import { Inline } from '../layout/Flow';
import { Text } from '../typography/Typography';

interface StatTileProps {
    label: string;
    onClick: () => void;
    selected: boolean;
    tone: StatusTone;
    value: ReactNode;
}

/** A count with a label that doubles as a toggle filter. */
export function StatTile({ label, onClick, selected, tone, value }: StatTileProps) {
    return (
        <button
            {...tabbable}
            type="button"
            aria-pressed={selected}
            className={`focus-visible:outline-primary flex flex-col items-start gap-2 rounded-lg border p-4 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 ${
                selected ? 'border-primary bg-primary/5' : 'border-base-300 bg-base-100/60 hover:border-base-300'
            }`}
            onClick={onClick}
        >
            <Inline align="center" space="related">
                <StatusIndicator size="sm" tone={tone} />
                <Text as="span" variant="label">
                    {label}
                </Text>
            </Inline>
            <Text as="span" variant="metric">
                {value}
            </Text>
        </button>
    );
}
