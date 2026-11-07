import { LayoutGridIcon, TableIcon } from 'lucide-react';
import type { ReactNode } from 'react';

import { IconButton } from '../actions/IconButton';
import { tabbable } from '../foundations/KeyboardFocus';

export type CollectionView = 'grid' | 'table';

/** One way of drawing a view, as ViewToggle offers it: its icon, named by its label (or, as `text`, its label alone).
 *  `attributes` are `data-*` markers for its button, such as the pane it shows. */
export interface ViewToggleOption<V extends string> {
    value: V;
    label: string;
    icon?: ReactNode;
    disabled?: boolean;
    attributes?: { [name: `data-${string}`]: string };
}

/**
 * A group of icon buttons that picks one way of drawing a view, the picked one raised. `compact` draws 24px buttons with
 * 14px icons, for a row's line. As `text`, each button is its label in small type, such as a dialog's panes in its
 * header.
 */
export function ViewToggle<V extends string>({
    label,
    options,
    value,
    onChange,
    compact = false,
    presentation = 'icons',
}: {
    /** Names the group; with none, the group is named by its options alone. */
    label?: string;
    options: readonly ViewToggleOption<V>[];
    value: V;
    onChange: (view: V) => void;
    compact?: boolean;
    presentation?: 'icons' | 'text';
}) {
    if (presentation === 'text')
        return (
            <div role="group" aria-label={label} className="bg-base-200 flex gap-0.5 rounded-lg p-0.5">
                {options.map((option) => (
                    <button
                        key={option.value}
                        {...tabbable}
                        {...option.attributes}
                        type="button"
                        aria-pressed={value === option.value}
                        disabled={option.disabled}
                        onClick={() => onChange(option.value)}
                        className={`focus-visible:ring-primary h-7 rounded-md px-2.5 text-xs font-medium outline-none focus-visible:ring-2 ${value === option.value ? 'bg-base-100 text-base-content shadow-sm' : 'hover:text-base-content text-(--muted-foreground)'}`}
                    >
                        {option.label}
                    </button>
                ))}
            </div>
        );

    return (
        <div role="group" aria-label={label} className="bg-base-200/70 flex gap-0.5 rounded-lg p-0.5">
            {options.map((option) => (
                <IconButton
                    key={option.value}
                    {...option.attributes}
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
