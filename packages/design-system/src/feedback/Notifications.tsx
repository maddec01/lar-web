/* oxlint-disable react/only-export-components -- The slot functions and the body's controls belong to the toaster. */

import { toast, Toaster } from '@ninna-ui/feedback';
import { CircleAlertIcon, CircleCheckIcon, InfoIcon, type LucideIcon, TriangleAlertIcon } from 'lucide-react';
import {
    createContext,
    type ReactNode,
    type RefObject,
    useContext,
    useEffect,
    useLayoutEffect,
    useRef,
    useState,
} from 'react';
import { flushSync } from 'react-dom';

import { Button } from '../actions/Button';
import { useDesignSystemLabels } from '../foundations/DesignSystemProvider';
import { DismissButton } from './DismissButton';

/** How long a success or an info stays once the pointer and the focus have left it. */
const SUCCESS_MS = 5_000;

/** Each notification's fade, as wide as a Modal body's: notifications scrolled past fade out at the stack's edges. */
const FADE_PX = 24;

/** How many notifications show at once; older ones wait behind them and return as the newer ones close. */
const VISIBLE = 3;

/**
 * The page's notifications, one presentation in every app: at most three in the bottom right corner, 384px wide, on the
 * menu glass, above every dialog, oldest above the newest. A success or an info closes itself five seconds after the
 * pointer and the focus leave it; a warning or a failure stays until it is closed. When they don't fit the window, the
 * stack scrolls, follows the newest while you are at the bottom, and fades those scrolled past at its edges, as a
 * Modal's body does. Mount one, once, outside the page's root.
 */
export function Notifications(_props: {
    /** @deprecated Every app now shares one presentation; `corner` and `stack` both draw it. */
    presentation?: 'corner' | 'stack';
}) {
    return (
        <Toaster
            ref={followNewest}
            position="bottom-right"
            max={VISIBLE}
            className="notification-stack"
            offset="calc(var(--spacing) * 1)"
        />
    );
}

/**
 * Follows the newest notification while the user is at the bottom: a new entry, a narrower or shorter window and a
 * notification growing all keep it in view. Once the user scrolls away the stack stays where they left it, until they
 * scroll back. Each notification carries its own slice of the edge fade: a mask on the stack would make it the
 * notifications' backdrop root and cut their blur off from the page behind.
 */
function followNewest(viewport: HTMLDivElement | null) {
    if (!viewport) return;

    let following = true;
    const entries = () => Array.from(viewport.children).filter((el): el is HTMLElement => el instanceof HTMLElement);
    const fade = () => {
        const { scrollTop, scrollHeight, clientHeight } = viewport;
        const stack = viewport.getBoundingClientRect();
        const top = Math.min(FADE_PX, Math.max(0, scrollTop));
        const bottom = Math.min(FADE_PX, Math.max(0, scrollHeight - clientHeight - scrollTop));

        for (const entry of entries()) {
            const y = entry.getBoundingClientRect().top - stack.top;

            entry.style.setProperty('--fade-from', `${-y}px`);
            entry.style.setProperty('--fade-top', `${top - y}px`);
            entry.style.setProperty('--fade-bottom', `${stack.height - bottom - y}px`);
            entry.style.setProperty('--fade-to', `${stack.height - y}px`);
        }
    };
    const toNewest = () => {
        if (following) viewport.scrollTop = viewport.scrollHeight;

        fade();
    };
    const scrolled = () => {
        following = viewport.scrollHeight - viewport.clientHeight - viewport.scrollTop <= 1;
        fade();
    };
    const resizes = new ResizeObserver(toNewest);
    const observe = () => {
        resizes.disconnect();
        resizes.observe(viewport);
        entries().forEach((entry) => resizes.observe(entry));
    };
    const arrivals = new MutationObserver((changes) => {
        observe();

        const newest = viewport.lastElementChild;
        const arrived = changes.some(({ addedNodes }) => Array.from(addedNodes).includes(newest as Node));

        // Only a new entry moves the stack; one closing or changing above leaves the user where they are.
        if (arrived) toNewest();
        else fade();
    });

    arrivals.observe(viewport, { childList: true });
    viewport.addEventListener('scroll', scrolled, { passive: true });
    // Entering notifications slide in; measure them where they land.
    viewport.addEventListener('animationend', fade);
    viewport.addEventListener('transitionend', fade);
    observe();
    toNewest();

    return () => {
        arrivals.disconnect();
        resizes.disconnect();
        viewport.removeEventListener('scroll', scrolled);
        viewport.removeEventListener('animationend', fade);
        viewport.removeEventListener('transitionend', fade);
    };
}

