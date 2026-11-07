import { ChevronRightIcon } from 'lucide-react';
import type { ReactNode } from 'react';

import type { StatusTone } from '../feedback/StatusIndicator';
import { LinkBox, LinkOverlay } from '../typography/Link';
import { Text } from '../typography/Typography';
import { toneTileClasses } from './ToneTile';

/** Rows of one list inside a single bordered panel, separated by rules; or ruled rows in two columns on wide screens. */
export function RowList({
    children,
    label,
    layout = 'panel',
}: {
    children: ReactNode;
    label: string;
    layout?: 'panel' | 'columns';
}) {
    return (
        <ul
            aria-label={label}
            className={
                layout === 'columns'
                    ? '[&>li]:border-base-300 grid gap-x-8 md:grid-cols-2 [&>li]:border-b'
                    : 'divide-base-300 border-base-300 bg-base-100 divide-y overflow-hidden rounded-lg border'
            }
        >
            {children}
        </ul>
    );
}

interface RowListItemProps {
    /** Independent controls at the end of the row. */
    actions?: ReactNode;
    /** Short labels such as "lar can fix", shown before the actions or chevron. */
    badges?: ReactNode;
    detail?: string;
    icon: ReactNode;
    /** A round portrait instead of the tinted square tile. */
    avatar?: boolean;
    /** Makes the whole row a link, with actions remaining independently usable. */
    href?: string;
    onNavigate?: (href: string) => void;
    subtitle?: string;
    title: string;
    tone?: StatusTone;
}

/** One row: a tinted icon, what the user recognises, one line about it, and muted facts. */
export function RowListItem({
    actions,
    badges,
    detail,
    icon,
    avatar = false,
    href,
    onNavigate,
    subtitle,
    title,
    tone = 'neutral',
}: RowListItemProps) {
    const content = (
        <>
            <span
                aria-hidden="true"
                className={`flex shrink-0 items-center justify-center [&>div]:w-full [&>svg]:size-5 ${avatar ? 'size-10 overflow-hidden rounded-full' : 'size-9 rounded-lg'} ${toneTileClasses[tone]}`}
            >
                {icon}
            </span>
            <span className="flex min-w-0 flex-1 flex-col">
                <Text as="span" variant="label" truncate title={title}>
                    {href ? (
                        <LinkOverlay href={href} onNavigate={onNavigate}>
                            {title}
                        </LinkOverlay>
                    ) : (
                        title
                    )}
                </Text>
                {subtitle ? (
                    <Text as="span" truncate title={subtitle}>
                        {subtitle}
                    </Text>
                ) : null}
                {detail ? (
                    <Text as="span" variant="caption" tone="muted" truncate title={detail}>
                        {detail}
                    </Text>
                ) : null}
            </span>
            {badges ? <span className="hidden shrink-0 items-center gap-2 sm:flex">{badges}</span> : null}
        </>
    );
    const row = 'flex w-full min-w-0 items-center gap-3 px-4 py-3';

    return (
        <li>
            <LinkBox className={`${row} ${href ? 'hover:bg-base-100 focus-within:bg-base-100 transition-colors' : ''}`}>
                {content}
                {actions ? <span className="flex shrink-0 items-center gap-1">{actions}</span> : null}
                {href ? (
                    <span aria-hidden="true" className="text-base-500 flex shrink-0 [&>svg]:size-4">
                        <ChevronRightIcon />
                    </span>
                ) : null}
            </LinkBox>
        </li>
    );
}
