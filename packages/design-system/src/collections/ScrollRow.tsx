import { ChevronRightIcon } from 'lucide-react';
import type { ReactNode, Ref } from 'react';

import { IconButton } from '../actions/IconButton';
import { SkeletonLoader } from '../feedback/SkeletonLoader';
import { Inline } from '../layout/Flow';

const row = '-mx-1 flex snap-x scroll-px-1 gap-4 overflow-x-auto px-1 pt-1 pb-3';

/** One row of wide cards, such as video stills, that scrolls sideways instead of wrapping. */
export function ScrollRow({
    ref,
    label,
    loading = false,
    loadingLabel = label,
    children,
}: {
    ref: Ref<HTMLUListElement>;
    label: string;
    loading?: boolean;
    loadingLabel?: string;
    children?: ReactNode;
}) {
    if (loading)
        return (
            <SkeletonLoader label={loadingLabel}>
                <div className={row}>
                    {Array.from({ length: 4 }, (_, index) => (
                        <div key={index} className="flex w-64 shrink-0 flex-col gap-2">
                            <SkeletonLoader.Shape presentation="video" />
                            <SkeletonLoader.Shape width="wide" />
                        </div>
                    ))}
                </div>
            </SkeletonLoader>
        );

    return (
        <ul ref={ref} aria-label={label} className={row}>
            {children}
        </ul>
    );
}

/** `value` identifies the item, so its row can scroll to it. */
export function ScrollRowItem({ value, children }: { value?: string; children: ReactNode }) {
    return (
        <li data-value={value} className="w-64 shrink-0 snap-start">
            {children}
        </li>
    );
}

/** Each arrow is disabled at its end of the row, so both are while the row fits. */
export function ScrollRowArrows({
    onScroll,
    canScrollBack,
    canScrollForward,
    backLabel,
    forwardLabel,
}: {
    onScroll: (direction: 1 | -1) => void;
    canScrollBack: boolean;
    canScrollForward: boolean;
    backLabel: string;
    forwardLabel: string;
}) {
    return (
        <Inline space="tight">
            <IconButton
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
                aria-label={forwardLabel}
                title={forwardLabel}
                disabled={!canScrollForward}
                icon={<ChevronRightIcon />}
                onClick={() => onScroll(1)}
            />
        </Inline>
    );
}
