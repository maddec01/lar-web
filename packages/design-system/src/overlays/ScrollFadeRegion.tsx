import type { ComponentPropsWithoutRef } from 'react';

import { scrollFadeClassName, useScrollFade } from './useScrollFade';

/** A design-system scrolling region with the shared edge fade: give it its size and padding with `className` (the
 *  design system's own compositions only). Every region the design system scrolls fades where content runs past an
 *  edge; a hard cut never ends a list. */
export function ScrollFadeRegion({ className = '', ...props }: ComponentPropsWithoutRef<'div'>) {
    const { setViewport } = useScrollFade();

    return (
        <div
            {...props}
            ref={setViewport}
            className={`relative min-h-0 overflow-y-auto overscroll-contain ${className} ${scrollFadeClassName}`}
        />
    );
}
