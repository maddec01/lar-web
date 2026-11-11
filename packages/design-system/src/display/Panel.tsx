import { Children, type ReactNode, useId } from 'react';

import { SectionTitle } from '../layout/SectionTitle';
import { TextBase } from '../typography/Typography';
import type { CountTone } from './Count';

/** `data-*` attributes a panel passes to its element, naming what it shows for an app's tests and focus. */
type DataAttributes = { [name: `data-${string}`]: string | number | boolean | undefined };

export interface PanelProps extends DataAttributes {
    /** The group's title, at 14/600. */
    title: ReactNode;
    /** A status icon before the title, such as a stage's glyph (a StatusIndicator with a `glyph`); it keeps its own
     *  colour. */
    icon?: ReactNode;
    /** How many rows it holds, as a plain muted figure after the title (or the attention pill with `countTone`). */
    count?: number;
    /** The count in words for screen readers, such as "3 items". */
    countLabel?: string;
    /** `warning` or `danger` draws the count as the attention pill, for a group of things that need the reader. */
    countTone?: CountTone;
    /** The header's controls at its end, as `sm` buttons, or a quiet control such as a limit or a switch. */
    action?: ReactNode;
    /** The rows, divided by hairlines: each child is a row, or a list (`ol`, `ul`) whose items are. */
    children?: ReactNode;
    /** What it says with no rows, in one muted line under the header, such as "Nothing here". */
    empty?: ReactNode;
    /** Shows the header alone, as a group with nothing to show or one the reader folded. */
    collapsed?: boolean;
    /** The heading's level; `h3` by default. */
    level?: 'h2' | 'h3' | 'h4';
    /** The heading's id, for a region elsewhere that `aria-labelledby` names after it; one is made otherwise. */
    headingId?: string;
}

type PanelBaseProps = PanelProps & {
    /** Fits the panel to a composition's layout. */
    className?: string;
};

/** Divides the rows: the panel's own children, or the items of one list inside it. */
const rows = 'divide-line divide-y [&>:is(ol,ul)]:divide-line [&>:is(ol,ul)]:divide-y';

/** The panel for compositions (the design system's own and an app's UI layer), which may fit it with a class. */
export function PanelBase({
    title,
    icon,
    count,
    countLabel,
    countTone,
    action,
    children,
    empty,
    collapsed = false,
    level = 'h3',
    headingId,
    className = '',
    ...data
}: PanelBaseProps) {
    const madeId = useId();
    const id = headingId ?? madeId;
    const hasRows = Children.toArray(children).length > 0;
    const body = collapsed ? null : hasRows ? (
        <div data-slot="panel-rows" className={`@container min-w-0 ${rows}`}>
            {children}
        </div>
    ) : empty ? (
        <TextBase as="p" data-slot="panel-empty" tone="muted" className="flex min-h-10 items-center px-3">
            {empty}
        </TextBase>
    ) : null;

    return (
        <section
            {...data}
            aria-labelledby={id}
            data-slot="panel"
            data-collapsed={collapsed || undefined}
            className={`surface-panel min-w-0 overflow-hidden rounded-xl border ${className}`}
        >
            <header
                data-slot="panel-header"
                className={`flex min-h-10 items-center px-3 py-1 ${body ? 'border-line border-b' : ''}`}
            >
                <div className="min-w-0 flex-1">
                    <SectionTitle
                        id={id}
                        level={level}
                        title={title}
                        icon={icon}
                        count={count}
                        countLabel={countLabel}
                        countTone={countTone}
                        actions={action}
                    />
                </div>
            </header>
            {body}
        </section>
    );
}

/**
 * A titled group of rows (a board's stage, a track or file list, a group of a page's facts): no fill on black and a
 * hairline edge at a 12px radius, a 40px header (an optional status icon, the title at 14/600, its count at 14/400
 * muted or in the attention pill, and its action as an `sm` button at the end), then the rows divided by hairlines.
 * With no rows it says `empty` in one muted line; `collapsed` shows the header alone. The header is SectionTitle, the
 * same as a heading above content. Use Card for one thing you open or act on.
 */
export function Panel(props: PanelProps) {
    return <PanelBase {...props} />;
}
