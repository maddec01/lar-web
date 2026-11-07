import { LayoutGridIcon, TableIcon } from 'lucide-react';

import { IconButton } from '../actions/IconButton';

export type CollectionView = 'grid' | 'table';

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
        <div role="group" aria-label={label} className="bg-base-200/70 flex gap-0.5 rounded-lg p-0.5">
            <IconButton
                aria-label={gridLabel}
                aria-pressed={value === 'grid'}
                disabled={disabledViews.includes('grid')}
                icon={<LayoutGridIcon />}
                title={gridLabel}
                className={buttonClasses(value === 'grid')}
                onClick={() => onChange('grid')}
                tone="neutral"
            />
            <IconButton
                aria-label={tableLabel}
                aria-pressed={value === 'table'}
                disabled={disabledViews.includes('table')}
                icon={<TableIcon />}
                title={tableLabel}
                className={buttonClasses(value === 'table')}
                onClick={() => onChange('table')}
                tone="neutral"
            />
        </div>
    );
}

function buttonClasses(active: boolean): string {
    return `size-8 p-0 ${active ? 'bg-base-100 text-base-content shadow-sm' : 'text-base-600'}`;
}
