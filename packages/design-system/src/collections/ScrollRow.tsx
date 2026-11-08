import { ChevronRightIcon } from 'lucide-react';
import { type ReactNode, type Ref, useCallback } from 'react';

import { IconButton } from '../actions/IconButton';
import { ImageCard } from '../display/ImageCard';
import { SkeletonLoader } from '../feedback/SkeletonLoader';
import { Inline } from '../layout/Flow';
import { useScrollFade } from '../overlays/useScrollFade';

const row = '-mx-1 flex snap-x scroll-px-1 gap-4 overflow-x-auto px-1 pt-1 pb-3';

/** One row of wide cards, such as video stills, that scrolls sideways instead of wrapping; it fades at each edge
 *  with more cards beyond it. */
export function ScrollRow({
    ref,
    label,
    loading = false,
    loadingLabel = label,
    children,
}: {
    /** The row's list element, which scrolls; useScrollRow's ref. */
    ref: Ref<HTMLUListElement>;
    /** Names the list for screen readers, such as "Episodes". */
    label: string;
    /** The cards are on their way: placeholders take their place. */
    loading?: boolean;
    /** What screen readers hear while the cards load. */
    loadingLabel?: string;
    /** The cards, each a ScrollRowItem. */
    children?: ReactNode;
}) {
    const { setViewport, className: fade } = useScrollFade({ axis: 'horizontal', row: true });
    const setRow = useCallback(
        (element: HTMLUListElement | null) => {
            setViewport(element);

            if (typeof ref === 'function') ref(element);
            else if (ref) ref.current = element;
        },
        [ref, setViewport],
    );

    if (loading)
        return (
            <SkeletonLoader label={loadingLabel}>
                <div ref={setViewport} className={`${row} ${fade}`}>
                    {Array.from({ length: 4 }, (_, index) => (
                        // The cards' own placeholder, its caption's three rows included, so they arrive in place.
                        <div key={index} className="w-64 shrink-0">
                            <ImageCard loading aspect="video" />
                        </div>
                    ))}
                </div>
            </SkeletonLoader>
        );

    return (
        <ul tabIndex={0} ref={setRow} aria-label={label} className={`${row} ${fade}`}>
            {children}
        </ul>
    );
}

/** `value` identifies the item, so its row can scroll to it. */
export function ScrollRowItem({
    value,
    children,
}: {
    /** Identifies the item, so its row can scroll to it. */
    value?: string;
    /** The item's card. */
    children: ReactNode;
}) {
    return (
        <li data-value={value} className="w-64 shrink-0 snap-start">
            {children}
        </li>
    );
}

/** Each arrow is disabled at its end of the row, so both are while the row fits; `size="sm"` draws them 28px, as dense
 *  tools do. */
export function ScrollRowArrows({
    onScroll,
    canScrollBack,
    canScrollForward,
    backLabel,
    forwardLabel,
    size = 'md',
}: {
    /** Called with the direction to scroll, a page back (-1) or forward (1). */
    onScroll: (direction: 1 | -1) => void;
    /** Cards lie before the left edge. */
    canScrollBack: boolean;
    /** Cards lie past the right edge. */
    canScrollForward: boolean;
    /** The back arrow's accessible name, such as "Previous". */
    backLabel: string;
    /** The forward arrow's accessible name, such as "Next". */
    forwardLabel: string;
    /** 28px arrows, as dense tools draw them. */
    size?: 'sm' | 'md';
}) {
    return (
        <Inline space="tight">
            <IconButton
                {...(size === 'sm' ? { variant: 'title-bar' as const } : {})}
                aria-label={backLabel}
                title={backLabel}
                disabled={!canScrollBack}
                icon={
                    <span className="flex rotate-180">
                        <ChevronRightIcon />
                    </span>
                }
                onClick={() => onScroll(-1)}
            />
            <IconButton
                {...(size === 'sm' ? { variant: 'title-bar' as const } : {})}
                aria-label={forwardLabel}
                title={forwardLabel}
                disabled={!canScrollForward}
                icon={<ChevronRightIcon />}
                onClick={() => onScroll(1)}
            />
        </Inline>
    );
}
