import { Alert as NinnaAlert, type AlertProps as NinnaAlertProps } from '@ninna-ui/feedback';
import { CircleAlertIcon, CircleCheckIcon, InfoIcon, type LucideIcon, TriangleAlertIcon } from 'lucide-react';
import { Children, type ReactNode, type Ref, useContext } from 'react';

import { useDesignSystemLabels } from '../foundations/DesignSystemProvider';
import { CompactAlertContext } from './CompactAlertContext';
import { DismissButton } from './DismissButton';
import type { StatusTone } from './StatusIndicator';

/** An alert's look is its tone and size, never a class of the caller's. */
export interface AlertProps extends Omit<NinnaAlertProps, 'color' | 'size' | 'variant' | 'className' | 'style'> {
    /** The status in a few words, in bold, before its message, such as "Read-only folder". A title alone (no
     *  `description` or children) is a one-line notice and reads as the regular-weight message: a sentence is never
     *  bold. Put a whole sentence in `description`. */
    title?: ReactNode;
    /** A sentence-only notice, without a heading. */
    message?: ReactNode;
    /** The message, after the title. */
    description?: ReactNode;
    /** The message as content, in place of `description`. */
    children?: ReactNode;
    /** A follow-up at the end, such as a "Retry" button or a link. Nothing to render (null, false, an empty list) leaves
     *  no action row. */
    action?: ReactNode;
    /** An icon of the caller's in place of the tone's own. */
    icon?: ReactNode;
    /** Adds a close button; `onDismiss` hears it. */
    dismissible?: boolean;
    /** Called when the reader closes it. */
    onDismiss?: () => void;
    /** `sm` is small type and a smaller icon: every alert inside a modal, a form, a pane or a panel (a Modal, Drawer or
     *  Pane sets it for its content). `md` is only for a page-level alert above a page's content, so one notice looks
     *  the same wherever it appears in a surface. */
    size?: 'sm' | 'md';
    /** Stays below the application header while its containing region is visible. */
    sticky?: boolean;
    /** What kind of status it is: `info` (the default), `success`, `warning` or `danger`. */
    tone?: Exclude<StatusTone, 'neutral'>;
    /** `box` (the default) is the notice's box. `inline` is the compact alert: one line under the row or control it is
     *  about (an action's failure under a board row, a field's save error), its tone's icon, the message at 12px and
     *  its action or close button at the line's end, on a faint wash of the tone. Never bare red text. */
    presentation?: 'box' | 'inline';
    /** The alert's element, to move the focus to it (an `inline` alert). */
    ref?: Ref<HTMLDivElement>;
}

type AlertBaseProps = AlertProps & Pick<NinnaAlertProps, 'className' | 'style'>;

/** The one recipe, per tone, for every notice in every app, the attention recipe at a lower strength: the tone's wash
 *  fading out by 70% across (in dark, the tone at 6%, so it tints the black or the glass under it rather than laying a
 *  slab on it), its 35% edge, a 12px corner and its icon, and the words in the primary text colour (title semibold,
 *  message regular). Never a grey box with a coloured edge, a plain bordered box or a box without the tone's icon: one
 *  notice reads the same in a page, a dialog or a pane, at either size. A pinned (`sticky`) alert lays its wash over
 *  the page's colour, so it stays opaque, and adds the raised shadow. */
const tones = {
    info: '[--lar-alert-wash:var(--color-info-wash)] border-info-wash-edge [&_[data-slot=icon]]:text-info-fg',
    success:
        '[--lar-alert-wash:var(--color-success-wash)] border-success-wash-edge [&_[data-slot=icon]]:text-success-fg',
    warning:
        '[--lar-alert-wash:var(--color-warning-wash)] border-warning-wash-edge [&_[data-slot=icon]]:text-warning-fg',
    danger: '[--lar-alert-wash:var(--color-danger-wash)] border-danger-wash-edge [&_[data-slot=icon]]:text-danger-fg',
} as const;

/** The wash, fading across, alone or over the page's colour for a pinned alert that content scrolls under. */
const wash = {
    flow: 'bg-transparent bg-[linear-gradient(to_right,var(--lar-alert-wash),transparent_70%)]',
    sticky: 'bg-surface-page bg-[linear-gradient(to_right,var(--lar-alert-wash),transparent_70%)]',
} as const;

// A long path or address in the words breaks rather than running past the box.
const text =
    'text-fg [&_[data-slot=title]]:text-fg [&_[data-slot=title]]:font-semibold [&_[data-slot=description]]:text-fg [&_[data-slot=description]]:font-normal [&_[data-slot=description]]:opacity-100 [&_[data-slot=description]]:wrap-break-word [&_[data-slot=title]]:wrap-break-word min-w-0 ';

/** The icon box is the first line's height and centres the icon in it, so the icon sits on the first line of the text
 *  at either size: 16px lines for a `sm` alert (a 14px icon), 20px lines for `md` (a 16px icon). */
