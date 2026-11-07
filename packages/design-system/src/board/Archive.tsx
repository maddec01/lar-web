import type { ReactNode } from 'react';

import { Text } from '../typography/Typography';

/** A row's actions at its right, with what they last did and an error under them. */
export function ActionStack({
    children,
    below,
    error,
}: {
    children: ReactNode;
    below?: ReactNode;
    error?: string | null;
}) {
    return (
        <span className="flex flex-col items-end gap-1">
            <span className="flex flex-wrap items-center gap-2">{children}</span>
            {below}
            {error && (
                <Text variant="caption" tone="danger" role="alert">
                    {error}
                </Text>
            )}
        </span>
    );
}

/** A setting's confirmation, inline under it, before it saves: what it would do now, the work it names, and the
 *  buttons that cancel or go ahead. */
export function SettingConfirm({
    label,
    message,
    items,
    actions,
}: {
    label: string;
    message: string;
    items: readonly string[];
    actions: ReactNode;
}) {
    return (
        <div
            className="grid gap-2 rounded-lg border border-(--border) p-3 text-sm"
            role="alertdialog"
            aria-label={label}
            data-delete-confirm
        >
            <p className="m-0">{message}</p>
            {items.length > 0 && (
                <ul className="m-0 grid gap-0.5 pl-4">
                    {items.map((item, index) => (
                        <li key={index}>{item}</li>
                    ))}
                </ul>
            )}
            <span className="flex gap-2">{actions}</span>
        </div>
    );
}

/** What a setting's last run did, and each thing it kept with why. */
export function SettingLastRun({ summary, kept }: { summary: string; kept: readonly string[] }) {
    return (
        <div className="grid gap-1 text-xs text-(--muted-foreground)" data-last-delete>
            <p className="m-0">{summary}</p>
            {kept.length > 0 && (
                <ul className="m-0 grid gap-0.5 pl-4">
                    {kept.map((line, index) => (
                        <li key={index}>{line}</li>
                    ))}
                </ul>
            )}
        </div>
    );
}
