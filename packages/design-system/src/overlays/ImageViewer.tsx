import { Loading } from '@ninna-ui/feedback';
import { Modal as NinnaModal } from '@ninna-ui/overlays';
import { XIcon } from 'lucide-react';
import { useId, useState } from 'react';

import { IconButton } from '../actions/IconButton';
import { useDesignSystemLabels } from '../foundations/DesignSystemProvider';
import { TextBase } from '../typography/Typography';
import { useModalAutoFocus } from './useModalAutoFocus';

interface ImageViewerProps {
    /** The image's text alternative. */
    alt: string;
    /** A line under the image, such as its file name. */
    caption?: string;
    /** Called as the reader closes the viewer. */
    onClose: () => void;
    /** The viewer is showing. */
    open: boolean;
    /** Original pixel size, when known. Otherwise the loaded image’s natural dimensions appear beside the caption. */
    resolution?: { height: number; width: number };
    /** Omit while the image is not ready yet (still loading, authenticating, and so on); shows the
     * same loading indicator as a slow-loading image rather than a broken one. */
    src?: string;
}

/**
 * Shows one image at its natural size over the blurred modal backdrop, scaled down only when it would not fit.
 * Clicking anywhere except the image, the close button, or Escape dismisses it.
 */
export function ImageViewer({ alt, caption, onClose, open, resolution, src }: ImageViewerProps) {
    const labels = useDesignSystemLabels();
    const focusProps = useModalAutoFocus();
    const captionId = useId();
    const [loadedSource, setLoadedSource] = useState<string>();
    const [naturalSize, setNaturalSize] = useState<{ src: string; width: number; height: number }>();
    const rememberImage = (image: HTMLImageElement) => {
        if (!src || image.naturalWidth <= 0 || image.naturalHeight <= 0) return;

        setLoadedSource(src);
        setNaturalSize((current) =>
            current?.src === src && current.width === image.naturalWidth && current.height === image.naturalHeight
                ? current
                : { src, width: image.naturalWidth, height: image.naturalHeight },
        );
    };
    const dimensions = resolution ?? (naturalSize?.src === src ? naturalSize : undefined);
    const loaded = Boolean(src) && loadedSource === src;
    const size = dimensions ? labels.imageSize(dimensions.width, dimensions.height) : undefined;

    return (
        <NinnaModal open={open} onOpenChange={(next) => !next && onClose()}>
            <NinnaModal.Content
                {...focusProps}
                data-full-bleed=""
                title={caption ?? alt}
                size="full"
                className="dark lar-dark-palette bg-surface-page text-fg top-0 left-0 flex h-dvh max-h-none w-screen translate-x-0 translate-y-0 items-center justify-center overflow-hidden rounded-none border-0 p-4 shadow-none sm:top-0 sm:left-0 sm:h-dvh sm:w-screen sm:translate-x-0 sm:translate-y-0 sm:p-8"
                onClick={(event) => event.target === event.currentTarget && onClose()}
            >
                {/* The viewer is a dark stage in both themes (the dark palette, scoped), so the photo and its caption read the same. */}
                <div className="absolute top-5 right-5 z-10 sm:top-6 sm:right-6">
                    <NinnaModal.Close asChild>
                        <IconButton aria-label={labels.close} icon={<XIcon />} variant="header" />
                    </NinnaModal.Close>
                </div>
                {loaded ? null : (
                    <span className="text-fg-soft pointer-events-none absolute inset-0 flex items-center justify-center">
                        <Loading size="lg" />
                    </span>
                )}
                {/* Only the image itself catches clicks; the space around it and the caption fall through to close. */}
                <figure
                    aria-labelledby={caption ? captionId : undefined}
                    className="pointer-events-none m-0 flex max-w-full flex-col items-center gap-3"
                >
                    {src ? (
                        <img
                            alt={alt}
                            src={src}
                            decoding="async"
                            ref={(image) => {
                                if (image?.complete) rememberImage(image);
                            }}
                            onLoad={(event) => rememberImage(event.currentTarget)}
                            onError={() => setLoadedSource(src)}
                            className={`pointer-events-auto max-h-[calc(100dvh-7rem)] max-w-full rounded-lg object-contain shadow-(--shadow-dialog) transition-opacity duration-(--motion-duration-base) motion-reduce:transition-none sm:max-h-[calc(100dvh-9rem)] ${loaded ? 'opacity-100' : 'opacity-0'}`}
                        />
                    ) : null}
                    {caption || size ? (
                        <figcaption className="flex max-w-prose flex-wrap items-baseline justify-center gap-x-3 gap-y-1 text-center">
                            {caption ? (
                                <TextBase id={captionId} as="span" className="wrap-break-word" variant="label">
                                    {caption}
                                </TextBase>
                            ) : null}
                            {size ? (
                                <TextBase as="span" className="tabular-nums" tone="soft" variant="caption">
                                    {size}
                                </TextBase>
                            ) : null}
                        </figcaption>
                    ) : null}
                </figure>
            </NinnaModal.Content>
        </NinnaModal>
    );
}
