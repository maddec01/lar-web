import { type ReactNode, useId } from 'react';

import { Text, TextBase } from '../typography/Typography';

interface RemedyListProps {
    /** Names the list, quietly, such as "How Lar can fix it". */
    label: string;
    /** `RemedyRow`s, recommended first. */
    children: ReactNode;
}

/**
 * The ways to resolve one issue, inside a `NoticeCard`: one row per remedy, each saying what it does
 * and holding the one action that starts it, aligned in a column at the end.
 */
export function RemedyList({ label, children }: RemedyListProps) {
    const id = useId();

    return (
        <div className="flex min-w-0 flex-col gap-2">
            <Text id={id} variant="caption" tone="muted">
                {label}
            </Text>
            <ul
                aria-labelledby={id}
                className="border-line divide-line flex min-w-0 flex-col divide-y rounded-lg border"
            >
                {children}
            </ul>
        </div>
    );
}

interface RemedyRowProps {
    /** What the remedy does, in a sentence or two. */
    description: ReactNode;
    /** The one button that starts it; the recommended remedy's is primary, the others secondary. */
    action?: ReactNode;
    /** A short name, when the action's label doesn't already say it. */
    title?: string;
}

/** One remedy: what it does, then its action at the row's end, vertically centred; stacked when narrow. */
export function RemedyRow({ description, action, title }: RemedyRowProps) {
    return (
        <li className="@container flex min-w-0 flex-col">
            <div className="@pane:flex-row @pane:items-center @pane:gap-6 flex min-w-0 flex-col gap-3 px-4 py-3">
                <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                    {title ? <Text variant="label">{title}</Text> : null}
                    {/* A reading measure; the action still sits at the row's end. */}
                    <TextBase tone="muted" className="max-w-[75ch] text-pretty">
                        {description}
                    </TextBase>
                </div>
                {action ? <div className="flex shrink-0">{action}</div> : null}
            </div>
        </li>
    );
}
