// The bits every view of Lar Factory's board draws for a piece of work: its numbered title, title link, repository,
// tracker fields, kind marker, label chips and planning notes.

import { ArrowLeftRightIcon } from 'lucide-react';
import type { ReactNode } from 'react';

import { Badge } from '../display/Badge';
import type { DataAttributes } from './DataAttributes';

/** A title with its ticket's reference (`#12`) before it, muted, the way the board lists every item; captured work has
 *  no reference. */
export function ItemTitle({ reference, title }: { reference?: string | undefined; title: string }) {
    return (
        <>
            {reference ? (
                <>
                    <span className="font-normal text-(--muted-foreground) tabular-nums">{reference}</span>{' '}
                </>
            ) : null}
            {title}
        </>
    );
}

/** A title with its reference as a link to its ticket in a new tab, or as text when it has no page, as a sentence names
 *  it. */
export function TitleLink({
    reference,
    title,
    href,
}: {
    reference?: string | undefined;
    title: string;
    href?: string | undefined;
}) {
    const text = (
        <>
            {reference ? (
                <>
                    <span className="ref">{reference}</span>{' '}
                </>
            ) : null}
            {title}
        </>
    );

    return href ? (
        <a className="title" href={href} target="_blank" rel="noopener">
            {text}
        </a>
    ) : (
        <span className="title">{text}</span>
    );
}

/** A repository as a badge: its project icon and name. */
export function RepoTag({ icon, name }: { icon: ReactNode; name: string }) {
    return (
        <Badge className="gap-1.5">
            {icon}
            {name}
        </Badge>
    );
}

const identities = {
    row: 'flex min-w-0 items-center gap-1',
    map: 'inline-flex min-w-0 items-center gap-1.5',
    wrap: 'inline-flex min-w-0 items-center gap-2',
} as const;

/** A repository's project icon and name together, the name truncating: in a row's line, or roomier on the work map,
 *  where `title` names it in full. `wrap` is roomier still and wraps the name, anywhere if it must, for a line that
 *  says more than the name, such as an archived item's repository, number and state. */
export function RepoIdentity({
    icon,
    name,
    title,
    presentation = 'row',
    ...data
}: {
    icon: ReactNode;
    name: string;
    title?: string;
    presentation?: 'row' | 'map' | 'wrap';
} & DataAttributes) {
    return (
        <span {...data} title={title} className={identities[presentation]}>
            {icon}
            <span className={presentation === 'wrap' ? 'min-w-0 wrap-anywhere' : 'truncate'}>{name}</span>
        </span>
    );
}

/** A tracker's fields for the item (such as Azure's type, state and assignee) as one muted line that truncates, its
 *  tooltip giving it whole. */
export function ItemFields({ text, ...data }: { text: string } & DataAttributes) {
    return (
        <span {...data} title={text} className="block min-w-0 truncate text-xs text-(--muted-foreground)">
            {text}
        </span>
    );
}

/** Beside a kind badge, in muted text: the kind the ticket says instead, `said`, until someone answers. */
export function KindMarker({
    said,
    label,
    title,
    ...data
}: {
    said: string;
    /** The sentence assistive technology reads. */
    label: string;
    title: string;
} & DataAttributes) {
    return (
        <span
            {...data}
            title={title}
            aria-label={label}
            className="inline-flex items-center gap-0.5 text-[11px] text-(--muted-foreground)"
        >
            <ArrowLeftRightIcon className="size-2.5" aria-hidden="true" />
            {said}
        </span>
    );
}
