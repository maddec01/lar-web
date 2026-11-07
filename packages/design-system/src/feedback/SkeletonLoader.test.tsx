import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vite-plus/test';

import { SkeletonLoader } from './SkeletonLoader';

describe('SkeletonLoader', () => {
    it('exposes one accessible busy region for composed placeholder shapes', () => {
        render(
            <SkeletonLoader label="Loading media">
                <SkeletonLoader.Shape presentation="circle" />
                <SkeletonLoader.Shape presentation="line" width="wide" />
                <SkeletonLoader.Shape presentation="control" />
                <SkeletonLoader.Shape presentation="card" />
            </SkeletonLoader>,
        );

        const loader = screen.getByRole('status', { name: 'Loading media' });

        expect(loader).toHaveAttribute('aria-busy', 'true');
        expect(within(loader).queryByRole('status')).not.toBeInTheDocument();
    });

    it('removes the busy region when loading finishes', () => {
        const { rerender } = render(
            <SkeletonLoader label="Loading media">
                <SkeletonLoader.Shape presentation="card" />
            </SkeletonLoader>,
        );

        rerender(
            <SkeletonLoader label="Loading media" loading={false}>
                <button type="button">Ready</button>
            </SkeletonLoader>,
        );

        expect(screen.queryByRole('status', { name: 'Loading media' })).not.toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Ready' })).toBeInTheDocument();
    });
});
