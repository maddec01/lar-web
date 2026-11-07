import type { CSSProperties, ReactNode } from 'react';

/** Colours the icon inside it in a muted version of a lar-brand app hue, such as a catalog's kind; neutral without one. Its
 *  container sizes the icon. */
export function KindIcon({ hue, children }: { hue?: number; children: ReactNode }) {
    return (
        <span
            aria-hidden="true"
            className={`contents ${hue === undefined ? 'text-base-500 dark:text-base-600' : 'kind-icon'}`}
            style={hue === undefined ? undefined : ({ '--lar-kind-hue': hue } as CSSProperties)}
        >
            {children}
        </span>
    );
}
