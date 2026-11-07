// Lar Factory's Add item: the title bar's button that opens it, the New work pane's fields beside their details panel,
// the panel's labelled fields and ticket part, the Create issue choice, and the Find a ticket pane with its search.

import { SquarePenIcon } from 'lucide-react';
import type { KeyboardEvent, ReactNode, Ref } from 'react';

import { Button } from '../actions/Button';
import { FormResult } from '../feedback/FormResult';
import { FormFieldset } from '../forms/FormSection';
import { Input } from '../forms/Input';
import { tabbable } from '../foundations/KeyboardFocus';
import { buttonKind } from './ButtonKinds';
import { DetailsHeading } from './ItemDetails';

/** The title bar's Add item button, a Main action named by its `label`, which folds away, for screen readers only, on a
 *  title bar under 70rem; `title` gives it whole with its shortcut, which `keyShortcuts` names. */
export function AddItemButton({
    label,
    title,
    keyShortcuts,
    onOpen,
}: {
    label: string;
    title: string;
    keyShortcuts?: string;
    onOpen: () => void;
}) {
    return (
        <Button
            {...buttonKind('main')}
            className="add-item px-2"
            leftIcon={<SquarePenIcon />}
            title={title}
            aria-keyshortcuts={keyShortcuts}
            onClick={onOpen}
        >
            <span className="@max-[70rem]:sr-only">{label}</span>
        </Button>
    );
}

/**
 * A draft's fields as one group, which `disabled` locks: the `main` column (its title, editor and notes) beside the
 * `details` panel, which `detailsLabel` names. Narrower than 40rem the panel stacks under the main column, which then
 * grows with its text, and the two scroll as one; each row sizes to its content, so a long text pushes the panel down
 * rather than running under it.
 */
export function DraftFields({
    id,
    disabled,
    detailsLabel,
    main,
    details,
}: {
    id: string;
    disabled: boolean;
    detailsLabel: string;
    main: ReactNode;
    details: ReactNode;
}) {
    return (
        <div className="@container flex min-h-0 flex-1 flex-col">
            <FormFieldset
                id={id}
                presentation="group"
                disabled={disabled}
                className="border-base-300 grid min-h-0 flex-1 grid-cols-[minmax(0,1fr)_16rem] border-t @max-[40rem]:auto-rows-max @max-[40rem]:grid-cols-[minmax(0,1fr)] @max-[40rem]:content-start @max-[40rem]:overflow-y-auto"
            >
                <div className="flex min-h-0 flex-col gap-3 overflow-y-auto px-5 pt-4 pb-5 sm:px-6 @max-[40rem]:min-h-80 @max-[40rem]:overflow-visible">
                    {main}
                </div>
                <aside
                    aria-label={detailsLabel}
                    className="border-base-300 bg-base-50/60 grid content-start gap-5 overflow-y-auto border-l px-4 py-4 @max-[40rem]:overflow-visible @max-[40rem]:border-t @max-[40rem]:border-l-0"
                >
                    {details}
                </aside>
            </FormFieldset>
        </div>
    );
}

/**
 * A field of a details panel under its small uppercase `heading`, which labels the field `htmlFor` names; without
 * `htmlFor`, the field is a group of controls that the heading names, such as a ticket's labels (`id` and `ref` reach
 * the group).
 */
export function PanelField({
    heading,
    htmlFor,
    id,
    ref,
    children,
}: {
    heading: string;
    htmlFor?: string;
    id?: string;
    ref?: Ref<HTMLDivElement>;
    children: ReactNode;
}) {
    if (htmlFor)
        return (
            <div className="grid gap-1.5">
                <DetailsHeading presentation="label" as="label" htmlFor={htmlFor}>
                    {heading}
                </DetailsHeading>
                {children}
            </div>
        );

    return (
        <div ref={ref} id={id} role="group" aria-label={heading} className="grid gap-1.5">
            <DetailsHeading presentation="label" as="span">
                {heading}
            </DetailsHeading>
            {children}
        </div>
    );
}

/** The details panel's ticket part, ruled off from the fields above it: a ticket's own fields, or what a draft without
 *  one keeps. */
