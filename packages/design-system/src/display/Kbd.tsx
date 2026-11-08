import type { ReactNode } from 'react';

/** A keyboard key or shortcut, as quiet small text, such as ⌘K beside the search field. */
export function Kbd({
    children,
}: {
    /** The key or shortcut, such as ⌘K. */
    children?: ReactNode;
}) {
    return <kbd className="text-fg-muted text-2xs font-sans font-medium">{children}</kbd>;
}
