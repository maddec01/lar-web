import { Alert as NinnaAlert, type AlertProps as NinnaAlertProps } from '@ninna-ui/feedback';
import { Children, type ReactNode, useContext } from 'react';

import { CompactAlertContext } from './CompactAlertContext';
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
}

type AlertBaseProps = AlertProps & Pick<NinnaAlertProps, 'className' | 'style'>;

/** The one recipe, per tone, for every notice in every app: the tone's quiet surface, its hairline and its icon, and the
 *  words in the primary text colour (title semibold, message regular). Never a grey box with a coloured edge, a plain
 *  bordered box or a box without the tone's icon: one notice reads the same in a page, a dialog or a pane, at either
 *  size. A pinned (`sticky`) alert keeps the same surface, which is opaque, and adds the raised shadow. */
const tones = {
    info: 'bg-info-surface border-info-ring [&_[data-slot=icon]]:text-info-fg',
    success: 'bg-success-surface border-success-ring [&_[data-slot=icon]]:text-success-fg',
    warning: 'bg-warning-surface border-warning-ring [&_[data-slot=icon]]:text-warning-fg',
    danger: 'bg-danger-surface border-danger-ring [&_[data-slot=icon]]:text-danger-fg',
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

/** The alert for the design system's own compositions, which may fit it to their layout with a class. */
export function AlertBase({
    size: sizeProp,
    sticky = false,
    tone = 'info',
    className = '',
    title,
    description,
    message: sentence,
    children,
    action,
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
                `rounded-lg border ${tones[tone]} ${text}` +
                className
            }
        />
    );
}

/** An immediate status about a condition or operation: the tone's quiet surface, hairline and icon, the words in the
 *  primary text colour (title semibold, message regular) at every tone. Every notice is an Alert, ConfirmDialog's
 *  reassurance note included (an `info` one). Use NoticeCard for content that needs examination and InfoBox for
 *  guidance that opens another surface. */
export function Alert(props: AlertProps) {
    return <AlertBase {...props} />;
}
