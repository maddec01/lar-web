import type { ReactNode } from 'react';

import type { StatusTone } from '../feedback/StatusIndicator';
import { LinkBoxBase, LinkOverlayBase } from '../typography/Link';
import { Text } from '../typography/Typography';
import { toneTileClasses } from './ToneTile';

/** Rows of one list, unboxed and unruled: each row that opens something is its own rounded surface under the pointer
 *  and with focus inside. One column, or two on wide screens. */
export function RowList({
    children,
    label,
    layout = 'panel',
}: {
    /** Its RowListItems. */
    children: ReactNode;
    /** Names the list for screen readers. */
    label: string;
    /** `panel` (the default) stacks the rows in one column; `columns` lays them in two columns from md. */
    layout?: 'panel' | 'columns';
}) {
    return (
        <ul
            aria-label={label}
            className={`-mx-row-inset ${layout === 'columns' ? 'grid gap-x-8 gap-y-1 md:grid-cols-2' : 'flex flex-col gap-1'}`}
        >
            {children}
        </ul>
    );
}

interface RowListItemProps {
    /** Independent controls at the end of the row. */
    actions?: ReactNode;
    /** Short labels such as "lar can fix", shown before the actions. */
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
                        <LinkOverlayBase href={href} onNavigate={onNavigate} className="rounded-lg">
                            {title}
                        </LinkOverlayBase>
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
    const row = 'flex w-full min-w-0 items-center gap-3 rounded-lg px-row-inset py-3';

    return (
        <li>
            <LinkBoxBase
                className={`${row} ${href ? 'hover:bg-fill-hover focus-within:bg-fill-hover transition-colors motion-reduce:transition-none' : ''}`}
            >
                {content}
                {actions ? <span className="flex shrink-0 items-center gap-1">{actions}</span> : null}
            </LinkBoxBase>
        </li>
    );
}
