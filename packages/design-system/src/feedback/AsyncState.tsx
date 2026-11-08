import type { ReactNode } from 'react';

import { Button } from '../actions/Button';
import { Alert } from './Alert';
import { SkeletonLoader } from './SkeletonLoader';

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
    /** The retry button's label, such as "Try again". */
    retryLabel?: string;
    /** Spins the retry button while the retry runs. */
    retrying?: boolean;
}

/** Owns a region's loading geometry and load failure; use Alert for other operation feedback. */
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
}: AsyncStateProps) {
    if (loading) {
        return (
            <SkeletonLoader label={label}>
                {placeholder ?? <SkeletonLoader.Shape presentation={presentation} />}
            </SkeletonLoader>
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
                    <Button type="button" onClick={onRetry} variant="primary" loading={retrying}>
                        {retryLabel}
                    </Button>
                ) : undefined
            }
        />
    );
}