/** A notification's tone: its icon, tint and edge, and whether it waits for the reader. */
export type NotificationTone = 'success' | 'info' | 'warning' | 'danger';

/** A follow-up the notification offers, such as "Try again"; choosing it closes the notification. */
export interface NotificationAction {
    label: string;
    onAction: () => void;
}

export interface Notification {
    /** One notification per slot: a new one replaces the last. */
    slot: string;
    /** `success` (the default) and `info` clear themselves five seconds after the pointer and the keyboard focus leave
     *  them; `warning` and `danger` stay until they're closed or their slot is cleared, as the problem is resolved. */
    tone?: NotificationTone;
    /** What happened, specifically, such as "Couldn't save Music" rather than "Request failed". */
    title?: ReactNode;
    /** A sentence more: why, or what to do. */
    description?: ReactNode;
    /** Content of the caller's after the description: text, links and buttons, such as an action that holds the
     *  notification open while it runs (useNotificationControls). */
    body?: ReactNode;
    /** A follow-up button, such as "Try again", which closes the notification as it runs. */
    action?: NotificationAction;
    /** Names the close button, such as "Dismiss: Moved #61"; the design system's "Close" by default. */
    dismissLabel?: string;
    /** Called after it closes while the keyboard focus was inside it, to put the focus somewhere useful. */
    onFocusLost?: () => void;
}

/** Each tone's icon, which tells a success from a failure without its colour. */
const toneIcons: Record<NotificationTone, LucideIcon> = {
    success: CircleCheckIcon,
    info: InfoIcon,
    warning: TriangleAlertIcon,
    danger: CircleAlertIcon,
};

/** Tones that clear themselves; the others wait for the reader. */
const clearsItself = (tone: NotificationTone) => tone === 'success' || tone === 'info';

interface NotificationControls {
    /** Keeps a success from clearing itself while `held`, such as while an action it offers is under way. */
    hold: (held: boolean) => void;
    /** Shows a success as a failure while `failed`, such as when an action it offers failed. */
    fail: (failed: boolean) => void;
}

const Controls = createContext<NotificationControls>({ hold: () => {}, fail: () => {} });

/** For a notification's body: what it can change about the notification it sits in. */
export function useNotificationControls(): NotificationControls {
    return useContext(Controls);
}

/** The id of the notification in each slot, in the toast manager. */
const slots = new Map<string, string>();

/** Forgets every slot, as the toasts they named are gone. */
export function forgetNotificationSlots(): void {
    slots.clear();
}

/** Closes the notification `id` in `slot`; if the focus was in it, `onFocusLost` puts it somewhere else. */
function close(slot: string, id: string, onFocusLost?: () => void): void {
    const hadFocus = Boolean(document.querySelector(`[data-toast-id="${id}"]`)?.contains(document.activeElement));

    flushSync(() => {
        if (slots.get(slot) === id) slots.delete(slot);

        toast.dismiss(id);
    });

    if (hadFocus) onFocusLost?.();
}

/** Shows `notification` in its slot, replacing the one there. */
export function showNotification(notification: Notification): void {
    clearNotification(notification.slot);

    const id: string = toast.create({
        color: notification.tone ?? 'success',
        // The body's own clock closes successes and its own button closes every notification, so the manager never does.
        duration: 0,
        closable: false,
        description: (
            <NotificationBody
                {...notification}
                onClose={() => close(notification.slot, id, notification.onFocusLost)}
            />
        ),
    });

    slots.set(notification.slot, id);
}

