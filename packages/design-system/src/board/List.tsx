import { ChevronDownIcon } from 'lucide-react';
import type { ReactNode } from 'react';

import { Button } from '../actions/Button';
import { Badge } from '../display/Badge';
import { Loading } from '../feedback/Loading';
import { SidebarNavigationItem } from '../layout/sidebar/SidebarNavigationItem';
import { DropdownMenu } from '../overlays/DropdownMenu';
import { buttonKind } from './ButtonKinds';

interface ListButtonProps {
    label: string;
    icon: ReactNode;
    /** How many items are in List; none while the first read could still add some, which shows a loading cue. */
    count: number | undefined;
    loadingLabel: string;
    onOpen: () => void;
}

/** The title bar's List button, "List <count>": an App control whose label folds away, for screen readers only, on a
 *  title bar under 70rem. */
export function ListButton({ label, icon, count, loadingLabel, onOpen }: ListButtonProps) {
    return (
        <Button {...buttonKind('control')} className="list-button px-2" leftIcon={icon} title={label} onClick={onOpen}>
            <span className="@max-[70rem]:sr-only">{label}</span>
            {count === undefined ? <Loading presentation="inline" title={loadingLabel} /> : <Badge>{count}</Badge>}
        </Button>
    );
}

/** A group in the List's left pane: its icon, its name and how many of its items match; a group still reading shows
 *  no count. */
export function ListGroupItem({
    label,
    count,
    icon,
    active,
    onPick,
}: {
    label: string;
    count?: number;
    icon: ReactNode;
    active: boolean;
    onPick: () => void;
}) {
    return (
        <SidebarNavigationItem active={active} onClick={onPick}>
            {icon}
            <span className="name min-w-0 flex-1 truncate text-left">{label}</span>
            {count !== undefined && <span className="count text-base-700 text-xs tabular-nums">{count}</span>}
        </SidebarNavigationItem>
    );
}

interface ListHeaderProps {
    /** The search field, and beside it Add item. */
    search: ReactNode;
    add: ReactNode;
    /** The chosen group's name and how many of its items show; no count while it's still reading. */
    title: string;
    count?: number;
    /** After the count: a toggle that scopes the board to the group, and at the right the sort menu. */
    scope?: ReactNode;
    sort: ReactNode;
    filters: ReactNode;
}

/** The List's right pane's head: the search with Add item, then the chosen group with its count, scope toggle and sort,
 *  then the filters. */
export function ListHeader({ search, add, title, count, scope, sort, filters }: ListHeaderProps) {
    return (
        <div className="flex shrink-0 flex-col gap-2 px-5 sm:px-6">
            <div className="flex items-center gap-2 [&>[data-slot=button]]:shrink-0">
                {search}
                {add}
            </div>
            <div className="flex min-w-0 items-center gap-2">
                <span className="text-base-content truncate text-sm font-semibold">{title}</span>
                {count !== undefined && <Badge>{count}</Badge>}
                {scope}
                <span className="sort ml-auto">{sort}</span>
            </div>
            {filters}
        </div>
    );
}

/** A menu of the ways a list sorts, its button naming the current one. */
export function ListSortMenu<Value extends string>({
    value,
    options,
    onChange,
}: {
    value: Value;
    options: readonly { value: Value; label: string }[];
    onChange: (value: Value) => void;
}) {
    return (
        <DropdownMenu>
            <DropdownMenu.Trigger asChild>
                <Button {...buttonKind('other')} rightIcon={<ChevronDownIcon />}>
                    {options.find((option) => option.value === value)?.label}
                </Button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content align="end">
                <DropdownMenu.RadioGroup
                    value={value}
                    onValueChange={(next) => {
                        const picked = options.find((option) => option.value === next);

                        if (picked) onChange(picked.value);
                    }}
                >
                    {options.map((option) => (
                        <DropdownMenu.RadioItem key={option.value} value={option.value}>
                            {option.label}
                        </DropdownMenu.RadioItem>
                    ))}
                </DropdownMenu.RadioGroup>
            </DropdownMenu.Content>
        </DropdownMenu>
    );
}

interface ListItemRowProps {
    /** The item's id, as `data-item`. */
    item: string;
    /** Its title in full, for the tooltip. */
    name: string;
    onOpen: () => void;
    /** Where the item comes from. */
    source: ReactNode;
    /** The ticket's reference, such as "#61", before the title; none for an item with no ticket. */
    reference?: string;
    title: string;
    /** The repository's icon, when the list mixes repositories, and the meta line's text: its name and age. */
    repoIcon?: ReactNode;
    meta: string;
    /** After the meta line: the item's kind, labels and sync state. */
    chips?: ReactNode;
    /** More under the meta line, such as a work item's fields. */
    details?: ReactNode;
}

/** An item in the List's right pane, opening the item dialog. */
export function ListItemRow({
    item,
    name,
    onOpen,
    source,
    reference,
    title,
    repoIcon,
    meta,
    chips,
    details,
}: ListItemRowProps) {
    return (
        <button
            type="button"
            onClick={onOpen}
            data-item={item}
            title={name}
            className="hover:bg-base-200/70 focus-visible:outline-primary flex w-full min-w-0 items-start gap-2 rounded-md px-2 py-1.5 text-left focus-visible:outline-2 focus-visible:-outline-offset-2"
        >
            {source}
            <span className="min-w-0 flex-1">
                <span className="text-base-content block truncate text-[13px] leading-5 font-medium">
                    {reference ? <span className="text-base-700 font-normal">{reference} </span> : null}
                    {title}
                </span>
                <span className="flex min-w-0 flex-wrap items-center gap-x-1.5 gap-y-1">
                    <span className="text-base-700 me-1 flex min-w-0 items-center gap-1 text-[11px] leading-4">
                        {repoIcon}
                        <span className="min-w-0 truncate tabular-nums">{meta}</span>
                    </span>
                    {chips}
                </span>
                {details}
            </span>
        </button>
    );
}

/** What the List says in place of items: nothing matches, nothing in List, or still loading. With `reading`, it
 *  follows items as more may arrive. */
export function ListNote({ children, reading = false }: { children: ReactNode; reading?: boolean }) {
    return (
        <p className={`text-base-700 m-0 p-4 text-sm ${reading ? '' : 'empty'}`} data-reading={reading || undefined}>
            {children}
        </p>
    );
}
