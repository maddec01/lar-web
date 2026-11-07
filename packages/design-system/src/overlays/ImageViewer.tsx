import { Loading } from '@ninna-ui/feedback';
import { Modal as NinnaModal } from '@ninna-ui/overlays';
import { XIcon } from 'lucide-react';
import { useId, useState } from 'react';

import { IconButton } from '../actions/IconButton';
import { useDesignSystemLabels } from '../foundations/DesignSystemProvider';
import { Text } from '../typography/Typography';
import { useModalAutoFocus } from './useModalAutoFocus';

interface ImageViewerProps {
    alt: string;
    caption?: string;
    onClose: () => void;
    open: boolean;
    /** Pixel size to show beside the caption; omit when unknown rather than guessing. */
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
    const loaded = Boolean(src) && loadedSource === src;
    const size = resolution ? labels.imageSize(resolution.width, resolution.height) : undefined;

    return (
        <NinnaModal open={open} onOpenChange={(next) => !next && onClose()}>
            <NinnaModal.Content
                {...focusProps}
                title={caption ?? alt}
                size="full"
                className="top-0 left-0 flex h-dvh max-h-none w-screen translate-x-0 translate-y-0 items-center justify-center overflow-hidden rounded-none border-0 bg-transparent p-4 shadow-none sm:top-0 sm:left-0 sm:h-dvh sm:w-screen sm:translate-x-0 sm:translate-y-0 sm:p-8"
                onClick={(event) => event.target === event.currentTarget && onClose()}
            >
                {/* The standard header close button, lightened because it always sits on the dark backdrop. */}
                <div className="absolute top-5 right-5 z-10 [--color-header-icon:#ffffff] sm:top-6 sm:right-6">
                    <NinnaModal.Close asChild>
                        <IconButton aria-label={labels.close} icon={<XIcon />} variant="header" />
                    </NinnaModal.Close>
                </div>
                {loaded ? null : (
                    <span className="pointer-events-none absolute inset-0 flex items-center justify-center text-white/80">
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
                                if (image?.complete && image.naturalWidth > 0) setLoadedSource(src);
                            }}
                            onLoad={() => setLoadedSource(src)}
                            onError={() => setLoadedSource(src)}
                            className={`pointer-events-auto max-h-[calc(100dvh-7rem)] max-w-full rounded-lg object-contain shadow-2xl transition-opacity duration-200 motion-reduce:transition-none sm:max-h-[calc(100dvh-9rem)] ${loaded ? 'opacity-100' : 'opacity-0'}`}
                        />
                    ) : null}
                    {caption || size ? (
                        <figcaption className="flex max-w-prose flex-wrap items-baseline justify-center gap-x-3 gap-y-1 text-center">
                            {caption ? (
                                <Text
                                    id={captionId}
                                    as="span"
                                    className="wrap-break-word text-white/90"
                                    variant="label"
                                >
                                    {caption}
                                </Text>
                            ) : null}
                            {size ? (
                                <Text as="span" className="text-white/60 tabular-nums" variant="caption">
                                    {size}
                                </Text>
                            ) : null}
                        </figcaption>
                    ) : null}
                </figure>
            </NinnaModal.Content>
        </NinnaModal>
    );
}
