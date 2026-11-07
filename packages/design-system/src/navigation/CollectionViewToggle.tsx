import { LayoutGridIcon, TableIcon } from 'lucide-react';
import type { ReactNode } from 'react';

import { IconButton } from '../actions/IconButton';

export type CollectionView = 'grid' | 'table';

/** One way of drawing a view, as ViewToggle offers it: its icon, named by its label. */
export interface ViewToggleOption<V extends string> {
    value: V;
    label: string;
    icon: ReactNode;
    disabled?: boolean;
}

/**
 * A group of icon buttons that picks one way of drawing a view, the picked one raised. `compact` draws 24px buttons with
 * 14px icons, for a row's line.
 */
export function ViewToggle<V extends string>({
    label,
    options,
    value,
    onChange,
    compact = false,
}: {
    /** Names the group; with none, the group is named by its options alone. */
    label?: string;
    options: readonly ViewToggleOption<V>[];
    value: V;
    onChange: (view: V) => void;
    compact?: boolean;
}) {
    return (
        <div role="group" aria-label={label} className="bg-base-200/70 flex gap-0.5 rounded-lg p-0.5">
            {options.map((option) => (
                <IconButton
                    key={option.value}
                    aria-label={option.label}
                    aria-pressed={value === option.value}
                    disabled={option.disabled}
                    icon={option.icon}
                    title={option.label}
                    className={buttonClasses(value === option.value, compact)}
                    onClick={() => onChange(option.value)}
                    tone="neutral"
                />
            ))}
        </div>
    );
}

interface CollectionViewToggleProps {
    disabledViews?: readonly CollectionView[];
    gridLabel: string;
    label: string;
    onChange: (view: CollectionView) => void;
    tableLabel: string;
    value: CollectionView;
}

export function CollectionViewToggle({
    disabledViews = [],
    gridLabel,
    label,
    onChange,
    tableLabel,
    value,
}: CollectionViewToggleProps) {
    return (
        <ViewToggle
            label={label}
            value={value}
            onChange={onChange}
            options={[
                {
                    value: 'grid',
                    label: gridLabel,
                    icon: <LayoutGridIcon />,
                    disabled: disabledViews.includes('grid'),
                },
                {
                    value: 'table',
                    label: tableLabel,
                    icon: <TableIcon />,
                    disabled: disabledViews.includes('table'),
                },
            ]}
        />
    );
}

function buttonClasses(active: boolean, compact: boolean): string {
    return `${compact ? 'size-6 **:data-[slot=icon]:size-3.5' : 'size-8'} p-0 ${active ? 'bg-base-100 text-base-content shadow-sm' : 'text-base-600'}`;
}
