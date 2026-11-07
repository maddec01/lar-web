// A piece of work's pull requests: a list with each one's checks and readiness, and the short reference rows show.

import { GitPullRequestIcon } from 'lucide-react';
import type { ReactNode } from 'react';

/** The pull requests in a list, one PullRequestRow each. */
export function PullRequestList({ children }: { children: ReactNode }) {
    return <ul className="m-0 grid list-none grid-cols-[minmax(0,1fr)] gap-1 p-0">{children}</ul>;
}

/** A pull request: its icon and label linking to it in a new tab, then its `checks` and `readiness`. */
export function PullRequestRow({
    href,
    label,
    checks,
    readiness,
}: {
    href: string;
    label: string;
    checks?: ReactNode;
    readiness?: ReactNode;
}) {
    return (
        <li className="flex flex-wrap items-center gap-x-2 gap-y-1 rounded-lg border border-(--border) bg-(--card) px-3 py-2">
            <GitPullRequestIcon className="size-4 shrink-0 text-(--st-done)" />
            <a
                href={href}
                target="_blank"
                rel="noopener"
                className="min-w-0 flex-1 basis-24 font-medium wrap-anywhere hover:underline"
            >
                {label}
            </a>
            {checks}
            {readiness}
        </li>
    );
}

const CHECKS_COLOR = { failed: 'var(--error)', running: 'var(--warning)', passed: 'var(--st-done)' } as const;

/** A pull request's checks as a coloured dot and their state, then any `counts`. */
export function ChecksState({ state, counts }: { state: keyof typeof CHECKS_COLOR; counts?: string }) {
    return (
        <span className="inline-flex shrink-0 items-center gap-1.5 text-xs text-(--muted-foreground)">
            <span className="size-2 rounded-full" style={{ background: CHECKS_COLOR[state] }} />
            checks {state}
            {counts && <span className="tabular-nums">· {counts}</span>}
        </span>
    );
}

/** A pull request as a row names it: its icon and short label, `title` naming it in full. */
export function PullRequestRef({ label, title }: { label: string; title?: string }) {
    return (
        <span title={title} className="inline-flex shrink-0 items-center gap-1">
            <GitPullRequestIcon className="size-3 shrink-0 text-(--st-done)" />
            {label}
        </span>
    );
}

/** A pull request's readiness under its row: the `toggle` that shows it, then the `details` while shown. */
export function PullRequestReadiness({ toggle, details }: { toggle: ReactNode; details?: ReactNode }) {
    return (
        <div className="basis-full text-xs text-(--muted-foreground)">
            {toggle}
            {details}
        </div>
    );
}

/** What a readiness read says: its `status`, when it was `observed` and what blocks it, a `note`, and `refresh`. */
export function ReadinessDetails({
    id,
    status,
    observed,
    blockers = [],
    note,
    refresh,
}: {
    id: string;
    status: ReactNode;
    observed?: ReactNode;
    blockers?: string[];
    note: ReactNode;
    refresh: ReactNode;
}) {
    return (
        <div id={id} role="status" aria-live="polite">
            <p>{status}</p>
            {observed && (
                <>
                    <p>{observed}</p>
                    <ul>
                        {blockers.map((b) => (
                            <li key={b}>{b}</li>
                        ))}
                    </ul>
                </>
            )}
            <p>{note}</p>
            {refresh}
        </div>
    );
}
