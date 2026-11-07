// What Lar Factory's item dialog shows from a piece of work's details: its sections' headings, the meta area's facts
// and people, the main column's description, record and comments, and the sidebar's lists.

import { CircleCheckIcon, CircleDotIcon, LockIcon } from 'lucide-react';
import type { ReactNode, Ref } from 'react';

import { Avatar } from '../display/Avatar';
import type { DataAttributes } from './DataAttributes';

const headings = {
    section: 'm-0 text-[13px] font-medium',
    muted: 'm-0 text-[13px] font-medium text-(--muted-foreground)',
    label: 'm-0 text-[11px] font-medium tracking-wider text-(--muted-foreground) uppercase',
} as const;

/** A section's heading: a sidebar `section`'s, a `muted` one over the comments or a description's own section, or the
 *  small uppercase `label` over the description and the record. `as` a `label` it names the field `htmlFor` names, or
 *  as a `span` a group that names itself. */
export function DetailsHeading({
    presentation = 'section',
    as = 'h2',
    htmlFor,
    children,
}: {
    presentation?: keyof typeof headings;
    as?: 'h2' | 'label' | 'span';
    htmlFor?: string | undefined;
    children: ReactNode;
}) {
    if (as === 'label')
        return (
            <label htmlFor={htmlFor} className={headings[presentation]}>
                {children}
            </label>
        );

    if (as === 'span') return <span className={headings[presentation]}>{children}</span>;

    return <h2 className={headings[presentation]}>{children}</h2>;
}

/** A sidebar section, or a section of the body such as a concept's parts: its heading over its content. */
export function DetailsSection({
    heading,
    children,
    ...data
}: {
    heading: ReactNode;
    children: ReactNode;
} & DataAttributes) {
    return (
        <section {...data} className="grid min-w-0 grid-cols-[minmax(0,1fr)] gap-2">
            <DetailsHeading>{heading}</DetailsHeading>
            {children}
        </section>
    );
}

/** A section of the description, such as Acceptance Criteria: its muted heading over its text. */
export function TextSection({ heading, children }: { heading: ReactNode; children: ReactNode }) {
    return (
        <section className="grid min-w-0 gap-2">
            <DetailsHeading presentation="muted">{heading}</DetailsHeading>
            {children}
        </section>
    );
}

/**
 * A section of the main column, beside the sidebar: the record, description or comments, its `header` over its
 * content. When it `fill`s, its content takes the height left.
 */
export function MainSection({
    as: Tag = 'div',
    header,
    fill = false,
    children,
    ...data
}: {
    as?: 'div' | 'section';
    header: ReactNode;
    fill?: boolean;
    children: ReactNode;
} & DataAttributes) {
    return (
        <Tag
            {...data}
            className={`grid min-w-0 gap-2 ${fill ? 'min-h-0 grid-rows-[auto_minmax(0,1fr)]' : ''} @min-[45rem]:col-start-1`}
        >
            {header}
            {children}
        </Tag>
    );
}

/** A main section's header row: its small uppercase `heading`, then its actions at the end. */
export function SectionHeader({ heading, children }: { heading: ReactNode; children?: ReactNode }) {
    return (
        <div className="flex h-7 items-center justify-between gap-2">
            <DetailsHeading presentation="label">{heading}</DetailsHeading>
            {children && <span className="flex min-w-0 items-center gap-3">{children}</span>}
        </div>
    );
}

/** A short status in a section's header, such as a save that could not be read back, truncating. */
export function HeaderStatus({ children }: { children: string }) {
    return (
        <span className="truncate text-xs text-(--muted-foreground)" role="status" title={children}>
            {children}
        </span>
    );
}

/** A line of the details in the body size: an error, announced, or a muted empty state. `mainColumn` keeps it in the
 *  main column beside the sidebar. */
export function DetailsText({
    tone = 'muted',
    mainColumn = false,
    children,
}: {
    tone?: 'muted' | 'error';
    mainColumn?: boolean;
    children: ReactNode;
}) {
    return (
        <p
            className={`m-0 text-sm ${tone === 'error' ? 'text-(--error-foreground)' : 'text-(--muted-foreground)'}${mainColumn ? ' @min-[45rem]:col-start-1' : ''}`}
            role={tone === 'error' ? 'alert' : undefined}
        >
            {children}
        </p>
    );
}

