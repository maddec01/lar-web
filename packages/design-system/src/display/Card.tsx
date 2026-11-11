import type { ReactNode, Ref } from 'react';

import { tabbable } from '../foundations/KeyboardFocus';
import { LinkOverlayBase } from '../typography/Link';
import { HeadingBase, TextBase } from '../typography/Typography';

/** `data-*` attributes a card passes to its element, naming what it shows for an app's tests and focus. A
 *  composition's own `data-slot` (such as `library-card`) is kept and names the card; `data-card` marks every Card. */
type DataAttributes = { [name: `data-${string}`]: string | number | boolean | undefined };

const paddings = { none: '', sm: 'p-3', md: 'p-4' } as const;
const footerPaddings = { none: 'px-3', sm: 'px-3', md: 'px-4' } as const;

/** Raises a card's own links and buttons over its stretched link or open button (as LinkBox does), so they keep their
 *  own clicks. */
const raised =
    '[&_:is(a,button,input,select,label,[role=switch]):not([data-slot=link-overlay]):not([data-slot=action-overlay])]:relative [&_:is(a,button,input,select,label,[role=switch]):not([data-slot=link-overlay]):not([data-slot=action-overlay])]:z-10';

export interface CardProps extends DataAttributes {
    /** The card's body, under its header. */
    children?: ReactNode;
    /** The top of the card: a CardHeader (title, what it is, its state and its actions), or a row of the caller's own. */
    header?: ReactNode;
    /** Flush at the very top, edge to edge above a hairline: artwork, a shelf of covers, a chart. */
    media?: ReactNode;
    /** The start of the card's footer: a status, a next step, a line of facts. */
    footer?: ReactNode;
    /** The end of the card's footer: its actions, as `sm` buttons (a tinted one for "you can act on this"). */
    actions?: ReactNode;
    /** Draws a hairline above the footer, for a card whose footer is a part of its own (a library's state, a device's
     *  encoder); without it the footer is the card's last line (a desk card's status and actions). */
    divided?: boolean;
    /** The card's padding: `md` (16px, the default), `sm` (12px) for a card among many in a row or a grid, `none` for
     *  content that sets its own. */
    padding?: keyof typeof paddings;
    /** Where the card goes: a stretched link over the whole card (its own links and buttons stay above it). The card
     *  navigates, so under the pointer its edge lifts as well as its fill. Name it with `label`. */
    href?: string;
    /** Called with the `href` on a plain left click, for the app's router. */
    onNavigate?: (href: string) => void;
    /** Opens what the card stands for, such as its dialog: a button stretched over the whole card, which the keyboard
     *  reaches too; its fill lifts under the pointer. Name it with `label`. */
    onOpen?: () => void;
    /** Names the card (its `article`), its stretched link or its open button, such as its title. */
    label?: string;
    /** The one the reader has open or picked, such as the item whose dialog shows: the current recipe's navy wash and
     *  edge (`current-edge`). */
    selected?: boolean;
    /** Something on it needs the reader: the attention recipe in the tone, a 55% edge, a 3px bar down its leading edge
     *  and a faint wash from it (`attention-warning`, `attention-danger`). */
    attention?: 'warning' | 'danger';
    /** Detected but out of use (a device that can't be used): outlined in a dashed hairline, without the card's fill. */
    unavailable?: boolean;
    /** The element: `article` (the default), or a `li` in a list of cards, a `section` or a `div`. */
    as?: 'article' | 'div' | 'li' | 'section';
}

type CardBaseProps = CardProps & {
    /** Fits the card to a composition's layout, such as a fixed width in a scrolling row. */
    className?: string;
    /** The card's element, for moving focus or measuring it. */
    ref?: Ref<HTMLElement>;
};

/** The card's surface. Each recipe owns the properties it sets, so none fights another for a colour: the card's fill
 *  and edge (surface-card), the current wash and edge when selected, the attention edge, bar and wash over the card's
 *  fill, or a dashed outline. */
function surface({
    selected,
    attention,
    unavailable,
}: Pick<CardProps, 'selected' | 'attention' | 'unavailable'>): string {
    if (unavailable) return 'border-line border-dashed';

    const tone = attention ? `attention attention-${attention}` : '';

    if (selected) return `current-edge ${tone}`;

    return attention ? `bg-surface-card ${tone}` : 'surface-card';
}

/** Under the pointer a card that opens something lifts its fill; one that navigates (its own `href`, or a stretched
 *  link inside it) lifts its edge too, unless the attention edge holds it. */
function hover({
    interactive,
    navigates,
    attention,
}: {
    interactive: boolean;
    navigates: boolean;
    attention: CardProps['attention'];
}): string {
    const fill = interactive ? 'hover:bg-fill-hover' : 'has-[[data-slot=link-overlay]]:hover:bg-fill-hover';

    if (attention) return fill;

    return `${fill} ${navigates ? 'hover:border-line-hover' : 'has-[[data-slot=link-overlay]]:hover:border-line-hover'}`;
}