export function DraftTicketPart({ children }: { children: ReactNode }) {
    return <div className="border-base-300 grid gap-3 border-t pt-4">{children}</div>;
}

/** Create issue in the footer: its `checkbox`, then the `reason` it can't be ticked, kept to a readable width, and any
 *  `error`. */
export function CreateIssueChoice({
    checkbox,
    reason,
    error,
}: {
    checkbox: ReactNode;
    reason?: ReactNode;
    error?: ReactNode;
}) {
    return (
        <div className="grid gap-1">
            {checkbox}
            {reason && <div className="max-w-md">{reason}</div>}
            {error}
        </div>
    );
}

/** The Find a ticket pane, ruled off from the header: its notes and fields, one under the other, scrolling above the
 *  footer when a long result list needs it. */
export function TicketSearchPane({ id, children }: { id: string; children: ReactNode }) {
    return (
        <div
            id={id}
            className="border-base-300 grid min-h-0 content-start gap-4 overflow-y-auto border-t px-5 pt-4 pb-5 sm:px-6"
        >
            {children}
        </div>
    );
}

/** A ticket a search found: its number, its title and a short `note`, such as that it is on the board already. */
export interface TicketSearchMatch {
    number: number;
    title: string;
    note?: string | undefined;
}

/**
 * A search of a tracker's open tickets: the field (`fieldLabel` names it) with its Search button, which Enter also
 * runs, the matches, each a button that picks it, and the search's `result`, announced. `id` prefixes the field's,
 * the button's and the result's ids. `busy` stops a pick while a search or a pick runs, and `picking` marks the list
 * as busy.
 */
export function TicketSearch({
    id,
    query,
    onQueryChange,
    onSearch,
    fieldLabel,
    placeholder,
    searchLabel,
    disabled = false,
    searchDisabled = false,
    tickets,
    listLabel,
    busy = false,
    picking = false,
    onPick,
    result,
}: {
    id: string;
    query: string;
    onQueryChange: (query: string) => void;
    onSearch: () => void;
    fieldLabel: string;
    placeholder: string;
    searchLabel: string;
    disabled?: boolean | undefined;
    searchDisabled?: boolean;
    tickets: readonly TicketSearchMatch[];
    listLabel: string;
    busy?: boolean;
    picking?: boolean;
    onPick: (number: number) => void;
    result: string;
}) {
    const onKey = (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key !== 'Enter') return;

        event.preventDefault();
        onSearch();
    };

    return (
        <div className="grid gap-2" data-ticket-picker>
            <div className="flex gap-2">
                <Input
                    id={`${id}-query`}
                    type="search"
                    value={query}
                    onChange={(event) => onQueryChange(event.currentTarget.value)}
                    onKeyDown={onKey}
                    disabled={disabled}
                    autoComplete="off"
                    aria-label={fieldLabel}
                    placeholder={placeholder}
                    className="min-w-0 flex-1"
                />
                <Button {...buttonKind('other')} id={`${id}-search`} disabled={searchDisabled} onClick={onSearch}>
                    {searchLabel}
                </Button>
            </div>
            {tickets.length > 0 && (
                <ul className="m-0 grid list-none gap-0.5 p-0" aria-label={listLabel} aria-busy={picking}>
                    {tickets.map((ticket) => (
                        <li key={ticket.number}>
                            <button
                                {...tabbable}
                                type="button"
                                data-ticket={ticket.number}
                                disabled={busy}
                                onClick={() => onPick(ticket.number)}
                                className="hover:bg-base-200/70 focus-visible:outline-primary flex w-full min-w-0 items-baseline gap-2 rounded-md px-2 py-1.5 text-left text-sm focus-visible:outline-2 disabled:opacity-60"
                            >
                                <span className="shrink-0 text-(--muted-foreground) tabular-nums">
                                    #{ticket.number}
                                </span>
                                <span className="min-w-0 flex-1 truncate">{ticket.title}</span>
                                {ticket.note && (
                                    <span className="shrink-0 text-xs text-(--muted-foreground)">{ticket.note}</span>
                                )}
                            </button>
                        </li>
                    ))}
                </ul>
            )}
            <FormResult id={`${id}-result`} text={result} />
        </div>
    );
}
