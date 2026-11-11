// The one layout behind EmptyState and PageError: a mark or toned icon, a title, a short explanation and its actions,
// on two scales (a hero, and an inline line or centred icon), so every app's empty, not-found and failed states read
// alike. Internal: the package exports only its types; EmptyState and PageError are its public faces, and their stories
// show every size and tone.
import type { ReactNode } from 'react';

import { ButtonBase as Button } from '../actions/Button';
import { ButtonLink } from '../actions/ButtonLink';
import { toneTileClasses } from '../display/ToneTile';
import { HeadingBase, TextBase } from '../typography/Typography';
import type { StatusTone } from './StatusIndicator';

/** What a state offers to do: a button with `onAction`, or a link with `href` (and `onNavigate` for client routing). */
export interface StateAction {
    /** The action's label, such as "Try again" or "Go home". */
    label: string;
    /** An icon before the label. */
    icon?: ReactNode;
    /** Makes it a button that calls this. */
    onAction?: () => void;
    /** Makes it a link to this address. */
    href?: string;
    /** Called with the `href` on a plain left click, for the app's router. */
    onNavigate?: (href: string) => void;
    /** The action is in flight, such as a retry. */
    busy?: boolean;
    /** A forward navigation arrow on a link action. */
    arrow?: boolean;
}

export type StateSize = 'hero' | 'start' | 'page' | 'panel' | 'compact' | 'inline';

/** Two scales. The hero (`start`, `page`, and the marketing `hero`) owns a page or a region: a mark or a tile (the
 *  bordered tile is the hero's alone), a heading, a 14/400 sentence and `md` buttons, its way forward the view's one
 *  primary. The inline scale sits in a list, a grid or a panel: `inline` is one muted line, and `compact` and `panel` a
 *  bare 20px muted icon over a 14/600 title and one 12px line; its actions are secondary, as an alert's are. */
const sizes = {
    /** A marketing page's missing page, on the site's scale (lead text, `lg` buttons). */
    hero: {
        layout: 'max-w-xl px-6 py-16 sm:py-24 gap-4',
        tile: 'size-12 rounded-xl [&>svg]:size-6',
        description: 'lead',
    },
    /** An app's hero: its first run (the mark on the product's halo) or a page with nothing yet, owning the page on the
     *  app's scale: a 22/600 title, a 14/400 sentence, `md` buttons and room for the steps under them. */
    start: {
        layout: 'max-w-xl px-6 py-12 sm:py-16 gap-3',
        tile: 'size-10 rounded-lg [&>svg]:size-5',
        description: 'body',
    },
    /** Owns a page region, such as an empty library or one that failed to load: a 16/600 title over the same
     *  sentence and buttons. */
    page: {
        layout: 'max-w-lg px-6 py-16 gap-3',
        tile: 'size-10 rounded-lg [&>svg]:size-5',
        description: 'body',
    },
    /** A quiet panel among dashboard content: the inline scale in a hairline panel. */
    panel: { layout: 'max-w-md px-4 py-6 gap-2', tile: '', description: 'caption' },
    /** An empty list or grid in a settings group, an archive or a panel: centred in the list's own panel (or in its
     *  place). */
    compact: { layout: 'w-full px-4 py-8 gap-2', tile: '', description: 'caption' },
    /** One muted line in a list, a panel's rows, a popover or a drawer section, without a frame of its own. */
    inline: { layout: 'w-full py-3 gap-2', tile: '', description: 'caption' },
} as const;

/** Which product's hue the mark's halo takes, on a hero (`start`, `page` or `hero`). */
export type StateProduct = 'factory' | 'server' | 'account';

/** The product's halo hue (the halo-* utilities set --lar-halo), drawn as a glow that fades out inside its own box, so
 *  it never shows an edge wherever the hero sits. */
const halos: Record<StateProduct, string> = {
    factory: 'halo-factory',
    server: 'halo-server',
    account: 'halo-account',
};

/** The inline scale's bare icon, in the state's text colour (muted when neutral). */
const iconTones: Record<StatusTone, string> = {
    neutral: 'text-fg-muted',
    success: 'text-success-fg',
    warning: 'text-warning-fg',
    danger: 'text-danger-fg',
    info: 'text-info-fg',
};

