import { type RefObject, useLayoutEffect } from 'react';

import { revealInRow } from '../collections/useScrollRow';

/** A controlled selection stays visible when changed from outside the row, or when the row becomes narrower.
 * Reveal only in this row; scrollIntoView would also move the containing dialog or page. */
export function useRevealSelection(ref: RefObject<HTMLElement | null>, value: string | undefined, loading = false) {
    useLayoutEffect(() => {
        const row = ref.current;

        if (!row || loading) return;

        const reveal = () => revealInRow(row, row.querySelector('[aria-selected="true"], [aria-pressed="true"]'));
        const observer = new ResizeObserver(reveal);

        observer.observe(row);
        reveal();

        return () => observer.disconnect();
    }, [ref, value, loading]);
}
