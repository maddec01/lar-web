import { useEffect, useState } from 'react';

/**
 * Scrolls `row` sideways, never its page, just far enough to show all of `item`. A snapping row settles on an item's
 * start, so it scrolls to the first start that still shows all of `item`.
 */
export function revealInRow(row: HTMLElement, item: Element | null | undefined) {
    if (!item) return;

    const bounds = row.getBoundingClientRect();
    const { left, right } = item.getBoundingClientRect();
    const fit = right - bounds.right;
    const style = getComputedStyle(row);
    const padding = parseFloat(style.scrollPaddingLeft) || 0;
    const starts =
        style.scrollSnapType && style.scrollSnapType !== 'none'
            ? Array.from(row.children, (child) => child.getBoundingClientRect().left - bounds.left - padding).filter(
                  (start) => start >= fit,
              )
            : [];
    const offset = left < bounds.left ? left - bounds.left : fit > 0 ? (starts.length ? Math.min(...starts) : fit) : 0;

    if (offset) row.scrollTo({ left: row.scrollLeft + offset, behavior: 'smooth' });
}

/**
 * Pairs a `ScrollRow` with `ScrollRowArrows` placed elsewhere, such as in its section header. `content` is a stable
 * key for what the row shows, such as its item count, so the arrows re-measure when it changes.
 */
export function useScrollRow(content?: unknown) {
    const [row, setRow] = useState<HTMLUListElement | null>(null);
    const [ends, setEnds] = useState({ back: false, forward: false });

    useEffect(() => {
        const measure = () => {
            const back = Boolean(row && row.scrollLeft > 1);
            const forward = Boolean(row && row.scrollLeft + row.clientWidth < row.scrollWidth - 1);

            setEnds((current) => (current.back === back && current.forward === forward ? current : { back, forward }));
        };

        measure();

        if (!row) return;

        const observer = new ResizeObserver(measure);

        observer.observe(row);
        row.addEventListener('scroll', measure, { passive: true });

        return () => {
            observer.disconnect();
            row.removeEventListener('scroll', measure);
        };
    }, [row, content]);

    return {
        row,
        setRow,
        canScrollBack: ends.back,
        canScrollForward: ends.forward,
        scroll: (direction: 1 | -1) => row?.scrollBy({ left: direction * row.clientWidth * 0.8, behavior: 'smooth' }),
    };
}