/** The card for compositions (the design system's own and an app's UI layer), which may size it with a class. */
export function CardBase({
    children,
    header,
    media,
    footer,
    actions,
    divided = false,
    padding = 'md',
    href,
    onNavigate,
    onOpen,
    label,
    selected = false,
    attention,
    unavailable = false,
    as: Tag = 'article',
    className = '',
    ref,
    'data-slot': slot = 'card',
    ...data
}: CardBaseProps) {
    const navigates = href !== undefined;
    const interactive = navigates || onOpen !== undefined;
    const hasFooter = Boolean(footer ?? actions);
    const footerRow = hasFooter ? (
        <div
            data-slot="card-footer"
            className={`flex min-h-7 min-w-0 items-center gap-2 ${divided ? `border-line border-t py-2 ${footerPaddings[padding]}` : 'mt-auto'}`}
        >
            <div className="flex min-w-0 flex-1 items-center gap-2">{footer}</div>
            {actions ? <div className="flex shrink-0 items-center gap-1.5">{actions}</div> : null}
        </div>
    ) : null;

    return (
        <Tag
            ref={ref as Ref<HTMLDivElement & HTMLLIElement>}
            {...data}
            aria-label={Tag === 'article' || Tag === 'section' ? label : undefined}
            data-slot={slot}
            data-card=""
            data-selected={selected || undefined}
            data-attention={attention}
            className={[
                'relative isolate flex min-w-0 flex-col rounded-xl border transition-[background-color,border-color] duration-(--motion-duration-fast)',
                surface({ selected, attention, unavailable }),
                media ? 'overflow-hidden' : '',
                raised,
                selected || unavailable ? '' : hover({ interactive, navigates, attention }),
                className,
            ]
                .filter(Boolean)
                .join(' ')}
        >
            {navigates ? (
                <LinkOverlayBase
                    href={href}
                    aria-label={label}
                    className="absolute inset-0 rounded-[inherit]"
                    {...(onNavigate ? { onNavigate } : {})}
                />
            ) : onOpen ? (
                <button
                    {...tabbable}
                    type="button"
                    data-slot="action-overlay"
                    aria-label={label}
                    onClick={onOpen}
                    className="focus-ring-inset absolute inset-0 z-1 block w-full cursor-pointer rounded-[inherit]"
                />
            ) : null}
            {media ? (
                <div data-slot="card-media" className="border-line border-b">
                    {media}
                </div>
            ) : null}
            <div
                data-slot="card-content"
                className={`flex min-w-0 flex-1 flex-col ${padding === 'sm' ? 'gap-2' : 'gap-3'} ${paddings[padding]}`}
            >
                {header ? (
                    <div data-slot="card-header" className="min-w-0">
                        {header}
                    </div>
                ) : null}
                {children ? (
                    <div data-slot="card-body" className="min-w-0">
                        {children}
                    </div>
                ) : null}
                {divided ? null : footerRow}
            </div>
            {divided ? footerRow : null}
        </Tag>
    );
}

/**
 * One thing you open or act on (a desk card, a catalog, a library, a device, what's playing): the card surface, a
 * faint fill and a firmer hairline at a 12px radius, with an optional `media` strip, a `header` (CardHeader), a body
 * and a footer of a status and `actions`. It lifts its fill under the pointer when it opens something (`onOpen`) and
 * its edge too when it navigates (`href`, or a CardHeader `href`); `selected` draws the current wash and edge,
 * `attention` the attention recipe in its tone. Use Panel for a titled group of rows.
 */
export function Card(props: CardProps) {
    return <CardBase {...props} />;
}

interface CardHeaderProps {
    /** What the card is, in a few words; a link with `href`. */
    title: ReactNode;
    /** Makes the title the card's stretched link: the whole card goes there, its edge lifting under the pointer. */
    href?: string;
    /** Called with the `href` on a plain left click, for the app's router. */
    onNavigate?: (href: string) => void;
    /** The title's lines before it ends in an ellipsis: 1 (the default), or 2 for a work's title on a desk card. */
    titleLines?: 1 | 2;
    /** The title's heading level; `h3` by default. */
    level?: 'h2' | 'h3' | 'h4';
    /** A line of facts above the title at 12px, such as where an item comes from, its kind badge and its age. */
    eyebrow?: ReactNode;
    /** A muted line under the title at 12px, such as "12 albums · 94 tracks" or a device's model. */
    subtitle?: ReactNode;
    /** An icon or a small artwork before the title, in a 36px tile. */
    leading?: ReactNode;
    /** At the header's end: the card's state (a StatusIndicator with its word), a menu of more actions or a control. */
    aside?: ReactNode;
}

const titleLines = { 1: 'truncate', 2: 'line-clamp-2 wrap-anywhere' } as const;

/** A card's header: an optional leading tile, a line of facts, the title at 14/600 and a muted line under it, with its
 *  state or actions at the end. */
export function CardHeader({
    title,
    href,
    onNavigate,
    titleLines: lines = 1,
    level = 'h3',
    eyebrow,
    subtitle,
    leading,
    aside,
}: CardHeaderProps) {
    return (
        <div className="flex min-w-0 items-start gap-3">
            {leading ? (
                <span
                    aria-hidden="true"
                    className="bg-fill-muted text-fg-muted flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-lg [&_svg]:size-4"
                >
                    {leading}
                </span>
            ) : null}
            <div className="flex min-w-0 flex-1 flex-col gap-1">
                {eyebrow ? (
                    <div className="text-fg-muted flex h-5 min-w-0 items-center gap-2 text-xs">{eyebrow}</div>
                ) : null}
                <HeadingBase as={level} variant="title" className={titleLines[lines]}>
                    {href ? (
                        <LinkOverlayBase href={href} className="rounded-xs" {...(onNavigate ? { onNavigate } : {})}>
                            {title}
                        </LinkOverlayBase>
                    ) : (
                        title
                    )}
                </HeadingBase>
                {subtitle ? (
                    <TextBase as="p" variant="caption" tone="muted" truncate>
                        {subtitle}
                    </TextBase>
                ) : null}
            </div>
            {aside ? <div className="flex min-w-0 shrink-0 items-center gap-1.5 self-start">{aside}</div> : null}
        </div>
    );
}
