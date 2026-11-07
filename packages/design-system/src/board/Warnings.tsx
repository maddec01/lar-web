import type { MouseEvent, ReactNode } from 'react';

import { BrandMark } from '../display/BrandMark';
import { DismissButton } from '../feedback/DismissButton';

interface BoardWarningsProps {
    /** A warning shown open above the rest, such as a lost board server, which every number on the page depends on. */
    lead?: ReactNode;
    /** The collapsed list's summary, such as "2 connections need attention"; without it, no list. */
    summary?: ReactNode;
    /** The warnings in the collapsed list. */
    children?: ReactNode;
    /** At the banner's right, such as Diagnostics. */
    action: ReactNode;
}

/** The board's warnings, in a banner under the title bar: connection problems stay in a collapsed list, inline
 *  details that never open a notification or a dialog. */
export function BoardWarnings({ lead, summary, children, action }: BoardWarningsProps) {
    return (
        <aside data-board-notices className="shrink-0 border-b bg-(--warning-surface) px-6 py-2 text-(--foreground)">
            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                    {lead}
                    {summary ? (
                        <details>
                            <summary className="cursor-pointer text-xs font-medium">{summary}</summary>
                            <div className="mt-2 max-h-48 overflow-auto">{children}</div>
                        </details>
                    ) : null}
                </div>
                {action}
            </div>
        </aside>
    );
}

interface BoardWarningProps {
    /** What the warning is about, as `data-warning`. */
    name: string;
    title: string;
    dismissLabel: string;
    onDismiss: (event: MouseEvent<HTMLButtonElement>) => void;
    /** Under the text, such as a button that fixes it. */
    action?: ReactNode;
    children: ReactNode;
}

/** One warning in the banner: its title, what to do, and a close button. Commands in it wrap anywhere. */
export function BoardWarning({ name, title, dismissLabel, onDismiss, action, children }: BoardWarningProps) {
    return (
        <div data-slot="notice" className="relative border-t py-3 pr-8 text-xs first:border-t-0 first:py-1">
            <div data-warning={name} className="[&_code]:wrap-anywhere">
                <DismissButton label={dismissLabel} onClick={onDismiss} />
                <div data-slot="title" className="font-medium">
                    {title}
                </div>
                <div data-slot="description" className="text-base-700 mt-1">
                    {children}
                </div>
                {action && <div className="mt-2">{action}</div>}
            </div>
        </div>
    );
}

/** What fills the board's main area while a tool it can't work without is missing: the Lar mark, what's missing, why
 *  and how to fix it, and a way to look again. */
export function ToolMissing({ title, children, action }: { title: string; children: ReactNode; action: ReactNode }) {
    return (
        <div className="tool-missing grid flex-1 place-items-center p-5">
            <div
                className="tool-missing-box max-w-130 rounded-(--radius) border bg-(--card) px-6 py-5 [&_code]:wrap-anywhere [&_code]:text-(--foreground)"
                role="alert"
            >
                <BrandMark label="Lar" />
                <h1 className="mt-3 mb-0 text-(length:--text-base) font-semibold tracking-[-0.01em]">{title}</h1>
                <p className="mt-3 mb-0 text-(--muted-foreground)">{children}</p>
                <p className="mt-3 mb-0 text-(--muted-foreground)">{action}</p>
            </div>
        </div>
    );
}
