import type { ReactNode } from 'react';

const wrapping = { anywhere: 'break-all', never: 'whitespace-nowrap' } as const;

/**
 * A path or command inside a sentence, in the page's plain inline code (no chip, unlike Code): a path may break
 * `anywhere`, a command `never`.
 */
export function CodeText({ wrap, children }: { wrap: keyof typeof wrapping; children: ReactNode }) {
    return <code className={wrapping[wrap]}>{children}</code>;
}
