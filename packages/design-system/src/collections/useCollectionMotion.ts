import { type RefObject, useLayoutEffect, useRef } from 'react';

// Children identify their domain key and collection index, even across virtual
// rows. Only mounted items are measured, keeping large catalogs bounded.
export function useCollectionMotion(root: RefObject<HTMLDivElement | null>) {
    const positions = useRef(new Map<string, { index: string | undefined; x: number; y: number }>());

    useLayoutEffect(() => {
        const next = new Map<string, { index: string | undefined; x: number; y: number }>();
        const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;

        for (const element of root.current?.querySelectorAll<HTMLElement>('[data-collection-key]') ?? []) {
            const key = element.dataset.collectionKey!;
            const position = { index: element.dataset.index, x: element.offsetLeft, y: element.offsetTop };
            const previous = positions.current.get(key);

            next.set(key, position);

            if (reducedMotion || !element.animate) continue;

            // Initial measurement and resizing can change coordinates without
            // changing order. Translate only to make room or reorder items.
            if (
                previous &&
                previous.index !== position.index &&
                (previous.x !== position.x || previous.y !== position.y)
            ) {
                element.getAnimations().forEach((animation) => animation.cancel());
                element.animate(
                    [
                        { transform: `translate(${previous.x - position.x}px, ${previous.y - position.y}px)` },
                        { transform: 'translate(0, 0)' },
                    ],
                    { duration: 280, easing: 'cubic-bezier(0.2, 0.8, 0.2, 1)' },
                );
            } else if (!previous) {
                element.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 220, easing: 'ease-out' });
            }
        }
        positions.current = next;
    });
}
