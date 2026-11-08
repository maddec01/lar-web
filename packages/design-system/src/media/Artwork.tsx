import { type HTMLAttributeReferrerPolicy, type ReactNode, useCallback, useEffect, useRef, useState } from 'react';

import { ItemAction, type ItemActionProps } from '../display/ItemAction';
import { SkeletonLoader } from '../feedback/SkeletonLoader';
import { tabbable } from '../foundations/KeyboardFocus';

export interface ArtworkProps {
    /** The image's text alternative. */
    alt: string;
    /** `fill` takes the size of its parent, such as a frame already at the image's own ratio. */
    aspect?: 'square' | 'video' | 'poster' | 'logo' | 'fill';
    /** The image failed to load: the fallback shows with the error label. */
    error?: boolean;
    /** What the art says when the image failed, such as "Artwork unavailable". */
    errorLabel?: string;
    /** What shows without an image, such as the kind's icon. */
    fallback?: ReactNode;
    /** What screen readers hear while the image loads. */
    loadingLabel?: string;
    /** What the art says while the server is still fetching the image. */
    pendingLabel?: string;
    /** A corner button that changes the art, such as "Choose artwork". */
    editAction?: ItemActionProps;
    /** Makes the whole image a button, typically to enlarge it; offered only when there is an image to show. */
    viewAction?: { label: string; onClick: () => void };
    /** Shows a spinner while the image loads, for art that takes a while. */
    showLoadingIndicator?: boolean;
    /** The server is still fetching the image. */
    pending?: boolean;
    /** The image request's referrer policy, such as `no-referrer` for a provider's image. */
    referrerPolicy?: HTMLAttributeReferrerPolicy;
    /** The image's `sizes`, for picking from `srcSet`. */
    sizes?: string;
    /** The image's address; none shows the fallback. */
    src?: string;
    /** The image at several widths. */
    srcSet?: string;
}

export function Artwork({
    alt,
    aspect = 'square',
    error = false,
    errorLabel,
    fallback,
    loadingLabel,
    pendingLabel,
    editAction,
    viewAction,
    showLoadingIndicator = true,
    pending = false,
    referrerPolicy,
    sizes,
    src,
    srcSet,
}: ArtworkProps) {
    const [failedSource, setFailedSource] = useState<string>();
    const [loadedSource, setLoadedSource] = useState<string>();
    const [slowSource, setSlowSource] = useState<string>();
    const imageRef = useRef<HTMLImageElement | null>(null);
    const failed = error || Boolean(src && failedSource === src);
    const loaded = Boolean(src && !failed && loadedSource === src);
    const shouldLoad = Boolean(src && !failed);
    const loading = !loaded && !failed && Boolean(pending || pendingLabel || loadingLabel || shouldLoad);
    const state = loadingLabel || pendingLabel ? 'loading' : loaded ? 'ready' : loading ? 'loading' : 'placeholder';
    const showLoading = state === 'loading' && Boolean(loadingLabel || (!pendingLabel && src && slowSource === src));
    const revealImage = useCallback((image: HTMLImageElement, source: string | undefined) => {
        if (!source) return;

        const current = () => imageRef.current === image && image.getAttribute('src') === source;
        const reveal = () => {
            if (!current()) return;

            setLoadedSource(source);
        };

        if (typeof image.decode === 'function') {
            void image.decode().then(reveal, () => {
                if (current()) setFailedSource(source);
            });
        } else reveal();
    }, []);
    const attachImage = useCallback(
        (image: HTMLImageElement | null) => {
            imageRef.current = image;

            if (image?.complete && image.naturalWidth > 0) revealImage(image, src);
        },
        [revealImage, src],
    );

    useEffect(() => {
        if (!shouldLoad || loaded) return;

        const timeout = window.setTimeout(() => setSlowSource(src), 150);

        return () => window.clearTimeout(timeout);
    }, [loaded, shouldLoad, src]);

    return (
        <div
            role={pendingLabel ? 'status' : undefined}
            aria-label={pendingLabel}
            aria-busy={state === 'loading'}
            className={`relative overflow-hidden rounded-lg ${aspect === 'fill' ? 'bg-fill-muted size-full' : aspect === 'logo' ? 'lar-artwork-stage aspect-[3/1]' : aspect === 'poster' ? 'bg-fill-muted aspect-[2/3]' : aspect === 'video' ? 'bg-fill-muted aspect-video' : 'bg-fill-muted aspect-square'}`}
            data-state={state}
        >
            {loading ? (
                <div className="absolute inset-0">
                    <SkeletonLoader.Shape presentation={aspect === 'poster' ? 'poster' : 'artwork'} />
                </div>
            ) : !loaded ? (
                <span
                    role={failed && errorLabel ? 'img' : undefined}
                    aria-label={failed ? errorLabel : undefined}
                    aria-hidden={failed && errorLabel ? undefined : true}
                    className="text-fg-muted/40 absolute inset-0 flex items-center justify-center"
                >
                    <span className="size-1/3 max-h-16 min-h-4 max-w-16 min-w-4 [&>svg]:size-full">{fallback}</span>
                </span>
            ) : null}
            {(showLoading && showLoadingIndicator) || (editAction && state !== 'loading') ? (
                <div className="absolute right-2 bottom-2 z-10">
                    <ItemAction action={editAction} loading={showLoading} loadingLabel={loadingLabel} />
                </div>
            ) : null}
            {shouldLoad ? (
                <img
                    alt={alt}
                    ref={attachImage}
                    className={`absolute inset-0 size-full ${aspect === 'logo' ? 'object-contain' : 'object-cover'} ${loaded ? 'opacity-100' : 'opacity-0'}`}
                    decoding="async"
                    loading="lazy"
                    referrerPolicy={referrerPolicy}
                    sizes={sizes}
                    src={src}
                    srcSet={srcSet}
                    onError={() => setFailedSource(src)}
                    onLoad={(event) => revealImage(event.currentTarget, src)}
                />
            ) : null}
            {viewAction && shouldLoad ? (
                <button
                    {...tabbable}
                    type="button"
                    aria-label={viewAction.label}
                    title={viewAction.label}
                    className="hover:bg-fg/10 focus-ring-inset absolute inset-0 cursor-zoom-in rounded-lg transition-colors motion-reduce:transition-none"
                    onClick={viewAction.onClick}
                />
            ) : null}
        </div>
    );
}
