import { ChevronDownIcon, SearchIcon } from 'lucide-react';
import { type ReactNode, useMemo, useState } from 'react';

import { Input } from '../forms/Input';
import { tabbable } from '../foundations/KeyboardFocus';
import { ScrollArea } from '../layout/ScrollArea';
import { Popover } from '../overlays/Popover';
import { CollectionBrowseTrigger } from './CollectionBrowseSelector';

export interface DrilldownBrowseItem {
    id: string;
    label: string;
}

export interface DrilldownBrowseGroup {
    id: string;
    label: string;
    items: readonly DrilldownBrowseItem[];
    loading: boolean;
    loadingLabel: string;
    noResultsLabel: string;
    /** Clears this group alone, leaving the groups it combines with. */
    allLabel: string;
    /** Long lists are searchable; short ones list every item at once. */
    searchLabel?: string;
    selectedId?: string;
    onChange: (itemId: string | undefined) => void;
}

interface DrilldownBrowseSelectorProps {
    icon?: ReactNode;
    allLabel: string;
    backLabel: string;
    disabledOptionLabel?: string;
    groups: readonly DrilldownBrowseGroup[];
    label: string;
    onClear: () => void;
}

export function DrilldownBrowseSelector({
    icon,
    allLabel,
    backLabel,
    disabledOptionLabel,
    groups,
    label,
    onClear,
}: DrilldownBrowseSelectorProps) {
    const [open, setOpen] = useState(false);
    const [groupId, setGroupId] = useState<string | null>(null);
    const [query, setQuery] = useState('');
    const group = groups.find(({ id }) => id === groupId);
    const normalizedQuery = normalizeSearch(query);
    const filteredItems = useMemo(
        () => group?.items.filter((item) => normalizeSearch(item.label).includes(normalizedQuery)) ?? [],
        [group, normalizedQuery],
    );

    const closeAndSelect = (select: () => void) => {
        select();
        setQuery('');
        setGroupId(null);
        setOpen(false);
    };

    return (
        <Popover
            open={open}
            onOpenChange={(nextOpen) => {
                setOpen(nextOpen);

                if (!nextOpen) {
                    setQuery('');
                    setGroupId(null);
                }
            }}
        >
            <Popover.Trigger asChild>
                <CollectionBrowseTrigger
                    label={label}
                    icon={icon}
                    active={groups.some(({ selectedId }) => Boolean(selectedId))}
                />
            </Popover.Trigger>
            <Popover.Content align="start" presentation="menu" sideOffset={8} width="sm">
                {!group ? (
                    <div role="menu" aria-label={label}>
                        <MenuOption
                            label={allLabel}
                            selected={groups.every(({ selectedId }) => !selectedId)}
                            onSelect={() => closeAndSelect(onClear)}
                        />
                        {disabledOptionLabel ? (
                            <MenuOption disabled label={disabledOptionLabel} selected={false} />
                        ) : null}
                        {groups.map(({ id, items, label: groupLabel, selectedId }) => (
                            <button
                                key={id}
                                {...tabbable}
                                className="hover:bg-base-200 focus-visible:outline-primary flex h-8 w-full items-center gap-2 rounded-md px-2 text-left text-sm transition-colors focus-visible:outline-2"
                                role="menuitem"
                                type="button"
                                onClick={() => setGroupId(id)}
                            >
                                <span className="min-w-0 flex-1 truncate">{groupLabel}</span>{' '}
                                {selectedId ? (
                                    <span className="text-base-600 max-w-1/2 min-w-0 truncate">
                                        {items.find((item) => item.id === selectedId)?.label}
                                    </span>
                                ) : null}
                                <span aria-hidden="true" className="size-4 shrink-0 -rotate-90 [&>svg]:size-full">
                                    <ChevronDownIcon />
                                </span>
                            </button>
                        ))}
                    </div>
                ) : (
                    <div className="space-y-2">
                        <button
                            {...tabbable}
                            className="hover:bg-base-200 focus-visible:outline-primary flex h-8 w-full items-center gap-2 rounded-md px-2 text-left text-sm transition-colors focus-visible:outline-2"
                            type="button"
                            onClick={() => {
                                setQuery('');
                                setGroupId(null);
                            }}
                        >
                            <span aria-hidden="true" className="size-4 shrink-0 rotate-90 [&>svg]:size-full">
                                <ChevronDownIcon />
                            </span>
                            {backLabel}
                        </button>
                        <div className="bg-base-200 h-px" />
                        {group.searchLabel ? (
                            <div className="relative">
                                <span className="text-base-500 pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 [&>svg]:size-full">
                                    <SearchIcon />
                                </span>
                                <Input
                                    autoFocus
                                    aria-label={group.searchLabel}
                                    className="pl-8"
                                    placeholder={group.searchLabel}
                                    size="sm"
                                    type="search"
                                    value={query}
                                    onChange={(event) => setQuery(event.target.value)}
                                />
                            </div>
                        ) : null}
                        <ScrollArea role="listbox" aria-label={group.label}>
                            {!normalizedQuery ? (
                                <ListOption
                                    label={group.allLabel}
                                    selected={!group.selectedId}
                                    onSelect={() => closeAndSelect(() => group.onChange(undefined))}
                                />
                            ) : null}
                            {group.loading ? (
                                <p className="text-base-600 px-2 py-3 text-sm">{group.loadingLabel}</p>
                            ) : null}
                            {!group.loading && filteredItems.length === 0 ? (
                                <p className="text-base-600 px-2 py-3 text-sm">{group.noResultsLabel}</p>
                            ) : null}
                            {filteredItems.map((item) => (
                                <ListOption
                                    key={item.id}
                                    label={item.label}
                                    selected={item.id === group.selectedId}
                                    onSelect={() => closeAndSelect(() => group.onChange(item.id))}
                                />
                            ))}
                        </ScrollArea>
                    </div>
                )}
            </Popover.Content>
        </Popover>
    );
}

function MenuOption({
    disabled = false,
    label,
    onSelect,
    selected,
}: {
    disabled?: boolean;
    label: string;
    onSelect?: () => void;
    selected: boolean;
}) {
    return (
        <button
            {...tabbable}
            aria-checked={selected}
            aria-disabled={disabled || undefined}
            className={`hover:bg-base-200 focus-visible:outline-primary flex h-8 w-full items-center rounded-md px-2 text-left text-sm transition-colors focus-visible:outline-2 ${
                selected ? 'bg-base-200 font-medium' : ''
            } ${disabled ? 'pointer-events-none opacity-50' : ''}`}
            disabled={disabled}
            role="menuitemradio"
            type="button"
            onClick={onSelect}
        >
            {label}
        </button>
    );
}

function ListOption({ label, onSelect, selected }: { label: string; onSelect: () => void; selected: boolean }) {
    return (
        <button
            {...tabbable}
            aria-selected={selected}
            className={`hover:bg-base-200 focus-visible:outline-primary flex h-8 w-full items-center rounded-md px-2 text-left text-sm transition-colors focus-visible:outline-2 ${
                selected ? 'bg-base-200 font-medium' : ''
            }`}
            role="option"
            type="button"
            onClick={onSelect}
        >
            {label}
        </button>
    );
}

function normalizeSearch(value: string): string {
    return value.normalize('NFKD').replace(/\p{M}/gu, '').toLocaleLowerCase().trim();
}
