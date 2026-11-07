// A project's kind vocabulary in Lar Factory's settings and onboarding: each kind's row, with its type and the chips of
// its labels, and the chooser that picks them from the tracker's labels.

import type { ReactNode } from 'react';

import type { DataAttributes } from './DataAttributes';

/**
 * One kind's row: its `title`, its `type` control, then its labels' chips in a group `labelsLabel` names, which take a
 * line of their own on a narrow page, ending with the `chooser` that edits them; what the row says about them (notes,
 * problems, actions) follows under it.
 */
export function VocabularyRow({
    title,
    type,
    labels,
    labelsLabel,
    chooser,
    children,
    ...data
}: {
    title: string;
    type: ReactNode;
    labels: ReactNode;
    labelsLabel: string;
    chooser: ReactNode;
    children?: ReactNode;
} & DataAttributes) {
    return (
        <div {...data} className="grid min-w-0 gap-2 px-3 py-3">
            <div className="grid min-w-0 grid-cols-[minmax(0,1fr)_8.5rem] items-center gap-x-3 gap-y-2 sm:grid-cols-[5.5rem_8.5rem_minmax(0,1fr)]">
                <span className="text-[13px] font-medium">{title}</span>
                {type}
                <div
                    role="group"
                    aria-label={labelsLabel}
                    className="col-span-2 flex min-w-0 flex-wrap items-center gap-1 sm:col-span-1"
                >
                    {labels}
                    <span className="ms-auto flex">{chooser}</span>
                </div>
            </div>
            {children}
        </div>
    );
}

/** The chip that stands for the labels past the first few, which opens the chooser (`label` names it). */
export function VocabularyMore({ label, onClick, children }: { label: string; onClick: () => void; children: string }) {
    return (
        <button
            type="button"
            className="cursor-pointer rounded-full bg-(--muted) px-2 text-xs"
            aria-label={label}
            onClick={onClick}
        >
            {children}
        </button>
    );
}

/** A suggested label, dashed, which a press maps. */
export function VocabularySuggestion({
    disabled = false,
    onClick,
    children,
}: {
    disabled?: boolean;
    onClick: () => void;
    children: ReactNode;
}) {
    return (
        <button
            type="button"
            disabled={disabled}
            className="cursor-pointer rounded-full border border-dashed border-(--border) px-2 py-0.5 text-xs"
            onClick={onClick}
        >
            {children}
        </button>
    );
}

/** The chooser's panel inside its popover: the search field, the list, then its actions, one under the other. */
export function LabelChooser({ children, ...data }: { children: ReactNode } & DataAttributes) {
    return (
        <div {...data} className="grid w-full min-w-0 gap-2">
            {children}
        </div>
    );
}

/** The chooser's list of labels, which picks several (`label` names it); its wheel scrolls the list alone. */
export function LabelChooserList({ id, label, children }: { id: string; label: string; children: ReactNode }) {
    return (
        <ul
            id={id}
            role="listbox"
            aria-multiselectable
            aria-label={label}
            className="m-0 h-64 list-none overflow-y-auto overscroll-contain p-0"
            onWheel={(event) => event.stopPropagation()}
        >
            {children}
        </ul>
    );
}

/** One label in the chooser's list, highlighted while `active`. A press picks it and keeps focus in the search field. */
export function LabelChooserOption({
    id,
    selected,
    disabled,
    active,
    onHover,
    onPick,
    children,
}: {
    id: string;
    selected: boolean;
    disabled: boolean;
    active: boolean;
    onHover: () => void;
    onPick: () => void;
    children: ReactNode;
}) {
    return (
        <li
            id={id}
            role="option"
            aria-selected={selected}
            aria-disabled={disabled}
            className={`cursor-pointer rounded px-2 py-1 text-[13px] wrap-anywhere ${active ? 'bg-(--muted)' : ''}`}
            onMouseMove={onHover}
            onMouseDown={(event) => event.preventDefault()}
            onClick={onPick}
        >
            {children}
        </li>
    );
}

/** What the chooser's list says when no label matches, announced. */
export function LabelChooserEmpty({ children }: { children: ReactNode }) {
    return (
        <li role="status" className="px-2 py-2 text-xs text-(--muted-foreground)">
            {children}
        </li>
    );
}

/** The chooser's closing actions, at either end of a ruled line. */
export function LabelChooserFooter({ children }: { children: ReactNode }) {
    return <div className="flex justify-between gap-2 border-t border-(--border) pt-2">{children}</div>;
}
