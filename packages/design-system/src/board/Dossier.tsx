// A dossier in Lar Factory's board's dock (Concepts and linked work): its one line, on the stage rows' columns, which
// expands in place to its body, and what the line holds: its toggle, title, chips, what's next and the bar of its parts.

import { ChevronRightIcon } from 'lucide-react';
import type { MouseEvent, ReactNode } from 'react';

import { Badge } from '../display/Badge';
import { ambientMotion } from '../foundations/AmbientMotion';
import { Tooltip, TooltipPopup, TooltipTrigger } from '../overlays/Tooltip';
import { pickedRow, ROW_OPENS, ROW_RULE } from './RowStyles';

const stop = (event: MouseEvent) => event.stopPropagation();

/** A dossier, named by `label`; `id` names it as `data-dossier`. */
export function DossierRow({ id, label, children }: { id: string; label: string; children: ReactNode }) {
    return (
        <article className={`@container ${ROW_RULE}`} data-dossier={id} aria-label={label}>
            {children}
        </article>
    );
}

/** The dossiers in the dock. */
export function DossierList({ children }: { children: ReactNode }) {
    return <div data-dossiers>{children}</div>;
}

/** The chevron that expands a dossier in place, named by what it does now. */
export function DossierToggle({ open, label, onToggle }: { open: boolean; label: string; onToggle: () => void }) {
    return (
        <button
            type="button"
            data-dossier-open
            aria-expanded={open}
            aria-label={label}
            onClick={(event) => {
                stop(event);
                onToggle();
            }}
            className={`grid size-6 shrink-0 place-items-center rounded-md text-(--muted-foreground) hover:bg-(--soft) hover:text-(--foreground) ${ROW_OPENS}`}
        >
            <ChevronRightIcon className={`size-4 ${open ? 'rotate-90' : ''}`} />
        </button>
    );
}

/** A dossier's line: a click anywhere on it but its controls goes to `onClick`; `title` gives what its chips and threads
 *  say. */
export function DossierLine({
    item,
    picked,
    title,
    onClick,
    children,
}: {
    item: string;
    picked: boolean;
    title?: string | undefined;
    onClick?: (event: MouseEvent<HTMLDivElement>) => void;
    children: ReactNode;
}) {
    return (
        <div
            onClick={onClick}
            data-item={item}
            title={title}
            className={`cursor-pointer py-2 hover:bg-(--accent) ${pickedRow(picked)}`}
        >
            {children}
        </div>
    );
}

/** The dossier line's title cell: its title, tracker fields, note and other repositories, the title keeping its room. */
export function DossierTitleCell({ children }: { children: ReactNode }) {
    return (
        <span className="flex min-w-0 items-center gap-1.5" data-line="1" data-title-cell>
            {children}
        </span>
    );
}

/** The dossier's title as the button that opens its item; `name` gives it whole. */
export function DossierTitle({ name, onOpen, children }: { name: string; onOpen: () => void; children: ReactNode }) {
    return (
        <button
            type="button"
            onClick={(event) => {
                stop(event);
                onOpen();
            }}
            title={name}
            data-title
            className={`min-w-0 truncate rounded text-left text-sm leading-7 font-medium text-(--foreground) hover:underline ${ROW_OPENS}`}
        >
            {children}
        </button>
    );
}

/** After the title: the tracker's fields, which give up their room before the title does, ending in an ellipsis. Below
 *  `lg` they may shrink to nothing, so a narrow line's title keeps its room. */
export function DossierFields({ children }: { children: ReactNode }) {
    return <span className="min-w-0 shrink-[1000] truncate empty:hidden lg:min-w-10">{children}</span>;
}

/** After the fields: a note, such as where its planning is saved; its clicks stay there. */
export function DossierNote({ children }: { children: ReactNode }) {
    return (
        <span onClick={stop} className="flex shrink-0 items-center pl-1 empty:hidden">
            {children}
        </span>
    );
}

/** The repositories its parts work in beyond its own. */
export function DossierRepos({ children }: { children: string }) {
    return (
        <span
            data-col="repos"
            className="min-w-16 shrink-[100] truncate text-(--muted-foreground) empty:hidden"
            title={children || undefined}
        >
            {children}
        </span>
    );
}

