import type { ComponentProps, ReactNode } from 'react';

import { Text } from '../typography/Typography';

type ProgressProps = Omit<ComponentProps<'div'>, 'children' | 'className' | 'style'> & {
    value: number;
    max?: number;
    /** Muted text after the bar, such as "Step 2 of 4". */
    caption?: ReactNode;
};

/**
 * A determinate progress bar: a rounded track filled to value / max, then an optional caption. Its props (an
 * `aria-label`, say) go on the progressbar. Use ProgressStatusRow for a task's status row and StackedMeter for shares
 * of a whole.
 */
export function Progress({ caption, value, max = 100, ...props }: ProgressProps) {
    const share = max > 0 ? Math.min(Math.max(value / max, 0), 1) : 0;

    return (
        <div className="flex items-center gap-2" data-slot="progress">
            <div
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={max}
                aria-valuenow={value}
                className="bg-base-200 h-2 max-w-65 flex-1 overflow-hidden rounded-full"
                data-slot="progress-bar"
                {...props}
            >
                <div
                    className="bg-primary h-full rounded-[inherit]"
                    style={{ width: `${share * 100}%` }}
                    data-slot="progress-indicator"
                />
            </div>
            {caption && (
                <Text as="span" variant="caption" tone="muted" data-slot="progress-caption">
                    {caption}
                </Text>
            )}
        </div>
    );
}
