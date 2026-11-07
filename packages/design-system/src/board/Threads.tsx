// A piece of work's earlier T3 threads, in the item dialog.

import type { ReactNode } from 'react';

/** The earlier threads, one EarlierThread each, in small muted text. */
export function EarlierThreadList({ children }: { children: ReactNode }) {
    return (
        <ul className="m-0 grid list-none gap-1 p-0 text-xs text-(--muted-foreground)" data-earlier-threads>
            {children}
        </ul>
    );
}

/** An earlier thread: its `name`, linked when `href` opens it, then its `state`; `title` names it in full. */
export function EarlierThread({
    name,
    title,
    href,
    state,
}: {
    name: string;
    title: string;
    href?: string | undefined;
    state: ReactNode;
}) {
    return (
        <li className="flex min-w-0 items-center gap-1.5" title={title}>
            {href ? (
                <a href={href} className="truncate underline">
                    {name}
                </a>
            ) : (
                <span className="truncate">{name}</span>
            )}{' '}
            <span className="shrink-0">· {state}</span>
        </li>
    );
}
