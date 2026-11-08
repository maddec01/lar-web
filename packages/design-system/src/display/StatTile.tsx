import type { ReactNode } from 'react';

import { StatusIndicator, type StatusTone } from '../feedback/StatusIndicator';
import { tabbable } from '../foundations/KeyboardFocus';
import { Inline } from '../layout/Flow';
import { Text } from '../typography/Typography';

interface StatTileProps {
    /** What it counts, such as "Failed". */
    label: string;
    /** Toggles the filter it stands for. */
    onClick: () => void;
    /** Whether its filter is on (`aria-pressed`). */
    selected: boolean;
    /** The status light's tone beside the label. */
    tone: StatusTone;
    /** The count. */
    value: ReactNode;
}

/** A count with a label that doubles as a toggle filter. */
export function StatTile({ label, onClick, selected, tone, value }: StatTileProps) {
    return (
        <button
            {...tabbable}
            type="button"
            aria-pressed={selected}
            className={`focus-ring flex flex-col items-start gap-2 rounded-lg border p-4 text-left transition-colors ${
                selected ? 'border-primary bg-primary-surface' : 'surface-card hover:border-line-hover'
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
