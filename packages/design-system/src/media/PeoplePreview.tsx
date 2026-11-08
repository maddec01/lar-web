import { type ReactNode, useLayoutEffect, useRef, useState } from 'react';

import { ImageCard } from '../display/ImageCard';

interface PeoplePreviewItem {
    id: string;
    name: string;
    role: string;
    artwork: ReactNode;
    href?: string;
}

/** Render only the cards that fit in one row, including keyboard navigation. */
export function PeoplePreview({
    label,
    items,
    onNavigate,
}: {
    /** Names the list for screen readers, such as "Cast". */
    label: string;
    /** The people, each with a name, a role and a page. */
    items: readonly PeoplePreviewItem[];
    /** Called with a person's href as it is followed, for client-side routing. */
    onNavigate?: (href: string) => void;
}) {
    const rowRef = useRef<HTMLUListElement>(null);
    const [visibleCount, setVisibleCount] = useState<number>();

    useLayoutEffect(() => {
        const row = rowRef.current;

        if (!row) return;

        const measure = () => {
            const columns = getComputedStyle(row).gridTemplateColumns;

            if (columns && !columns.includes('repeat(') && columns !== 'none')
                setVisibleCount(columns.trim().split(/\s+/).length);
        };
        const observer = new ResizeObserver(measure);

        measure();
        observer.observe(row);

        return () => observer.disconnect();
    }, []);

    return (
        <ul
            ref={rowRef}
            aria-label={label}
            className="grid min-w-0 grid-cols-[repeat(auto-fill,minmax(min(6.5rem,100%),1fr))] gap-x-3 gap-y-5"
        >
            {items.slice(0, visibleCount).map((person) => (
                <li key={person.id} className="min-w-0">
                    <ImageCard
                        presentation="person"
                        title={person.name}
                        label={person.name}
                        subtitle={person.role}
                        artwork={person.artwork}
                        href={person.href}
                        onNavigate={onNavigate}
                    />
                </li>
            ))}
        </ul>
    );
}
