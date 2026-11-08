import type { ComponentPropsWithoutRef } from 'react';

import { scrollFadeClassName, useScrollFade } from '../overlays/useScrollFade';

export type ScrollAreaProps = Omit<ComponentPropsWithoutRef<'div'>, 'className' | 'color' | 'style'> & {
    /** The list that scrolls once it passes 16rem, such as a popover's tasks. */
    children?: ComponentPropsWithoutRef<'div'>['children'];
};

/** A region that scrolls inside a popover or a panel once its content passes 16rem, without moving the page. */
export function ScrollArea(props: ScrollAreaProps) {
    const { setViewport: fadeRef } = useScrollFade();

    return (
        <div
            {...props}
            ref={fadeRef}
            className={`max-h-64 min-h-0 overflow-y-auto overscroll-contain pr-1 ${scrollFadeClassName}`}
        />
    );
}
