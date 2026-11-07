import type { ReactNode } from 'react';

/** A keyboard key or shortcut, as quiet small text, such as ⌘K beside the search field. */
export function Kbd({ children }: { children?: ReactNode }) {
    return <kbd className="text-base-500 font-sans text-[11px] font-medium">{children}</kbd>;
}
