// The one layout behind EmptyState and PageError: a toned icon tile, a title, a short explanation and its actions,
// at four sizes, so every app's empty, not-found and failed states read alike. Internal: the package exports only its
// types; EmptyState and PageError are its public faces, and their stories show every size and tone.
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

const sizes = {
    /** Owns the page: a first run, a missing page. */
    hero: {
        layout: 'max-w-xl px-6 py-16 sm:py-24 gap-4',
        tile: 'size-12 rounded-xl [&>svg]:size-6',
        description: 'lead',
    },
    /** An app's first run, owning its page on the app's own scale: a page title's size, regular buttons, room for the
     *  steps under them (`hero` is a marketing page's scale). */
    start: {
        layout: 'max-w-xl px-6 py-12 sm:py-16 gap-3',
        tile: 'size-10 rounded-lg [&>svg]:size-5',
        description: 'description',
    },
    /** Owns a page region, such as an empty library or one that failed to load. */
    page: {
        layout: 'max-w-lg px-6 py-16 gap-3',
        tile: 'size-10 rounded-lg [&>svg]:size-5',
        description: 'description',
    },
    /** A quiet card among dashboard content, on the same surface. */
    panel: { layout: 'max-w-md px-4 py-6 gap-2', tile: 'size-8 rounded-lg [&>svg]:size-4', description: 'caption' },
    /** An empty list in a settings group or an archive: centred in the list's own panel (or in its place), small. */
    compact: { layout: 'w-full px-4 py-8 gap-2', tile: 'size-8 rounded-lg [&>svg]:size-4', description: 'caption' },
    /** Fits inside a panel, popover or drawer section without a frame of its own. */
    inline: { layout: 'w-full py-3 gap-2', tile: 'size-8 rounded-lg [&>svg]:size-4', description: 'caption' },
} as const;

export interface StateMessageProps {
    /** A lucide icon, drawn in a tile tinted by the state's tone. */
    icon?: ReactNode;
    /** Shown as is, in its own colours, in place of the icon tile, such as the brand mark on a first run. */
    artwork?: ReactNode;
    /** What is (or isn't) here, or what happened, in a few words. */
    title: ReactNode;
    /** Why, and what the reader can do about it, in a sentence or two. */
    description?: ReactNode;
    /** The way forward, as the primary button or link. */
    primaryAction?: StateAction;
    /** Another way out, as a secondary button or link after the primary. */
    secondaryAction?: StateAction;
    /** Actions of the caller's own in place of `primaryAction` and `secondaryAction`, primary first. */
    actions?: ReactNode;
    /** Quiet content under the actions, such as a disclosure of technical details. */
    footer?: ReactNode;
    /** `hero` owns the page, `start` owns an app's page on its first run, `page` a page region, `panel` is a quiet
     *  card, `compact` an empty settings or archive list (centred in the list's panel), `inline` fits inside a panel. */
    size?: StateSize;
    /** The title's heading level at the `hero`, `start` and `page` sizes. */
    level?: 'h1' | 'h2' | 'h3';
}

export function StateMessage({
    icon,
    artwork,
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
}: StateMessageProps & { tone: StatusTone; eyebrow?: string | undefined }) {
    const style = sizes[size];
    const compact = size === 'panel' || size === 'compact' || size === 'inline';
    const buttonSize = compact ? 'sm' : size === 'hero' ? 'lg' : 'md';
    const buttons = actions ?? (
        <>
            {primaryAction ? <StateButton action={primaryAction} primary size={buttonSize} /> : null}
            {secondaryAction ? <StateButton action={secondaryAction} size={buttonSize} /> : null}
        </>
    );
    const hasActions = Boolean(actions ?? primaryAction ?? secondaryAction);

    const message = (
        <div
            data-slot="state-message"
            data-size={size}
            className={`flex flex-col ${size === 'inline' ? 'items-start text-left' : 'mx-auto items-center text-center'} ${style.layout}`}
        >
            {artwork ??
                (icon ? (
                    <span
                        aria-hidden="true"
                        className={`flex shrink-0 items-center justify-center ${style.tile} ${toneTileClasses[tone]}`}
                    >
                        {icon}
                    </span>
                ) : null)}
            <div className={`flex flex-col gap-1 ${size === 'inline' ? 'items-start' : 'items-center'}`}>
                {eyebrow ? (
                    <TextBase as="p" variant="overline" tone="muted" className={size === 'hero' ? 'mb-2' : ''}>
                        {eyebrow}
                    </TextBase>
                ) : null}
                {compact ? (
                    <TextBase
                        as="p"
                        variant={size === 'inline' ? 'body' : 'label'}
                        tone={size === 'inline' ? 'muted' : 'default'}
                        className="text-balance"
                    >
                        {title}
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

    return size === 'panel' ? (
        <div className="border-line bg-surface-raised rounded-xl border">{message}</div>
    ) : (
        message
    );
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
            <ButtonLink
                href={action.href}
                variant={variant}
                size={size}
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
            className={size === 'sm' ? undefined : size === 'lg' ? 'text-md h-11 px-4.5 sm:h-11' : 'h-9 px-3.5 sm:h-9'}
            leftIcon={action.icon}
            onClick={action.onAction}
            {...(action.busy === undefined ? {} : { busy: action.busy })}
        >
            {action.label}
        </Button>
    );
}
