import { ChevronDownIcon } from 'lucide-react';
import { forwardRef, type ReactNode } from 'react';

import { Button } from '../actions/Button';
import { Badge } from '../display/Badge';
import { Checkbox } from '../forms/Checkbox';
import { Popover } from '../overlays/Popover';
import { buttonKind } from './ButtonKinds';

/** The List's filters: menus of checklists, then the active choices as chips that remove themselves, then Clear. */
export const FilterBar = forwardRef<HTMLDivElement, { children: ReactNode }>(({ children }, ref) => (
    <div ref={ref} data-item-filters className="flex flex-wrap items-center gap-1.5">
        {children}
    </div>
));

FilterBar.displayName = 'FilterBar';

interface FilterMenuProps {
    /** What the menu filters, as `data-filter`. */
    which: string;
    name: string;
    /** How many of its choices are on, after its name. */
    picked: number;
    children: ReactNode;
}

/** A filter's button, its name and how many choices are on, opening its checklist. */
export function FilterMenu({ which, name, picked, children }: FilterMenuProps) {
    return (
        <Popover>
            <Popover.Trigger asChild>
                <Button {...buttonKind('other')} data-filter={which} rightIcon={<ChevronDownIcon />}>
                    {name}
                    {picked > 0 && ` · ${picked}`}
                </Button>
            </Popover.Trigger>
            <Popover.Content side="bottom" align="start">
                {children}
            </Popover.Content>
        </Popover>
    );
}

/** A filter menu's checklist. */
export function FilterChoices({ children }: { children: ReactNode }) {
    return <div className="grid w-52 gap-0.5">{children}</div>;
}

/** One choice in a filter's checklist: its checkbox, then what it is, such as a badge. */
export function FilterChoice({
    checked,
    onToggle,
    children,
}: {
    checked: boolean;
    onToggle: () => void;
    children: ReactNode;
}) {
    return (
        <label
            data-filter-choice
            className="flex cursor-pointer items-center gap-2 rounded-md px-1.5 py-1 text-xs hover:bg-(--accent)"
        >
            <Checkbox checked={checked} onChange={onToggle} />
            {children}
        </label>
    );
}

/** An active choice as a chip, such as a badge ending in ×, which removes the choice. */
export function FilterChip({
    removeLabel,
    onRemove,
    children,
}: {
    removeLabel: string;
    onRemove: () => void;
    children: ReactNode;
}) {
    return (
        <button type="button" data-filter-chip aria-label={removeLabel} title={removeLabel} onClick={onRemove}>
            {children}
        </button>
    );
}

/** A label filter's chip face: the label in its tracker's colour, truncated, then ×. */
export function FilterLabelBadge({ label, color }: { label: string; color?: string | undefined }) {
    return (
        <Badge className="max-w-full" labelColor={color}>
            <span className="max-w-52 truncate">{label}</span>
            <span aria-hidden="true">×</span>
        </Badge>
    );
}
