import { type RefObject, useEffect, useState } from 'react';

/** Whether the document, or the element `scroller` holds, has scrolled from its top. */
export function useScrolled(scroller?: RefObject<HTMLElement | null>) {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const element = scroller?.current;
        const target: HTMLElement | Window = element ?? window;
        const update = () => setScrolled((element ? element.scrollTop : window.scrollY) > 2);

        update();
        target.addEventListener('scroll', update, { passive: true });

        return () => target.removeEventListener('scroll', update);
    }, [scroller]);

    return scrolled;
}
