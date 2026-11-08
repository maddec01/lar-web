import { LockIcon } from 'lucide-react';
import type { ReactNode } from 'react';

import { StatusIndicator } from '../feedback/StatusIndicator';
import { BadgeBase as Badge } from './Badge';

type DataAttributes = { [key: `data-${string}`]: string | undefined };

interface LabelChipProps extends DataAttributes {
    /** The label's name, truncating, which its tooltip gives whole. */
    label: string;
    /** The tracker's colour as a small dot; the chip's surface and text stay neutral. */
    color?: string | undefined;
    /** Follows the name, faded, such as "new" for a label still to be created. */
    note?: ReactNode;
    /** A lock before the name, for a label that can't be edited here; `lockedLabel` says why. */
    locked?: boolean;
    /** Why the label is locked, as the lock's name and the chip's tooltip. */
    lockedLabel?: string;
    /** A × after the name, for a chip inside a control that removes it, such as an active filter's. */
    removable?: boolean;
    /** Its own × button, which `removeLabel` names, that removes the label. */
    onRemove?: () => void;
    /** Names the × button for screen readers, such as "Remove bug". */
    removeLabel?: string;
    /** Holds the × button, such as while the form around it saves. */
    disabled?: boolean;
}

/** A label as a neutral chip with its tracker's colour dot: its name truncating, then any note, and a lock or a × that
 *  removes it. */
export function LabelChip({
    label,
    color,
    note,
    locked = false,
    lockedLabel,
    removable = false,
    onRemove,
    removeLabel,
    disabled = false,
    ...data
}: LabelChipProps) {
    return (
        <Badge data-label-chip="" {...data} title={locked ? lockedLabel : undefined} className="max-w-full min-w-0">
            {color && /^#?([0-9a-f]{6})$/i.test(color) && (
                <StatusIndicator size="sm" tone="neutral" labelColor={`#${color.replace(/^#/, '')}`} />
            )}
            {locked && <LockIcon aria-label={lockedLabel} />}
            <span className="max-w-52 truncate" title={label}>
                {label}
            </span>
            {note && (
                <>
                    {' '}
                    <span className="font-normal">{note}</span>
                </>
            )}
            {onRemove ? (
                <button
                    type="button"
                    className="cursor-pointer bg-transparent p-0"
                    aria-label={removeLabel}
                    disabled={disabled}
                    onClick={onRemove}
                >
                    ×
                </button>
            ) : (
                removable && <span aria-hidden="true">×</span>
            )}
        </Badge>
    );
}