export interface StateMessageProps {
    /** A lucide icon, drawn in a tile tinted by the state's tone. */
    icon?: ReactNode;
    /** Shown as is, in its own colours, in place of the icon tile, such as the brand mark on a first run. */
    artwork?: ReactNode;
    /** Sets a hero (`start`, `page`, `hero`) on the product's halo, a soft glow of its hue behind the mark: Factory's
     *  amber, Server's and Account's navy. For a first run or an empty board, with the BrandMark as `artwork`. */
    product?: StateProduct;
    /** What is (or isn't) here, or what happened, in a few words. */
    title: ReactNode;
    /** Why, and what the reader can do about it, in a sentence or two. */
    description?: ReactNode;
    /** The way forward: the primary button or link on a hero (the view's one commit), a secondary one on the inline
     *  scale. */
    primaryAction?: StateAction;
    /** Another way out, as a secondary button or link after the primary. */
    secondaryAction?: StateAction;
    /** Actions of the caller's own in place of `primaryAction` and `secondaryAction`, primary first. */
    actions?: ReactNode;
    /** Quiet content under the actions, such as a disclosure of technical details. */
    footer?: ReactNode;
    /** The hero scale: `start` owns an app's page (its first run, an empty board), `page` a page region, `hero` a
     *  marketing page. The inline scale: `inline` is one muted line in a list, `compact` a centred icon and title in a
     *  grid, panel or settings list, `panel` the same in a hairline panel of its own. */
    size?: StateSize;
    /** The title's heading level at the `hero`, `start` and `page` sizes. */
    level?: 'h1' | 'h2' | 'h3';
}

