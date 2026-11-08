import { LayoutGridIcon, TableIcon } from 'lucide-react';
import { type ReactNode, useCallback, useRef } from 'react';

import { IconButtonBase } from '../actions/IconButton';
import { tabbable } from '../foundations/KeyboardFocus';
import { useScrollFade } from '../overlays/useScrollFade';
import { useRevealSelection } from './useRevealSelection';

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
 * A group of icon buttons that picks one way of drawing a view, the picked one raised. `size="sm"` draws 24px buttons with
 * 14px icons, for a row's line. As `text`, each button is its label in small type, such as a dialog's panes in its
 * header.
 */
export function ViewToggle<V extends string>({
    label,
    options,
    value,
    onChange,
    size = 'md',
    presentation = 'icons',
}: {
    /** Names the group; with none, the group is named by its options alone. */
    label?: string;
    /** The ways to draw the view, each with its icon and label. */
    options: readonly ViewToggleOption<V>[];
    /** The way the view is drawn now. */
    value: V;
    /** Called with the way the reader picks. */
    onChange: (view: V) => void;
    /** 24px buttons with 14px icons, for a row's line. */
    size?: 'sm' | 'md';
    /** `icons` (the default) shows icons named by their labels; `text` shows the labels. */
    presentation?: 'icons' | 'text';
}) {
    const row = useRef<HTMLDivElement>(null);
    const { setViewport, className: fade } = useScrollFade({ axis: 'horizontal' });
    const attachRow = useCallback(
        (element: HTMLDivElement | null) => {
            row.current = element;
            setViewport(element);
        },
        [setViewport],
    );

    useRevealSelection(row, value);

    if (presentation === 'text')
        return (
            <div
                ref={attachRow}
                role="group"
                aria-label={label}
                className={`bg-fill-muted flex max-w-full min-w-0 gap-0.5 overflow-x-auto overflow-y-hidden rounded-lg p-0.5 ${fade}`}
            >
                {options.map((option) => (
                    <button
                        key={option.value}
                        {...tabbable}
                        {...option.attributes}
                        type="button"
                        aria-pressed={value === option.value}
                        disabled={option.disabled}
                        onClick={() => onChange(option.value)}
                        className={`focus-ring h-7 shrink-0 rounded-md px-2.5 text-xs font-medium whitespace-nowrap ${value === option.value ? 'bg-surface-raised text-fg shadow-(--shadow-raised)' : 'hover:text-fg text-fg-muted'}`}
                    >
                        {option.label}
                    </button>
                ))}
            </div>
        );

    return (
        <div
            ref={attachRow}
            role="group"
            aria-label={label}
            className={`bg-fill-muted flex max-w-full min-w-0 gap-0.5 overflow-x-auto overflow-y-hidden rounded-lg p-0.5 ${fade}`}
        >
            {options.map((option) => (
                <IconButtonBase
                    key={option.value}
                    {...option.attributes}
                    aria-label={option.label}
                    aria-pressed={value === option.value}
                    disabled={option.disabled}
                    icon={option.icon}
                    title={option.label}
                    className={buttonClasses(value === option.value, size)}
                    onClick={() => onChange(option.value)}
                    tone="neutral"
                />
            ))}
        </div>
    );
}

interface CollectionViewToggleProps {
    /** Views that can't show this collection now, offered but disabled. */
    disabledViews?: readonly CollectionView[];
    /** The grid button's accessible name, such as "Grid". */
    gridLabel: string;
    /** Names the group, such as "View". */
    label: string;
    /** Called with the view the reader picks. */
    onChange: (view: CollectionView) => void;
    /** The table button's accessible name, such as "Table". */
    tableLabel: string;
    /** The view shown now. */
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

function buttonClasses(active: boolean, size: 'sm' | 'md'): string {
    return `${size === 'sm' ? 'size-6 **:data-[slot=icon]:size-3.5' : 'size-8'} p-0 ${active ? 'bg-surface-raised text-fg shadow-(--shadow-raised)' : 'text-fg-muted'}`;
}
