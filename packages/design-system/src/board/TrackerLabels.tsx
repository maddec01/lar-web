// The tracker's labels on a Lar Factory project's settings page: the list of them, each row with its chip, detail and
// actions and the editor it opens, and the line that creates one.

import { LockIcon } from 'lucide-react';
import type { FormEvent, ReactNode } from 'react';

import { Badge } from '../display/Badge';
import type { DataAttributes } from './DataAttributes';

/** The tracker's labels, a row each, in a bordered list that never grows past its section. */
export function TrackerLabelList({ children }: { children: ReactNode }) {
    return (
        <ul className="m-0 grid list-none grid-cols-[minmax(0,1fr)] overflow-hidden rounded-lg border p-0">
            {children}
        </ul>
    );
}

/**
 * A label's row: its `chip`, its `detail` (truncating, its tooltip giving it whole), then its `actions`, with the
 * `editor` it has open under them.
 */
export function TrackerLabelRow({
    chip,
    detail,
    actions,
    editor,
    ...data
}: {
    chip: ReactNode;
    detail?: string | undefined;
    actions?: ReactNode;
    editor?: ReactNode;
} & DataAttributes) {
    return (
        <li {...data} className="border-b last:border-b-0">
            <div className="flex min-w-0 items-center gap-3 px-3 py-1.5">
                <span className="max-w-[45%] min-w-0">{chip}</span>
                <span className="text-base-700 min-w-0 flex-1 truncate text-xs" title={detail}>
                    {detail}
                </span>
                {actions && <span className="flex shrink-0 gap-1">{actions}</span>}
            </div>
            {editor}
        </li>
    );
}

/** A label's chip: its name in its tracker colour, truncating, after a lock when the factory manages it
 *  (`lockedLabel` names the lock). */
export function TrackerLabelChip({
    name,
    color,
    locked = false,
    lockedLabel,
}: {
    name: string;
    color?: string | undefined;
    locked?: boolean;
    lockedLabel?: string;
}) {
    return (
        <Badge data-label-chip className="max-w-full min-w-0" labelColor={color}>
            <span className="inline-flex min-w-0 items-center gap-1">
                {locked && <LockIcon className="size-3 shrink-0" aria-label={lockedLabel} />}
                <span className="truncate" title={name}>
                    {name}
                </span>
            </span>
        </Badge>
    );
}

/** The editor a label's row opens, ruled off under it on a faint tint. */
export function TrackerLabelEditor({
    onSubmit,
    children,
}: {
    onSubmit: (event: FormEvent<HTMLFormElement>) => void;
    children: ReactNode;
}) {
    return (
        <form className="bg-base-200/40 grid gap-3 border-t p-3" onSubmit={onSubmit}>
            {children}
        </form>
    );
}

/** The line that creates a label: its name field and the button that submits it, wrapping when they don't fit. */
export function CreateLabelForm({
    onSubmit,
    children,
}: {
    onSubmit: (event: FormEvent<HTMLFormElement>) => void;
    children: ReactNode;
}) {
    return (
        <form className="flex max-w-full min-w-0 flex-wrap gap-2" onSubmit={onSubmit}>
            {children}
        </form>
    );
}
