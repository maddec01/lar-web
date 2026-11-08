import type { ReactNode } from 'react';

import { Artwork } from './Artwork';

interface PhotoStageProps {
    /** The photo's text alternative. */
    alt: string;
    /** The photo's own pixel size, so its frame holds the right shape before it loads. */
    width: number;
    /** The photo's height in pixels, which with its width sets the stage's shape. */
    height: number;
    /** The photo's address. */
    src?: string;
    /** The server is still preparing the photo. */
    pending?: boolean;
    /** The photo failed to load. */
    error?: boolean;
    /** Shown when there is no image to show. */
    fallback?: ReactNode;
    /** Opens the photo larger, usually in the ImageViewer. */
    viewAction?: { label: string; onClick: () => void };
}

/**
 * A photo's detail page opens with the photo itself: whole, at its own shape, as large as the page allows (never taller
 * than 70% of the window), on a quiet stage. Selecting it opens it larger.
 */
export function PhotoStage({ alt, width, height, src, pending, error, fallback, viewAction }: PhotoStageProps) {
    const ratio = width > 0 && height > 0 ? width / height : 3 / 2;

    return (
        <figure className="bg-fill-muted flex justify-center rounded-2xl p-3 sm:p-6">
            <div
                className="max-w-full shadow-(--shadow-raised)"
                style={{ aspectRatio: String(ratio), width: `min(100%, calc(70vh * ${ratio}))` }}
            >
                <Artwork
                    alt={alt}
                    aspect="fill"
                    src={src}
                    pending={pending}
                    error={error}
                    fallback={fallback}
                    viewAction={viewAction}
                />
            </div>
        </figure>
    );
}
