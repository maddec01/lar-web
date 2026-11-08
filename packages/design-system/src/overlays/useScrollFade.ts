import { useLayoutEffect, useState } from 'react';

/** The fading edges of every scrolling region the design system draws (a Modal's body, its panes and pickers, a
 *  palette's list): a 1.5rem fade at the top or bottom only while content runs past that edge. `scroll-padding` keeps
 *  a focused or scrolled-to control clear of the fade, so the fade stays on while a field inside has focus; only the
 *  region's own keyboard focus (its ring runs along the edges) lifts it. */
export const scrollFadeClassName =
    'scroll-py-6 [mask-image:linear-gradient(to_bottom,transparent,black_min(1.5rem,var(--scroll-fade-top,0px)),black_calc(100%_-_min(1.5rem,var(--scroll-fade-bottom,0px))),transparent)] focus-visible:[mask-image:none]';

/** A dialog's or drawer's body (Modal.Body, Drawer.Body, a paned dialog's content): a deeper 3rem fade at both edges,
 *  under the header (and its description) and where the body meets the dialog's edge or its footer. A 1.5rem fade
 *  still read as a row sliced by the header or the frame; 3rem dissolves the cut row, so the body plainly continues
 *  past it. The top fade grows in with the scroll, so an unscrolled body shows its first row whole. */
export const scrollFadeBodyClassName =
    'scroll-py-12 [mask-image:linear-gradient(to_bottom,transparent,black_min(3rem,var(--scroll-fade-top,0px)),black_calc(100%_-_min(3rem,var(--scroll-fade-bottom,0px))),transparent)] focus-visible:[mask-image:none]';

/** The same fade along a row of tabs or chips. */
export const scrollFadeHorizontalClassName =
    'scroll-px-6 [mask-image:linear-gradient(to_right,transparent,black_min(1.5rem,var(--scroll-fade-left,0px)),black_calc(100%_-_min(1.5rem,var(--scroll-fade-right,0px))),transparent)] focus-visible:[mask-image:none]';

/** A row of cards (ScrollRow, a desk of cards): a wider 3rem fade that reaches past the row's own padding into the
 *  cut card, and no scroll padding of its own, as a snapping row sets where its cards settle. */
export const scrollFadeRowClassName =
    '[mask-image:linear-gradient(to_right,transparent,black_min(var(--scroll-fade-row),var(--scroll-fade-left,0px)),black_calc(100%_-_min(var(--scroll-fade-row),var(--scroll-fade-right,0px))),transparent)] focus-visible:[mask-image:none]';

/** The one scroll fade: attach `setViewport` to the scroll owner (and, optionally, `setContent` to its content;
 *  without it the owner's whole subtree is watched), so async content and viewport changes update the fade. `axis`
 *  picks the direction it scrolls; a `horizontal` row of cards takes `row`, the wider fade, and a dialog's or drawer's
 *  body takes `body`, the deeper bottom fade. */
export function useScrollFade({
    axis = 'vertical',
    row = false,
    body = false,
}: { axis?: 'vertical' | 'horizontal'; row?: boolean; body?: boolean } = {}) {
    const [viewport, setViewport] = useState<HTMLElement | null>(null);
    const [contentElement, setContent] = useState<HTMLElement | null>(null);
    const content = contentElement ?? viewport;

    useLayoutEffect(() => {
        if (!viewport || !content) return;

        const measure = () => {
            const horizontal = axis === 'horizontal';
            const offset = horizontal ? viewport.scrollLeft : viewport.scrollTop;
            const extent = horizontal ? viewport.scrollWidth : viewport.scrollHeight;
            const size = horizontal ? viewport.clientWidth : viewport.clientHeight;

            viewport.dataset.scrollFade = extent > size + 1 ? 'overflow' : 'none';
            viewport.style.setProperty(
                horizontal ? '--scroll-fade-left' : '--scroll-fade-top',
                `${Math.max(0, offset)}px`,
            );
            viewport.style.setProperty(
                horizontal ? '--scroll-fade-right' : '--scroll-fade-bottom',
                `${Math.max(0, extent - size - offset)}px`,
            );
        };
        const observer = new ResizeObserver(measure);

        const observeContent = () => {
            observer.disconnect();
            observer.observe(viewport);

            if (content !== viewport) observer.observe(content);

            // Fill layouts can keep ancestors fixed while descendants change the scroll extent.
            content.querySelectorAll('*').forEach((element) => observer.observe(element));
            measure();
        };
        const mutations = new MutationObserver(observeContent);

        mutations.observe(content, { childList: true, subtree: true });
        viewport.addEventListener('scroll', measure, { passive: true });
        observeContent();

        return () => {
            mutations.disconnect();
            observer.disconnect();
            viewport.removeEventListener('scroll', measure);
        };
    }, [viewport, content, axis]);

    return {
        setViewport,
        setContent,
        className:
            axis === 'vertical'
                ? body
                    ? scrollFadeBodyClassName
                    : scrollFadeClassName
                : row
                  ? scrollFadeRowClassName
                  : scrollFadeHorizontalClassName,
    };
}
