import type { ReactNode } from 'react';

import { Link } from '../typography/Link';
import { Text } from '../typography/Typography';

interface BreadcrumbsProps {
    label: string;
    items: readonly { href: string; label: ReactNode }[];
    current?: ReactNode;
    onNavigate: (href: string) => void;
}

export function Breadcrumbs({ label, items, current, onNavigate }: BreadcrumbsProps) {
    return (
        <nav aria-label={label} className="min-w-0 overflow-x-auto">
            <ol className="flex w-max min-w-full items-center gap-2 whitespace-nowrap">
                {items.map((item) => (
                    <li key={item.href} className="flex items-center gap-2">
                        <Link href={item.href} onNavigate={onNavigate}>
                            {item.label}
                        </Link>
                        <Text as="span" aria-hidden="true" tone="muted">
                            /
                        </Text>
                    </li>
                ))}
                {current ? <li aria-current="page">{current}</li> : null}
            </ol>
        </nav>
    );
}