/** A placeholder that keeps the main column's place while the details load. */
export function MainColumnSlot({ children }: { children: ReactNode }) {
    return <div className="@min-[45rem]:col-start-1">{children}</div>;
}

/** The meta area under the summary: its facts, wrapping onto as many lines as the width needs. */
export function MetaArea({ children, ...data }: { children: ReactNode } & DataAttributes) {
    return (
        <div {...data} className="flex min-w-0 flex-wrap items-center gap-x-5 gap-y-2">
            {children}
        </div>
    );
}

/**
 * A labelled fact: in the meta area, its value wrapping rather than running past the dialog; in a `record`, a fact of
 * the work record whose value wraps onto lines of its own.
 */
export function DetailFact({
    label,
    presentation = 'meta',
    children,
    ...data
}: {
    label: string;
    presentation?: 'meta' | 'record';
    children: ReactNode;
} & DataAttributes) {
    if (presentation === 'record')
        return (
            <div {...data} className="flex min-w-0 flex-wrap items-baseline gap-x-1.5 text-sm">
                <span className="shrink-0 text-xs text-(--muted-foreground)">{label}</span>
                {children}
            </div>
        );

    return (
        <div {...data} className="flex max-w-full min-w-0 items-baseline gap-1.5 text-sm">
            <span className="shrink-0 text-xs text-(--muted-foreground)">{label}</span>
            <span className="min-w-0 wrap-anywhere">{children}</span>
        </div>
    );
}

/** A person: their avatar and name, the name wrapping. */
export function Person({ name }: { name: string }) {
    return (
        <span className="inline-flex max-w-full min-w-0 items-center gap-1.5">
            <Avatar name={name} compact />
            <span className="min-w-0 wrap-anywhere">{name}</span>
        </span>
    );
}

/** People in a fact, such as the assignees, wrapping. */
export function PeopleList({ children }: { children: ReactNode }) {
    return <span className="flex flex-wrap gap-x-3 gap-y-1">{children}</span>;
}

/** A line of short items, such as a review round's verdicts, wrapping. */
export function InlineList({ items }: { items: readonly string[] }) {
    return (
        <ul className="m-0 flex list-none flex-wrap gap-x-3 p-0">
            {items.map((item, index) => (
                <li key={index}>{item}</li>
            ))}
        </ul>
    );
}

/** Facts one under the other, such as a record's review rounds. */
export function FactList({ children, ...data }: { children: ReactNode } & DataAttributes) {
    return (
        <div {...data} className="grid gap-1">
            {children}
        </div>
    );
}

/** The editor's slot in a main section: a column that takes the height left when it `fill`s. */
export function EditorSlot({ fill, children }: { fill: boolean; children: ReactNode }) {
    return <div className={fill ? 'flex min-h-0 flex-col' : 'contents'}>{children}</div>;
}

/** Under an editor: whether it changed, or `error` in its place, announced and wrapping, then its buttons. */
export function EditActions({
    status,
    error,
    children,
    ...data
}: {
    status: string;
    error?: string | null | undefined;
    children: ReactNode;
} & DataAttributes) {
    return (
        <div {...data} className="flex items-start gap-2">
            {error ? (
                <p className="m-0 me-auto min-w-0 flex-1 py-1.5 text-xs text-(--error-foreground)" role="alert">
                    {error}
                </p>
            ) : (
                <span className="me-auto min-w-0 flex-1 py-1.5 text-xs text-(--muted-foreground)">{status}</span>
            )}
            {children}
        </div>
    );
}

/** How a Spec's sync stands: its `status`, announced, then what answers it, then an `error`, announced. */
export function SpecSync({
    status,
    error,
    children,
}: {
    status?: string | undefined;
    error?: string | null | undefined;
    children?: ReactNode;
}) {
    return (
        <div className="grid gap-2 text-sm" data-spec-sync>
            {status && (
                <p className="m-0" role="status">
                    {status}
                </p>
            )}
            {children}
            {error && (
                <p className="m-0 text-(--error-foreground)" role="alert">
                    {error}
                </p>
            )}
        </div>
    );
}

/** The comments, newest first, one Comment each. */
export function CommentList({ children }: { children: ReactNode }) {
    return <ol className="m-0 grid list-none grid-cols-[minmax(0,1fr)] gap-3 p-0">{children}</ol>;
}

