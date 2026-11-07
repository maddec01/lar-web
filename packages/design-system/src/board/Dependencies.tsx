// The Dependencies holding a build, in the item dialog.

import type { ReactNode } from 'react';

/** The Dependencies, one DependencyItem each. */
export function DependencyList({ children }: { children: ReactNode }) {
    return <ul className="m-0 grid list-none gap-3 p-0 text-sm">{children}</ul>;
}

/** A Dependency: who owns it and whether it's met, its need, its latest read and evidence, what the board asks about it,
 *  and its `action`. */
export function DependencyItem({
    id,
    owner,
    need,
    read,
    evidence,
    notice,
    action,
}: {
    id: string;
    owner: ReactNode;
    need: ReactNode;
    read: ReactNode;
    evidence: ReactNode;
    notice?: ReactNode;
    action: ReactNode;
}) {
    return (
        <li className="grid gap-1" data-dependency={id}>
            <span className="font-medium" data-dependency-owner>
                {owner}
            </span>
            <span>{need}</span>
            <span className="text-xs text-(--muted-foreground)" data-dependency-read>
                {read}
            </span>
            <span className="text-xs text-(--muted-foreground)" data-dependency-evidence>
                {evidence}
            </span>
            {notice && (
                <p className="m-0 text-xs font-medium text-(--warning-foreground)" data-dependency-notice>
                    {notice}
                </p>
            )}
            <span>{action}</span>
        </li>
    );
}
