import { useLayoutEffect, useState } from 'react';

export function useCollectionViewport() {
    const [collectionElement, setCollectionElement] = useState<HTMLDivElement | null>(null);
    const [geometry, setGeometry] = useState({ scrollMargin: 0, width: 0 });

    useLayoutEffect(() => {
        if (!collectionElement) return;

        const measure = () => {
            const collection = collectionElement.getBoundingClientRect();
            const next = {
                scrollMargin: collection.top + window.scrollY,
                width: collection.width,
            };

            setGeometry((current) =>
                current.width === next.width && current.scrollMargin === next.scrollMargin ? current : next,
            );
        };
        const observer = new ResizeObserver(measure);

        observer.observe(collectionElement);

        // Ancestor sizes can move the collection without changing its own size.
        for (let ancestor = collectionElement.parentElement; ancestor; ancestor = ancestor.parentElement) {
            observer.observe(ancestor);
        }

        window.addEventListener('resize', measure);
        measure();

        return () => {
            observer.disconnect();
            window.removeEventListener('resize', measure);
        };
    }, [collectionElement]);

    return { ...geometry, setCollectionElement };
}
