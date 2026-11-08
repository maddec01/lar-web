import { fireEvent, render, screen } from '@testing-library/react';
import { expect, it, vi } from 'vite-plus/test';

import { DesignSystemProvider } from '../foundations/DesignSystemProvider';
import { ImageViewer } from './ImageViewer';

it('uses the loaded artwork dimensions and never carries them to a different image', () => {
    const view = (src: string, resolution?: { width: number; height: number }) => (
        <DesignSystemProvider>
            <ImageViewer open src={src} caption="Album cover" alt="Cover" onClose={vi.fn()} resolution={resolution} />
        </DesignSystemProvider>
    );
    const { rerender } = render(view('cover-a.png'));
    const image = screen.getByRole('img', { name: 'Cover' });

    Object.defineProperties(image, { naturalWidth: { value: 1200 }, naturalHeight: { value: 800 } });
    fireEvent.load(image);
    expect(screen.getByText(/1200.*800/)).toBeInTheDocument();
    rerender(view('cover-b.png'));
    expect(screen.queryByText(/1200.*800/)).not.toBeInTheDocument();
    rerender(view('cover-b.png', { width: 6000, height: 4000 }));
    expect(screen.getByText(/6000.*4000/)).toBeInTheDocument();
});
