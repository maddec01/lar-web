// What sits around a piece of work's Start (board/items.css): the group that holds it, the tag that takes its place once
// a thread started, and the line under it with Start's message or error.

import type { ReactNode, Ref } from 'react';

import { Badge } from '../display/Badge';
import type { DataAttributes } from './DataAttributes';

/** Start and what goes with it, at the right of its row, wrapping. */
export function StartGroup({ children }: { children: ReactNode }) {
    return <span className="start-group">{children}</span>;
}

/** A sentence on a line of its own in StartGroup, such as "Run finished.". */
export function StartNote({ children }: { children: ReactNode }) {
    return <span className="basis-full">{children}</span>;
}

/** The tag that takes Start's place: Started, or May have started while it's `unsure`. It takes focus back from a closed
 *  message, so it is focusable from script. */
export function StartTag({
    unsure = false,
    title,
    children,
    ...data
}: {
    unsure?: boolean;
    title: string;
    children: ReactNode;
} & DataAttributes) {
    return (
        <Badge
            {...data}
            tone={unsure ? 'warning' : 'success'}
            className={unsure ? 'started-tag unsure' : 'started-tag'}
            tabIndex={-1}
            title={title}
        >
            {children}
        </Badge>
    );
}

/** The small line under Start: its message or error, or what Auto-build says of the item. */
export function StartLine({
    ref,
    tabIndex,
    children,
    ...data
}: {
    ref?: Ref<HTMLParagraphElement>;
    tabIndex?: number;
    children: ReactNode;
} & DataAttributes) {
    return (
        <p {...data} ref={ref} tabIndex={tabIndex} className="start">
            {children}
        </p>
    );
}

/** An action's error in the danger text colour, on its own line after the controls beside it. */
export function ActionError({
    ref,
    role,
    children,
}: {
    ref?: Ref<HTMLSpanElement>;
    role?: 'alert';
    children: ReactNode;
}) {
    return (
        <span ref={ref} role={role} className="action-error">
            {children}
        </span>
    );
}