/** Closes whatever notification holds this slot. */
export function clearNotification(slot: string): void {
    const id = slots.get(slot);

    if (id) close(slot, id);
}

/** Gives a success or an info five seconds after hover and keyboard focus leave it. */
function useSuccessClose(ref: RefObject<Element | null>, enabled: boolean, onClose: () => void): void {
    const latest = useRef(onClose);

    useLayoutEffect(() => {
        latest.current = onClose;
    });
    useEffect(() => {
        if (!enabled) return;

        const entry = ref.current?.closest<HTMLElement>('[data-slot="toast"]');

        if (!entry) return;

        const held = {
            hovered: entry.matches(':hover'),
            focused: entry.contains(document.activeElement),
            timer: undefined as ReturnType<typeof setTimeout> | undefined,
        };
        const restart = () => {
            clearTimeout(held.timer);

            if (!held.hovered && !held.focused) held.timer = setTimeout(() => latest.current(), SUCCESS_MS);
        };
        const enter = () => {
            held.hovered = true;
            restart();
        };
        const leave = () => {
            held.hovered = false;
            restart();
        };
        const focus = () => {
            held.focused = true;
            restart();
        };
        const blur = (event: FocusEvent) => {
            held.focused = event.relatedTarget instanceof Node && entry.contains(event.relatedTarget);
            restart();
        };

        entry.addEventListener('mouseenter', enter);
        entry.addEventListener('mouseleave', leave);
        entry.addEventListener('focusin', focus);
        entry.addEventListener('focusout', blur);
        restart();

        return () => {
            clearTimeout(held.timer);
            entry.removeEventListener('mouseenter', enter);
            entry.removeEventListener('mouseleave', leave);
            entry.removeEventListener('focusin', focus);
            entry.removeEventListener('focusout', blur);
        };
    }, [enabled, ref]);
}

/** One notification's content: its tone's icon, the title, description and body, an action, and the close button.
 *  `onClose` runs when its close button or action is clicked or, for a success or an info, when its time is up. */
function NotificationBody({
    slot,
    dismissLabel,
    tone = 'success',
    title,
    description,
    body,
    action,
    onClose,
}: Notification & { onClose: () => void }) {
    const labels = useDesignSystemLabels();
    const ref = useRef<HTMLDivElement>(null);
    const [held, setHeld] = useState(false);
    const [bodyFailed, setBodyFailed] = useState(false);
    const shown: NotificationTone = bodyFailed ? 'danger' : tone;
    const Icon = toneIcons[shown];

    useEffect(() => {
        ref.current?.closest('[data-slot="toast"]')?.setAttribute('data-toast-color', shown);
    }, [shown]);
    useEffect(() => {
        // A press on a notification is never a press outside an open dialog: a dialog that waits for the click to
        // decide would find the notification already gone, and close.
        const entry = ref.current?.closest('[data-slot="toast"]');
        const inside = (event: Event) => event.stopPropagation();

        entry?.addEventListener('pointerdown', inside);

        return () => entry?.removeEventListener('pointerdown', inside);
    }, []);
    useSuccessClose(ref, clearsItself(shown) && !held, onClose);

    return (
        <div ref={ref} data-toast={slot} data-slot="notification" className="flex items-start gap-3">
            <span data-slot="notification-icon" className="flex h-5 shrink-0 items-center [&>svg]:size-4">
                <Icon aria-hidden="true" />
            </span>
            <div className="min-w-0 flex-1">
                {title ? <div className="text-fg text-sm leading-5 font-semibold">{title}</div> : null}
                {description ? <div className="text-fg-soft text-sm leading-5">{description}</div> : null}
                {body ? (
                    <div className="text-fg text-sm leading-5">
                        <Controls.Provider value={{ hold: setHeld, fail: setBodyFailed }}>{body}</Controls.Provider>
                    </div>
                ) : null}
                {action ? (
                    <div className="mt-2">
                        <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => {
                                onClose();
                                action.onAction();
                            }}
                        >
                            {action.label}
                        </Button>
                    </div>
                ) : null}
            </div>
            <DismissButton label={dismissLabel ?? labels.close} onClick={onClose} />
        </div>
    );
}