/** A comment: its author's avatar beside a card with their name and `time` over the comment. */
export function Comment({ author, time, children }: { author: string; time: ReactNode; children: ReactNode }) {
    return (
        <li className="flex gap-3">
            <Avatar name={author} compact />
            <div className="min-w-0 flex-1 rounded-(--radius-lg) border border-(--border) bg-(--card)">
                <div className="flex items-center gap-2 border-b border-(--border) px-3 py-1.5 text-xs">
                    <span className="font-medium" data-comment-author>
                        {author}
                    </span>
                    <span className="text-(--muted-foreground)">{time}</span>
                </div>
                <div className="px-3 py-2">{children}</div>
            </div>
        </li>
    );
}

/** Linked work items, such as sub-tickets or blockers, one TicketLink each; or attachments, one AttachmentLink each. */
export function TicketLinkList({ children }: { children: ReactNode }) {
    return <ul className="m-0 grid list-none gap-1.5 p-0">{children}</ul>;
}

/** A linked work item: done or open (`stateLabel` names it), its `reference` and `title` linked, and its tracker's
 *  `fields` under them. */
export function TicketLink({
    closed,
    stateLabel,
    href,
    reference,
    title,
    fields,
}: {
    closed: boolean;
    stateLabel: string;
    href: string;
    reference: string;
    title: string;
    fields?: ReactNode;
}) {
    return (
        <li className="flex items-start gap-2 text-sm">
            {closed ? (
                <CircleCheckIcon aria-label={stateLabel} className="mt-0.5 size-3.5 shrink-0 text-(--success)" />
            ) : (
                <CircleDotIcon aria-label={stateLabel} className="mt-0.5 size-3.5 shrink-0 text-(--muted-foreground)" />
            )}
            <span className="min-w-0">
                <a href={href} target="_blank" rel="noopener" className="wrap-anywhere hover:underline">
                    <span className="text-(--muted-foreground)">{reference}</span> {title}
                </a>
                {fields}
            </span>
        </li>
    );
}

/** An attachment's name, linked. */
export function AttachmentLink({ href, name }: { href: string; name: string }) {
    return (
        <li className="text-sm">
            <a href={href} target="_blank" rel="noopener" className="wrap-anywhere underline">
                {name}
            </a>
        </li>
    );
}

/** A sprint's count over its children: `count` ("This sprint: 2 of 5 done") and the sprint's `name`. */
export function SprintCount({ count, name }: { count: string; name: string }) {
    return (
        <div className="text-sm">
            <p className="m-0 font-medium">{count}</p>
            <p className="m-0 text-xs text-(--muted-foreground)">{name}</p>
        </div>
    );
}

/** The work an item waits on, struck through once closed. */
export function WaitsOnList({ items }: { items: readonly { key: string; title: string; closed: boolean }[] }) {
    return (
        <ul className="m-0 grid list-none gap-1.5 p-0 text-sm" data-waits-on>
            {items.map((item) => (
                <li key={item.key} className={item.closed ? 'text-(--muted-foreground) line-through' : ''}>
                    {item.title}
                </li>
            ))}
        </ul>
    );
}

/** A tracker label the factory manages, which can't be edited: a lock and its name; `title` says why. */
export function LockedLabel({ title, children, ...data }: { title: string; children: string } & DataAttributes) {
    return (
        <span {...data} title={title} className="inline-flex items-center gap-1 text-xs text-(--muted-foreground)">
            <LockIcon className="size-3 shrink-0" aria-hidden="true" />
            {children}
        </span>
    );
}

/** The labels fact's value: the chips, then the control that edits them and any error, wrapping. Any wrapping row of
 *  badges takes it too, such as a skill folder's readers, which `label` then names. */
export function LabelsValue({ label, children }: { label?: string; children: ReactNode }) {
    return (
        <span className="flex flex-wrap items-center gap-1" aria-label={label}>
            {children}
        </span>
    );
}

/** Chips in a wrapping line, grouped with no box of their own, such as the labels fact's, for tests to name. */
export function ChipGroup({ children, ...data }: { children: ReactNode } & DataAttributes) {
    return (
        <span {...data} className="contents">
            {children}
        </span>
    );
}

/** A popover's panel for picking labels: 18rem wide, its picker over its status. */
export function LabelEditorPanel({ children }: { children: ReactNode }) {
    return <div className="grid w-72 gap-2">{children}</div>;
}