/** A dossier chip's tone. */
export type DossierChipTone = 'warning' | 'danger' | 'neutral' | 'accent' | 'success';

/** The dossier's first chip whole, at its full width, and how many `more` its line's tooltip names. Its clicks stay
 *  there. */
export function DossierChips({
    first,
    more,
}: {
    first: { words: string; tone: DossierChipTone; icon?: ReactNode; refined?: boolean | undefined };
    /** The other chips' words. */
    more: string[];
}) {
    return (
        <span onClick={stop} className="flex shrink-0 items-center gap-1" data-chips>
            <Badge
                tone={first.tone}
                className="whitespace-nowrap tabular-nums"
                data-chip
                data-refined={first.refined || undefined}
            >
                {first.icon}
                {first.words}
            </Badge>
            {more.length > 0 && (
                <span className="text-(--muted-foreground) tabular-nums" data-chips-more>
                    <span aria-hidden="true">+{more.length}</span>
                    <span className="sr-only">{more.join(', ')}</span>
                </span>
            )}
        </span>
    );
}

/** An expanded dossier's view controls, in its action slot. */
export function DossierTools({ children }: { children: ReactNode }) {
    return (
        <span className="flex shrink-0 items-center" data-dossier-tools>
            {children}
        </span>
    );
}

/** What's next, as a sentence in the second line's text slot: a `word` naming it, in the warning tone when it waits on
 *  you, screen-reader text alone when `unseen`, then the `text` that names it. */
export function DossierNext({
    word,
    yours = false,
    unseen = false,
    text,
}: {
    word?: string | undefined;
    yours?: boolean;
    unseen?: boolean;
    text: string;
}) {
    return (
        <span className="min-w-0" data-next>
            <span className="flex min-w-0 items-center gap-2">
                {word && (
                    <span
                        className={`shrink-0 font-medium ${yours ? 'text-(--warning-foreground)' : 'text-(--muted-foreground)'} ${unseen ? 'sr-only' : ''}`}
                    >
                        {word}
                    </span>
                )}
                <span className="min-w-0 truncate" title={text}>
                    {text}
                </span>
            </span>
        </span>
    );
}

/** One part in PartsBar: its name and state, its colour, and whether it pulses while at work. */
export interface PartSegment {
    key: string;
    title: string;
    color: string;
    pulse?: boolean;
}

/** Every part as a segment in its colour, so the bar fills left to right, then a dashed one per part the board
 *  doesn't read. */
export function PartsBar({ title, parts, unread }: { title: string; parts: PartSegment[]; unread: number }) {
    return (
        <ol className="m-0 flex min-w-0 list-none gap-[2px] overflow-hidden p-0" title={title} data-part-bar>
            {parts.map((p) => (
                <li
                    key={p.key}
                    ref={p.pulse ? ambientMotion : undefined}
                    title={p.title}
                    className={`h-1.5 min-w-[3px] flex-1 rounded-full ${p.pulse ? 'status-pulse' : ''}`}
                    style={{ background: p.color }}
                />
            ))}
            {Array.from({ length: Math.max(0, unread) }, (_, n) => (
                <li
                    key={`u${n}`}
                    className="h-1.5 min-w-[3px] flex-1 rounded-full border border-dashed border-(--input)"
                />
            ))}
        </ol>
    );
}

/** What an expanded dossier holds, under its line. */
export function DossierBody({ children }: { children: ReactNode }) {
    return (
        <div className="grid gap-3 border-t border-(--border) p-3" data-dossier-body>
            {children}
        </div>
    );
}

/** Where a dossier's planning is saved, as a quiet label; hovering or focusing it reads the whole `note`. */
export function PlanningNote({ note, role, children }: { note: string; role: 'status' | 'note'; children: ReactNode }) {
    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <span
                    tabIndex={0}
                    role={role}
                    aria-label={note}
                    data-structure-sync
                    className="rounded whitespace-nowrap text-(--muted-foreground) focus-visible:outline-2 focus-visible:outline-(--primary)"
                >
                    {children}
                </span>
            </TooltipTrigger>
            <TooltipPopup side="bottom">{note}</TooltipPopup>
        </Tooltip>
    );
}
