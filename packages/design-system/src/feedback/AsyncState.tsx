import { type ReactNode, useEffect, useState } from 'react';

import { Button } from '../actions/Button';
import { useDesignSystemLabels } from '../foundations/DesignSystemProvider';
import { Alert } from './Alert';
import { SpinnerIcon } from './Loading';
import { SkeletonLoader } from './SkeletonLoader';

/** How long a region loads before it says it is still trying, rather than leave a silent skeleton. */
const SLOW_MS = 3_000;

interface AsyncStateProps {
    /** The region's own skeleton while it loads, in place of the presentation's. */
    placeholder?: ReactNode;
    /** What went wrong; without it, and not loading, it renders nothing. */
    error?: string;
    /** The failure's title, such as "Couldn't load the activity". */
    errorTitle: string;
    /** Names what is loading for screen readers. */
    label: string;
    /** Draws the skeleton in the region's place. */
    loading: boolean;
    /** Called by the retry button; with `retryLabel`, the failure offers one. */
    onRetry?: () => void;
    /** The skeleton's shape: a `card`, or a `line` of text. */
    presentation?: 'card' | 'line';
    /** The retry button's label, such as "Try again". Always the outline (secondary) button. */
    retryLabel?: string;
    /** Spins the retry button while the retry runs. */
    retrying?: boolean;
    /** What it says under the skeleton once it has loaded for three seconds, such as "Still trying…"; the design
     *  system's `stillTrying` label by default. */
    slowLabel?: string;
}

/** True once `active` has held for `ms`; false again as soon as it stops. */
function useHeldFor(active: boolean, ms: number) {
    const [held, setHeld] = useState(false);

    useEffect(() => {
        if (!active) return;

        const timer = setTimeout(() => setHeld(true), ms);

        // The next load starts its own three seconds.
        return () => {
            clearTimeout(timer);
            setHeld(false);
        };
    }, [active, ms]);

    return active && held;
}

/** Owns a region's loading geometry and load failure; use Alert for other operation feedback. A load that takes more
 *  than three seconds says so under its skeleton ("Still trying…"), so a slow or retrying server never reads as an
 *  empty or frozen page; a failure is a danger Alert whose Try again is the outline button. */
export function AsyncState({
    error,
    errorTitle,
    label,
    loading,
    onRetry,
    presentation = 'card',
    placeholder,
    retryLabel,
    retrying = false,
    slowLabel,
}: AsyncStateProps) {
    const labels = useDesignSystemLabels();
    const slow = useHeldFor(loading, SLOW_MS);

    if (loading) {
        const skeleton = (
            <SkeletonLoader label={label}>
                {placeholder ?? <SkeletonLoader.Shape presentation={presentation} />}
            </SkeletonLoader>
        );

        if (!slow) return skeleton;

        return (
            <div data-slot="async-state" data-slow className="flex flex-col gap-2">
                {skeleton}
                <p role="status" className="text-fg-muted m-0 flex items-center gap-1.5 text-xs">
                    <SpinnerIcon aria-hidden="true" className="size-3" />
                    {slowLabel ?? labels.stillTrying}
                </p>
            </div>
        );
    }

    if (!error) return null;

    return (
        <Alert
            tone="danger"
            title={errorTitle}
            description={error}
            action={
                onRetry && retryLabel ? (
                    <Button type="button" onClick={onRetry} variant="secondary" busy={retrying}>
                        {retryLabel}
                    </Button>
                ) : undefined
            }
        />
    );
}
