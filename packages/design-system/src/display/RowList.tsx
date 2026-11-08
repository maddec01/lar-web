import { ChevronRightIcon } from 'lucide-react';
import type { ReactNode } from 'react';

import type { StatusTone } from '../feedback/StatusIndicator';
import { LinkBoxBase, LinkOverlay } from '../typography/Link';
import { Text } from '../typography/Typography';
import { toneTileClasses } from './ToneTile';

/** Rows of one list inside a single bordered panel, separated by rules; or ruled rows in two columns on wide screens. */
export function RowList({
    children,
    label,
    layout = 'panel',
}: {
    /** Its RowListItems. */
    children: ReactNode;
    /** Names the list for screen readers. */
    label: string;
    /** `panel` (the default) rules the rows inside a raised panel; `columns` lays them in two ruled columns from md. */
    layout?: 'panel' | 'columns';
}) {
    return (
        <ul
            aria-label={label}
            className={
                layout === 'columns'
                    ? '[&>li]:border-line grid gap-x-8 md:grid-cols-2 [&>li]:border-b'
                    : 'divide-line surface-card divide-y overflow-hidden rounded-lg border'
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
    /** Muted facts after the subtitle, such as a size or a date. */
    detail?: string;
    /** The icon in its tinted tile, or the portrait with `avatar`. */
    icon: ReactNode;
    /** A round portrait instead of the tinted square tile. */
    avatar?: boolean;
    /** Makes the whole row a link, with actions remaining independently usable. */
    href?: string;
    /** Called with the `href` on a plain left click, for the app's router. */
    onNavigate?: (href: string) => void;
    /** One line about it, under the title. */
    subtitle?: string;
    /** What the reader recognises it by. */
    title: string;
    /** The icon tile's tint, such as `warning` for something that needs a look. */
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
            <LinkBoxBase
                className={`${row} ${href ? 'hover:bg-surface-raised focus-within:bg-surface-raised transition-colors' : ''}`}
            >
                {content}
                {actions ? <span className="flex shrink-0 items-center gap-1">{actions}</span> : null}
                {href ? (
                    <span aria-hidden="true" className="text-fg-muted flex shrink-0 [&>svg]:size-4">
                        <ChevronRightIcon />
                    </span>
                ) : null}
            </LinkBoxBase>
        </li>
    );
}