const iconBox = {
    sm: '[&_[data-slot=icon]]:mt-0 [&_[data-slot=icon]]:flex [&_[data-slot=icon]]:h-4 [&_[data-slot=icon]]:items-center [&_[data-slot=icon]>svg]:size-3.5 ',
    md: '[&_[data-slot=icon]]:mt-0 [&_[data-slot=icon]]:flex [&_[data-slot=icon]]:h-5 [&_[data-slot=icon]]:items-center [&_[data-slot=icon]>svg]:size-4 ',
} as const;

const inlineTones = {
    info: { wash: 'bg-info-wash', icon: 'text-info-fg', Icon: InfoIcon },
    success: { wash: 'bg-success-wash', icon: 'text-success-fg', Icon: CircleCheckIcon },
    warning: { wash: 'bg-warning-wash', icon: 'text-warning-fg', Icon: TriangleAlertIcon },
    danger: { wash: 'bg-danger-wash', icon: 'text-danger-fg', Icon: CircleAlertIcon },
} satisfies Record<string, { wash: string; icon: string; Icon: LucideIcon }>;

/** The compact alert: icon, message and action on one line (wrapping only when it must), 28px tall at least. */
function InlineAlert({
    tone = 'info',
    title,
    description,
    message: sentence,
    children,
    action,
    icon,
    dismissible = false,
    onDismiss,
    ref,
    className = '',
}: AlertBaseProps) {
    const labels = useDesignSystemLabels();
    const look = inlineTones[tone];
    const message = sentence ?? description ?? children;
    const hasMessage = !(message === undefined || message === null || message === false);
    const Icon = look.Icon;

    return (
        <div
            ref={ref}
            role={tone === 'danger' || tone === 'warning' ? 'alert' : 'status'}
            data-slot="alert"
            data-presentation="inline"
            data-tone={tone}
            className={`text-fg flex min-h-7 min-w-0 items-center gap-2 rounded-md px-2 py-1 text-xs leading-4 ${look.wash} ${className}`}
        >
            <span aria-hidden="true" className={`flex shrink-0 [&>svg]:size-3.5 ${look.icon}`}>
                {icon ?? <Icon />}
            </span>
            <span className="min-w-0 flex-1 wrap-break-word">
                {hasMessage && title ? <span className="font-semibold">{title} </span> : null}
                {hasMessage ? message : title}
            </span>
            {Children.toArray(action).length ? (
                // An `sm` button keeps to the line's 28px: it reaches into the padding rather than grow the line.
                <span className="-my-1 -me-1 flex shrink-0 items-center gap-1">{action}</span>
            ) : null}
            {dismissible ? (
                <DismissButton placement="inline" label={labels.close} onClick={() => onDismiss?.()} />
            ) : null}
        </div>
    );
}

/** The alert for the design system's own compositions, which may fit it to their layout with a class. */
export function AlertBase(props: AlertBaseProps) {
    if (props.presentation === 'inline') return <InlineAlert {...props} />;

    return <BoxAlert {...props} />;
}

function BoxAlert({
    size: sizeProp,
    sticky = false,
    tone = 'info',
    className = '',
    title,
    description,
    message: sentence,
    children,
    action,
    presentation: _presentation,
    ...props
}: AlertBaseProps) {
    // A title alone is the notice's message, in the message's regular weight: never a bold sentence.
    const surfaceCompact = useContext(CompactAlertContext);
    const size = sizeProp ?? (surfaceCompact ? 'sm' : 'md');
    const message = sentence ?? description ?? children;
    const words =
        message === undefined || message === null || message === false
            ? { description: title }
            : { title, description: message };

    return (
        <NinnaAlert
            size={size === 'sm' ? 'xs' : 'sm'}
            showIcon
            {...props}
            {...words}
            // An empty action would still leave its spaced row, doubling the alert's bottom padding.
            action={Children.toArray(action).length ? action : undefined}
            color={tone}
            className={
                (sticky ? 'sticky top-(--lar-header-height,0px) z-30 shadow-(--shadow-raised) ' : '') +
                (size === 'sm'
                    ? '[&_[data-slot=description]]:text-xs [&_[data-slot=title]]:text-xs '
                    : 'px-3 py-2.5 leading-5 [&_[data-slot=description]]:leading-5 ') +
                iconBox[size] +
                `rounded-xl border ${tones[tone]} ${wash[sticky ? 'sticky' : 'flow']} ${text}` +
                className
            }
        />
    );
}

/** An immediate status about a condition or operation: the tone's wash, edge and icon, the words in the primary text
 *  colour (title semibold, message regular) at every tone. `presentation="inline"` is the compact one-line alert under
 *  a row or a control. Every notice is an Alert, ConfirmDialog's reassurance note included (an `info` one). Use
 *  NoticeCard for content that needs examination and InfoBox for guidance that opens another surface. */
export function Alert(props: AlertProps) {
    return <AlertBase {...props} />;
}
