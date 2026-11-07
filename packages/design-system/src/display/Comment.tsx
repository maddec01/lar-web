import type { ReactNode } from 'react';

import { Avatar } from './Avatar';

/** The comments, newest first, one Comment each, such as a ticket's. */
export function CommentList({ children }: { children: ReactNode }) {
    return <ol className="m-0 grid list-none grid-cols-[minmax(0,1fr)] gap-3 p-0">{children}</ol>;
}

/** A comment: its author's avatar beside a card with their name and `time` over the comment. */
export function Comment({ author, time, children }: { author: string; time: ReactNode; children: ReactNode }) {
    return (
        <li className="flex gap-3">
            <Avatar name={author} compact />
            <div className="border-border bg-base-100 min-w-0 flex-1 rounded-lg border">
                <div className="border-border flex items-center gap-2 border-b px-3 py-1.5 text-xs">
                    <span className="font-medium" data-comment-author>
                        {author}
                    </span>
                    <span className="text-base-700">{time}</span>
                </div>
                <div className="px-3 py-2">{children}</div>
            </div>
        </li>
    );
}
