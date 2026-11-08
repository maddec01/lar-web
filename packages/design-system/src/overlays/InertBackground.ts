import { useEffect } from 'react';

// Radix hides portal siblings from assistive technology. Mirror that state with native inert so their controls
// are also absent from keyboard navigation. One observer is shared by all mounted portal controls, including nested ones.
const held = new Set<HTMLElement>();
let observer: MutationObserver | undefined;
let consumers = 0;

function reconcile() {
    for (const element of held) {
        if (element.getAttribute('aria-hidden') !== 'true' || !element.isConnected) {
            element.inert = false;
            held.delete(element);
        }
    }

    for (const element of document.querySelectorAll<HTMLElement>('[data-aria-hidden="true"][aria-hidden="true"]')) {
        if (!element.inert) {
            held.add(element);
            element.inert = true;
        }
    }
}

export function useInertBackground() {
    useEffect(() => {
        consumers++;

        if (!observer) {
            observer = new MutationObserver(reconcile);
            observer.observe(document.body, { subtree: true, attributes: true, attributeFilter: ['aria-hidden'] });
            reconcile();
        }

        return () => {
            consumers--;

            if (consumers > 0) return;

            observer?.disconnect();
            observer = undefined;
            for (const element of held) element.inert = false;
            held.clear();
        };
    }, []);
}
