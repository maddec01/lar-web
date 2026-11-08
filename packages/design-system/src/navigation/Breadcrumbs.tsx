import { ChevronRightIcon } from 'lucide-react';
import type { ReactNode } from 'react';

import { useScrollFade } from '../overlays/useScrollFade';
import { Link } from '../typography/Link';

interface BreadcrumbsProps {
    /** Names the navigation landmark, such as "Breadcrumb". */
    label: string;
    /** The pages above this one, from the top, each a link. */
    items: readonly { href: string; label: ReactNode }[];
    /** The current page, last and not a link. */
    current?: ReactNode;
    /** Called with a link's href as it is followed, for client-side routing. */
    onNavigate: (href: string) => void;
}

export function Breadcrumbs({ label, items, current, onNavigate }: BreadcrumbsProps) {
    const { setViewport, className: fade } = useScrollFade({ axis: 'horizontal' });

    return (
        <nav ref={setViewport} aria-label={label} className={`min-w-0 overflow-x-auto ${fade}`}>
            <ol className="flex w-max min-w-full items-center gap-2 whitespace-nowrap">
                {items.map((item, index) => (
                    <li key={item.href} className="flex items-center gap-2">
                        <Link href={item.href} tone="muted" onNavigate={onNavigate}>
                            {item.label}
                        </Link>
                        {index < items.length - 1 || current ? (
                            <ChevronRightIcon aria-hidden="true" className="text-fg-muted size-3 shrink-0" />
                        ) : null}
                    </li>
                ))}
                {current ? <li aria-current="page">{current}</li> : null}
            </ol>
        </nav>
    );
}
