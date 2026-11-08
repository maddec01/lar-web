import { useEffect, useState } from 'react';

/** The part of an image that isn't transparent (with a hair of bleed for antialiased edges), as fractions of its
 *  size, that part's aspect ratio, and the aspect of the visible content alone. */
export interface VisibleBounds {
    x: number;
    y: number;
    width: number;
    height: number;
    aspect: number;
    /** The visible content's own aspect, without the bleed: what a caller judges the artwork's proportions by. */
    contentAspect: number;
}

export type VisibleBoundsResult =
    | { state: 'pending' }
    | { state: 'failed' }
    | { state: 'ready'; bounds: VisibleBounds };

// Small enough to scan at once, large enough that the crop lands within a pixel or two of the drawn edge.
const sampleSize = 512;
const visibleAlpha = 16;

/**
 * Measures an image's visible content, so artwork drawn with wide transparent margins (title logos often are) can be
 * sized by what shows instead of by its canvas. An image the page may not read (a cross-origin one without CORS)
 * counts as all visible; one that doesn't load, or has nothing visible, is `failed`.
 */
export function useVisibleBounds(src: string | undefined): VisibleBoundsResult {
    const [result, setResult] = useState<{ src: string; result: VisibleBoundsResult }>();

    useEffect(() => {
        if (!src) return;

        let current = true;
        const image = new Image();

        image.decoding = 'async';
        image.onload = () => {
            if (current) setResult({ src, result: measure(image) });
        };
        image.onerror = () => {
            if (current) setResult({ src, result: { state: 'failed' } });
        };
        image.src = src;

        return () => {
            current = false;
        };
    }, [src]);

    return src && result?.src === src ? result.result : { state: 'pending' };
}

function measure(image: HTMLImageElement): VisibleBoundsResult {
    const naturalWidth = image.naturalWidth || 300;
    const naturalHeight = image.naturalHeight || 150;
    const whole: VisibleBoundsResult = {
        state: 'ready',
        bounds: {
            x: 0,
            y: 0,
            width: 1,
            height: 1,
            aspect: naturalWidth / naturalHeight,
            contentAspect: naturalWidth / naturalHeight,
        },
    };
    const scale = Math.min(1, sampleSize / Math.max(naturalWidth, naturalHeight));
    const width = Math.max(1, Math.round(naturalWidth * scale));
    const height = Math.max(1, Math.round(naturalHeight * scale));
    const context = document.createElement('canvas').getContext('2d', { willReadFrequently: true });

    if (!context) return whole;

    context.canvas.width = width;
    context.canvas.height = height;

    let pixels: Uint8ClampedArray;

    try {
        context.drawImage(image, 0, 0, width, height);
        pixels = context.getImageData(0, 0, width, height).data;
    } catch {
        return whole;
    }

    let left = width;
    let right = -1;
    let top = height;
    let bottom = -1;

    for (let y = 0; y < height; y += 1)
        for (let x = 0; x < width; x += 1)
            if (pixels[(y * width + x) * 4 + 3]! > visibleAlpha) {
                left = Math.min(left, x);
                right = Math.max(right, x);
                top = Math.min(top, y);
                bottom = Math.max(bottom, y);
            }

    if (right < 0) return { state: 'failed' };

    const contentAspect = ((right - left + 1) * naturalWidth * height) / ((bottom - top + 1) * naturalHeight * width);

    // One sample of bleed on each side keeps antialiased edges whole.
    left = Math.max(0, left - 1);
    top = Math.max(0, top - 1);
    right = Math.min(width, right + 2);
    bottom = Math.min(height, bottom + 2);

    const bounds = {
        x: left / width,
        y: top / height,
        width: (right - left) / width,
        height: (bottom - top) / height,
    };

    return {
        state: 'ready',
        bounds: { ...bounds, aspect: (bounds.width * naturalWidth) / (bounds.height * naturalHeight), contentAspect },
    };
}
