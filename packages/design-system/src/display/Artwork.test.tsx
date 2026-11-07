import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vite-plus/test';

import { Artwork } from './Artwork';

const originalDecode = Object.getOwnPropertyDescriptor(HTMLImageElement.prototype, 'decode');

afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();

    if (originalDecode) Object.defineProperty(HTMLImageElement.prototype, 'decode', originalDecode);
    else Reflect.deleteProperty(HTMLImageElement.prototype, 'decode');
});

describe('Artwork', () => {
    it('keeps the artwork skeleton from byte fetching through image decoding', async () => {
        let finishDecode: (() => void) | undefined;

        Object.defineProperty(HTMLImageElement.prototype, 'decode', {
            configurable: true,
            value: vi.fn(
                () =>
                    new Promise<void>((resolve) => {
                        finishDecode = resolve;
                    }),
            ),
        });

        const { container, rerender } = render(<Artwork alt="Cover" pending />);

        expect(container.querySelector('[data-slot="skeleton"]')).toBeInTheDocument();
        expect(container.firstElementChild).toHaveAttribute('data-state', 'loading');
        rerender(<Artwork alt="Cover" src="blob:cover" />);
        fireEvent.load(screen.getByRole('img', { name: 'Cover' }));
        expect(screen.getByRole('img')).toHaveClass('opacity-0');
        expect(container.querySelector('[data-slot="skeleton"]')).toBeInTheDocument();
        await act(async () => finishDecode?.());
        expect(screen.getByRole('img')).toHaveClass('opacity-100');
        expect(container.querySelector('[data-slot="skeleton"]')).not.toBeInTheDocument();
    });

    it('ignores decoding that finishes after the source changes', async () => {
        const decodes: Array<() => void> = [];

        Object.defineProperty(HTMLImageElement.prototype, 'decode', {
            configurable: true,
            value: vi.fn(() => new Promise<void>((resolve) => decodes.push(resolve))),
        });

        const { container, rerender } = render(<Artwork alt="Cover" src="blob:first" />);

        fireEvent.load(screen.getByRole('img'));
        rerender(<Artwork alt="Cover" src="blob:second" />);
        fireEvent.load(screen.getByRole('img'));
        await act(async () => decodes[0]?.());
        expect(container.firstElementChild).toHaveAttribute('data-state', 'loading');
        expect(screen.getByRole('img')).toHaveClass('opacity-0');
        await act(async () => decodes[1]?.());
        expect(container.firstElementChild).toHaveAttribute('data-state', 'ready');
    });

    it('shows the failed-image fallback when decoding rejects', async () => {
        Object.defineProperty(HTMLImageElement.prototype, 'decode', {
            configurable: true,
            value: vi.fn().mockRejectedValue(new Error('Invalid image')),
        });

        const { container } = render(<Artwork alt="Cover" src="blob:broken" errorLabel="Image unavailable" />);

        await act(async () => fireEvent.load(screen.getByRole('img', { name: 'Cover' })));
        expect(screen.getByRole('img', { name: 'Image unavailable' })).toBeInTheDocument();
        expect(container.firstElementChild).toHaveAttribute('data-state', 'placeholder');
        expect(container.querySelector('[data-slot="skeleton"]')).not.toBeInTheDocument();
    });

    it('uses native lazy loading and reveals newly loaded artwork', () => {
        const { container } = render(<Artwork alt="Blue Train" src="/artwork?size=256" />);
        const image = screen.getByRole('img', { name: 'Blue Train' });

        expect(image).toHaveAttribute('loading', 'lazy');
        expect(container.firstElementChild).toHaveAttribute('data-state', 'loading');
        fireEvent.load(image);
        expect(container.firstElementChild).toHaveAttribute('data-state', 'ready');
    });

    it('reveals a complete cached image on mount without replaying its fade', () => {
        vi.spyOn(HTMLImageElement.prototype, 'complete', 'get').mockReturnValue(true);
        vi.spyOn(HTMLImageElement.prototype, 'naturalWidth', 'get').mockReturnValue(256);

        const { container } = render(<Artwork alt="Cached" src="/cached" />);

        expect(container.firstElementChild).toHaveAttribute('data-state', 'ready');
        expect(screen.getByRole('img')).toHaveClass('opacity-100');
        expect(screen.getByRole('img')).not.toHaveClass('transition-opacity');
    });

    it('keeps processing visible over loaded artwork until metadata finishes', () => {
        const { container, rerender } = render(
            <Artwork alt="Artist" src="/portrait" loadingLabel="Processing artist" />,
        );

        fireEvent.load(screen.getByRole('img'));
        expect(screen.getByRole('status', { name: 'Processing artist' })).toBeInTheDocument();
        rerender(<Artwork alt="Artist" src="/portrait" />);
        expect(container.firstElementChild).toHaveAttribute('data-state', 'ready');
        expect(screen.getByRole('img')).toHaveClass('opacity-100');
    });

    it('returns to the neutral media placeholder when an activated source fails', () => {
        vi.stubGlobal('IntersectionObserver', undefined);

        const { container } = render(<Artwork alt="Kind of Blue" src="/missing" />);
        const image = screen.getByRole('img', { name: 'Kind of Blue' });

        fireEvent.error(image);

        expect(screen.queryByRole('img', { name: 'Kind of Blue' })).not.toBeInTheDocument();
        expect(container.firstElementChild).toHaveAttribute('data-state', 'placeholder');
    });

    it('replaces the media placeholder with an accessible processing indicator', () => {
        const { container, rerender } = render(<Artwork alt="Pending album artwork" />);

        expect(container.firstElementChild).toHaveAttribute('data-state', 'placeholder');

        rerender(<Artwork alt="Pending album artwork" loadingLabel="Processing album" />);

        expect(container.firstElementChild).toHaveAttribute('data-state', 'loading');
        expect(screen.getByRole('status', { name: 'Processing album' })).toBeInTheDocument();
    });

    it('announces queued work with a skeleton and keeps its spinner hidden', () => {
        vi.useFakeTimers();

        const { container, rerender } = render(<Artwork alt="Movie" src="/poster" pendingLabel="Metadata queued" />);

        act(() => {
            vi.advanceTimersByTime(200);
        });
        expect(screen.getByRole('status', { name: 'Metadata queued' })).toHaveAttribute('aria-busy', 'true');
        expect(container.querySelector('[data-slot="skeleton"]')).toBeInTheDocument();
        expect(screen.queryByRole('button')).not.toBeInTheDocument();

        rerender(<Artwork alt="Movie" loadingLabel="Fetching metadata" />);
        expect(screen.getByRole('button', { name: 'Fetching metadata' })).toBeInTheDocument();

        rerender(<Artwork alt="Movie" />);
        expect(screen.queryByRole('status')).not.toBeInTheDocument();
        expect(container.querySelector('[data-slot="skeleton"]')).not.toBeInTheDocument();
    });
});
