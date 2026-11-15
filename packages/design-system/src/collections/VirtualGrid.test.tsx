import { render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vite-plus/test';

import { SkeletonLoader } from '../feedback/SkeletonLoader';
import { VirtualGrid } from './VirtualGrid';

afterEach(() => {
    vi.restoreAllMocks();
});

describe('VirtualGrid', () => {
    it('sizes one-line rows by their loaded cards, not the taller placeholders measured before them', async () => {
        // Placeholders stand 300px tall; a loaded one-line card 100px, under the 1-line estimate.
        vi.spyOn(HTMLElement.prototype, 'offsetHeight', 'get').mockImplementation(function (this: HTMLElement) {
            return this.querySelector('[data-slot="skeleton"]') ? 300 : 100;
        });
        vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue({
            x: 0,
            y: 0,
            top: 0,
            bottom: 800,
            left: 0,
            right: 1_024,
            width: 1_024,
            height: 800,
            toJSON: () => ({}),
        });

        const props = {
            count: 24,
            label: 'Artists',
            captionLines: 1 as const,
            itemKey: (index: number) => `artist-${index}`,
            onRangeChange: () => undefined,
        };
        const { rerender } = render(
            <VirtualGrid {...props} loading renderItem={() => <SkeletonLoader.Shape presentation="artwork" />} />,
        );

        await waitFor(() => expect(document.querySelector('[data-index="6"]')).not.toBeNull());
        rerender(<VirtualGrid {...props} renderItem={(index) => <span>Artist {index}</span>} />);

        // 1,024px holds six 157⅓px cards: a row is the art, 8px under it, one 20px line and the 20px row gap.
        const estimate = 1_024 / 6 - 80 / 6 + 8 + 20 + 20;

        await waitFor(() =>
            expect(Number.parseFloat(screen.getByText('Artist 6').parentElement!.style.top)).toBeCloseTo(estimate),
        );
    });
});
