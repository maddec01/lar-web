import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vite-plus/test';

import { VirtualList, type VirtualListProps } from './VirtualList';

const originalScrollY = Object.getOwnPropertyDescriptor(window, 'scrollY')!;

afterEach(() => {
    vi.restoreAllMocks();
    Object.defineProperty(window, 'scrollY', originalScrollY);
});

describe('VirtualList', () => {
    it('reads only mounted slots when a sectioned 100,000-item catalog scrolls or receives page data', async () => {
        vi.spyOn(HTMLElement.prototype, 'offsetHeight', 'get').mockImplementation(function (this: HTMLElement) {
            return this.matches('[data-index]') && this.querySelector('[data-testid="section-header"]') ? 104 : 64;
        });
        vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue({
            x: 0,
            y: 0,
            top: 0,
            bottom: 64,
            left: 0,
            right: 1_024,
            width: 1_024,
            height: 64,
            toJSON: () => ({}),
        });

        const itemAt = vi.fn((index: number) => ({ id: `track-${index}`, title: `Track ${index}`, index }));
        const itemKey = vi.fn((index: number) => `track-${index}`);
        const onRangeChange = vi.fn();
        const props: VirtualListProps<{ id: string; title: string; index: number }> = {
            count: 100_000,
            label: 'Tracks',
            columns: [
                {
                    id: 'title',
                    label: 'Title',
                    size: 'primary' as const,
                    render: (item) => item.title,
                },
            ],
            itemAt,
            itemKey,
            itemLabel: (item) => item.title,
            onRangeChange,
            section: {
                isStart: (_item, index) => index % 10 === 0,
                render: (item) => (
                    <div data-testid="section-header" className="h-10">
                        Section {item.index / 10}
                    </div>
                ),
            },
        };
        const { rerender } = render(<VirtualList {...props} />);

        await waitFor(() => expect(screen.getByRole('cell', { name: 'Track 0' })).toBeInTheDocument());
        expect(screen.getByText('Section 0')).toBeInTheDocument();
        await waitFor(() =>
            expect(screen.getByRole('cell', { name: 'Track 1' }).closest('[data-index]')).toHaveStyle({
                top: '104px',
            }),
        );
        expect(itemAt.mock.calls.length).toBeLessThan(200);
        expect(itemKey.mock.calls.length).toBeLessThan(200);
        itemAt.mockClear();
        itemKey.mockClear();
        rerender(
            <VirtualList {...props} itemAt={(index) => itemAt(index)} itemKey={(index) => itemKey(index)} loading />,
        );
        expect(itemAt.mock.calls.length).toBeLessThan(100);
        expect(itemKey.mock.calls.length).toBeLessThan(100);
        itemAt.mockClear();
        itemKey.mockClear();
        Object.defineProperty(window, 'scrollY', { configurable: true, value: 64_000 });
        fireEvent.scroll(window);
        await waitFor(() => expect(onRangeChange.mock.lastCall?.[0]).toBeGreaterThan(900));
        expect(itemAt.mock.calls.length).toBeLessThan(200);
        expect(itemKey.mock.calls.length).toBeLessThan(200);
        expect(screen.getAllByRole('row').length).toBeLessThan(40);
    });
});