export function StateMessage({
    icon,
    artwork,
    product,
    title,
    description,
    primaryAction,
    secondaryAction,
    actions,
    footer,
    size = 'page',
    level,
    tone,
    eyebrow,
    outlineActions = false,
}: StateMessageProps & {
    tone: StatusTone;
    eyebrow?: string | undefined;
    /** Draws the primary action as the outline button too, as a failure's Try again always is. */
    outlineActions?: boolean;
}) {
    const style = sizes[size];
    const compact = size === 'panel' || size === 'compact' || size === 'inline';
    const buttonSize = compact ? 'sm' : size === 'hero' ? 'lg' : 'md';
    const buttons = actions ?? (
        <>
            {primaryAction ? (
                // The hero's way forward is the view's one commit; on the inline scale it is secondary.
                <StateButton action={primaryAction} primary={!outlineActions && !compact} size={buttonSize} />
            ) : null}
            {secondaryAction ? <StateButton action={secondaryAction} size={buttonSize} /> : null}
        </>
    );
    const hasActions = Boolean(actions ?? primaryAction ?? secondaryAction);

    const message = (
        <div
            data-slot="state-message"
            data-size={size}
            className={`flex flex-col ${size === 'inline' ? 'items-start text-left' : 'mx-auto items-center text-center'} ${style.layout} ${product && !compact ? 'relative isolate' : ''}`}
        >
            {product && !compact ? (
                // Inside the message's own box, fading to nothing at every edge, so a bar or a scroller above never
                // cuts its top: it fades in rather than stopping at a line.
                <span
                    aria-hidden="true"
                    data-slot="state-halo"
                    className={`pointer-events-none absolute top-0 left-1/2 -z-10 h-56 w-xl max-w-[100vw] -translate-x-1/2 bg-[radial-gradient(closest-side,var(--lar-halo),transparent)] ${halos[product]}`}
                />
            ) : null}
            {artwork ??
                (icon ? (
                    size === 'inline' ? null : compact ? (
                        <span
                            aria-hidden="true"
                            data-slot="state-icon"
                            className={`flex shrink-0 items-center justify-center [&>svg]:size-5 ${iconTones[tone]}`}
                        >
                            {icon}
                        </span>
                    ) : (
                        <span
                            aria-hidden="true"
                            className={`flex shrink-0 items-center justify-center ${style.tile} ${toneTileClasses[tone]}`}
                        >
                            {icon}
                        </span>
                    )
                ) : null)}
            <div className={`flex flex-col gap-1 ${size === 'inline' ? 'items-start' : 'items-center'}`}>
                {eyebrow ? (
                    // 12/500 in the overline's caps and tracking, as the family's eyebrows are (a 404's code).
                    <TextBase
                        as="p"
                        variant="caption"
                        tone="muted"
                        className={`tracking-caps font-medium uppercase ${size === 'hero' ? 'mb-2' : ''}`}
                    >
                        {eyebrow}
                    </TextBase>
                ) : null}
                {compact ? (
                    <TextBase
                        as="p"
                        variant={size === 'inline' ? 'body' : 'label'}
                        tone={size === 'inline' ? 'muted' : 'default'}
                        className={`text-balance ${size === 'inline' ? '' : 'font-semibold'} ${size === 'inline' && icon ? 'flex items-center gap-2 [&>svg]:size-4 [&>svg]:shrink-0' : ''}`}
                    >
                        {size === 'inline' && icon ? (
                            <>
                                {icon}
                                <span className="min-w-0">{title}</span>
                            </>
                        ) : (
                            title
                        )}
                    </TextBase>
                ) : (
                    <HeadingBase
                        data-slot="state-title"
                        as={level ?? (size === 'hero' || size === 'start' ? 'h1' : 'h2')}
                        variant={size === 'hero' ? 'hero' : size === 'start' ? 'page' : 'section'}
                        className="text-balance"
                    >
                        {title}
                    </HeadingBase>
                )}
                {description ? (
                    <TextBase
                        as="p"
                        data-slot="state-description"
                        variant={style.description}
                        tone="muted"
                        className={`text-pretty ${size === 'hero' ? 'mt-2' : ''}`}
                    >
                        {description}
                    </TextBase>
                ) : null}
            </div>
            {hasActions ? (
                <div
                    className={`flex flex-wrap items-center justify-center gap-2 ${compact ? '' : 'mt-2'} ${size === 'hero' ? 'max-sm:w-full max-sm:flex-col max-sm:[&>*]:w-full max-sm:[&>*]:max-w-80' : ''}`}
                >
                    {buttons}
                </div>
            ) : null}
            {footer ? (
                // Left-aligned inside, as a list or details read; under a centred message the block itself is centred,
                // so a first-run step list sits under the title and actions, not at the column's edge.
                <div
                    data-slot="state-message-footer"
                    className={`max-w-full text-left ${size === 'inline' ? 'w-full' : 'mx-auto w-fit'}`}
                >
                    {footer}
                </div>
            ) : null}
        </div>
    );

    return size === 'panel' ? <div className="surface-panel rounded-xl border">{message}</div> : message;
}

function StateButton({
    action,
    primary = false,
    size,
}: {
    action: StateAction;
    primary?: boolean;
    size: 'sm' | 'md' | 'lg';
}) {
    const variant = primary ? 'primary' : 'secondary';

    if (action.href !== undefined)
        return (
            // A link action takes the app's button sizes on every app scale, the marketing ones only on the `hero`
            // (`lg`), so it stands at the same height as a button action beside it.
            <ButtonLink
                href={action.href}
                look={size === 'lg' ? 'marketing' : 'app'}
                variant={variant}
                size={size === 'lg' ? 'lg' : size}
                arrow={action.arrow}
                icon={action.icon}
                {...(action.busy === undefined ? {} : { busy: action.busy })}
                {...(action.onNavigate ? { onNavigate: action.onNavigate } : {})}
            >
                {action.label}
            </ButtonLink>
        );

    return (
        <Button
            type="button"
            variant={variant}
            size={size === 'sm' ? 'sm' : 'md'}
            className={size === 'lg' ? 'text-md h-11 px-4.5 sm:h-11' : undefined}
            leftIcon={action.icon}
            onClick={action.onAction}
            {...(action.busy === undefined ? {} : { busy: action.busy })}
        >
            {action.label}
        </Button>
    );
}