/** A kind change that failed: each of its `lines`, then the `action` that retries it, announced. */
export function ChangeFailed({
    lines,
    action,
    ...data
}: {
    lines: readonly string[];
    action: ReactNode;
} & DataAttributes) {
    return (
        <div {...data} role="alert" className="grid w-full justify-items-start gap-1 text-xs text-(--error-foreground)">
            {lines.map((line, index) => (
                <p key={index} className="m-0">
                    {line}
                </p>
            ))}
            {action}
        </div>
    );
}

/** Where the item's kind and its ticket's disagree: the `message`, the `actions` that answer it, then a `hint` and any
 *  `error`, which the caller renders as BoardNotes. */
export function KindQuestion({
    message,
    actions,
    children,
    ...data
}: {
    message: string;
    actions: ReactNode;
    children?: ReactNode;
} & DataAttributes) {
    return (
        <div {...data} className="grid w-full gap-2 rounded-lg border border-(--border) p-3">
            <p className="m-0 text-sm">{message}</p>
            <span className="flex flex-wrap gap-2">{actions}</span>
            {children}
        </div>
    );
}

/** A concept's parts on the board, one ConceptPart each. */
export function ConceptPartList({ children }: { children: ReactNode }) {
    return <ul className="m-0 grid list-none grid-cols-[minmax(0,1fr)] gap-0.5 p-0">{children}</ul>;
}

/** A part of a concept: a button that opens it from its source, glyph and title, then its `state`, figures and thread. */
export function ConceptPart({
    id,
    title,
    onOpen,
    source,
    glyph,
    name,
    state,
    children,
}: {
    id: string;
    title: string;
    onOpen: () => void;
    source: ReactNode;
    glyph: ReactNode;
    name: ReactNode;
    state: string;
    children?: ReactNode;
}) {
    return (
        <li
            data-concept-part={id}
            className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1 rounded-md px-2 py-1 hover:bg-(--soft)"
        >
            <button
                type="button"
                onClick={onOpen}
                title={title}
                className="flex min-w-0 flex-1 basis-56 items-start gap-1.5 text-left text-[13px] hover:underline"
            >
                {source}
                <span className="mt-0.5 inline-flex">{glyph}</span>
                <span className="line-clamp-2">{name}</span>
            </button>
            <span className="shrink-0 text-xs text-(--muted-foreground)">{state}</span>
            {children}
        </li>
    );
}

/** A ticket's outgoing title and text, as the tracker will receive them; the labels name each for assistive
 *  technology. */
export function OutgoingTicket({
    title,
    text,
    titleLabel,
    textLabel,
}: {
    title: string;
    text: string;
    titleLabel: string;
    textLabel: string;
}) {
    return (
        <>
            <div aria-label={titleLabel} className="font-medium wrap-anywhere">
                {title}
            </div>
            <pre
                aria-label={textLabel}
                className="m-0 max-h-64 overflow-auto text-xs wrap-anywhere whitespace-pre-wrap"
            >
                {text}
            </pre>
        </>
    );
}

/** A build's checks, folded under `summary` until opened, which `onOpen` hears each time. */
export function ChecksDisclosure({
    summary,
    onOpen,
    children,
    ...data
}: {
    summary: string;
    onOpen: () => void;
    children: ReactNode;
} & DataAttributes) {
    return (
        <details
            {...data}
            className="w-full min-w-0 text-sm"
            onToggle={(event) => {
                if (event.currentTarget.open) onOpen();
            }}
        >
            <summary className="min-h-11 cursor-pointer py-3 font-medium">{summary}</summary>
            <div className="grid gap-3 pt-2">{children}</div>
        </details>
    );
}

/** A check's run: its `command`, then what it says of the run. */
export function CheckRun({ command, children }: { command: string; children: ReactNode }) {
    return (
        <section className="min-w-0 rounded border border-(--border) p-2">
            <code className="wrap-anywhere whitespace-pre-wrap">{command}</code>
            {children}
        </section>
    );
}

/** A section's own scrolling panel that focus moves to when it opens, such as Create issue's; `label` names it. */
export function FocusPanel({ label, ref, children }: { label: string; ref?: Ref<HTMLElement>; children: ReactNode }) {
    return (
        <section
            ref={ref}
            tabIndex={-1}
            aria-label={label}
            className="grid max-h-[50dvh] w-full gap-3 overflow-y-auto pt-1"
        >
            {children}
        </section>
    );
}
