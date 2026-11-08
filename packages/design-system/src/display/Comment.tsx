import type { ReactNode } from 'react';

import { Avatar } from './Avatar';

/** The comments, newest first, one Comment each, such as a ticket's. */
export function CommentList({
    children,
}: {
    /** The Comments, newest first. */
    children: ReactNode;
}) {
    return <ol className="m-0 grid list-none grid-cols-[minmax(0,1fr)] gap-3 p-0">{children}</ol>;
}

/** A comment: its author's avatar beside a card with their name and `time` over the comment. */
export function Comment({
    author,
    time,
    children,
}: {
    /** Who wrote it, beside their initials' avatar. */
    author: string;
    /** When they wrote it, such as a relative time in a time element. */
    time: ReactNode;
    /** The comment, such as RichText. */
    children: ReactNode;
}) {
    return (
        <li className="flex gap-3">
            <Avatar name={author} size="sm" />
            <div className="border-border bg-surface-raised min-w-0 flex-1 rounded-lg border">
                <div className="border-border flex items-center gap-2 border-b px-3 py-1.5 text-xs">
                    <span className="font-medium" data-comment-author>
                        {author}
                    </span>
                    <span className="text-fg-muted">{time}</span>
                </div>
                <div className="px-3 py-2">{children}</div>
            </div>
        </li>
    );
}
