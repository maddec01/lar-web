import { Alert } from '@ninna-ui/feedback';
import type { ReactNode } from 'react';

import { Button } from '../actions/Button';
import { SkeletonLoader } from './SkeletonLoader';

interface AsyncStateProps {
    placeholder?: ReactNode;
    error?: string;
    errorTitle: string;
    label: string;
    loading: boolean;
    onRetry?: () => void;
    presentation?: 'card' | 'line';
    retryLabel?: string;
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
            color="danger"
            title={errorTitle}
            description={error}
            showIcon
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
