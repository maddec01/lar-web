/* oxlint-disable react/only-export-components -- The slot functions and the body's controls belong to the toaster. */

import { toast, Toaster } from '@ninna-ui/feedback';
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

import { DismissButton } from './DismissButton';

/** How long a success stays once the pointer and the focus have left it. */
const SUCCESS_MS = 5_000;

/** Each notification's fade, as wide as a Modal body's: notifications scrolled past fade out at the stack's edges. */
const FADE_PX = 24;

/**
 * The page's notifications. `corner` shows a few at a time in the bottom right corner. `stack` keeps every one, oldest
 * above the newest, above every dialog: when they don't fit, the stack scrolls, follows the newest while you are at the
 * bottom, and fades those scrolled past at its edges, as a Modal's body does. Mount one, once, outside the page's root.
 */
export function Notifications({ presentation = 'corner' }: { presentation?: 'corner' | 'stack' }) {
    if (presentation === 'stack')
        return (
            <Toaster
                ref={followNewest}
                position="bottom-right"
                max={Infinity}
                className="notification-stack"
                offset="calc(var(--spacing) * 1)"
            />
        );

    return <Toaster position="bottom-right" />;
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

export interface Notification {
    /** One notification per slot: a new one replaces the last. */
    slot: string;
    /** A failure is red and stays until it's closed; a success is green and clears itself five seconds after the
     *  pointer and the keyboard focus leave it. */
    tone?: 'success' | 'danger';
    /** Names the close button, such as "Dismiss: Moved #61". */
    dismissLabel: string;
    /** What it says: text, links and buttons. */
    body: ReactNode;
    /** Called after it closes while the keyboard focus was inside it, to put the focus somewhere useful. */
    onFocusLost?: () => void;
}

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
        color: notification.tone === 'danger' ? 'danger' : 'success',
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

/** Gives a success five seconds after hover and keyboard focus leave it. */
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

/** One notification's content. `onClose` runs when its close button is clicked or, for a success, when its time is up. */
function NotificationBody({
    slot,
    dismissLabel,
    tone = 'success',
    body,
    onClose,
}: Notification & { onClose: () => void }) {
    const ref = useRef<HTMLSpanElement>(null);
    const [held, setHeld] = useState(false);
    const [bodyFailed, setBodyFailed] = useState(false);
    const failed = tone === 'danger' || bodyFailed;

    useEffect(() => {
        ref.current?.closest('[data-slot="toast"]')?.setAttribute('data-toast-color', failed ? 'danger' : 'success');
    }, [failed]);
    useSuccessClose(ref, !failed && !held, onClose);

    return (
        <span ref={ref} data-toast={slot}>
            <DismissButton label={dismissLabel} onClick={onClose} />
            <Controls.Provider value={{ hold: setHeld, fail: setBodyFailed }}>{body}</Controls.Provider>
        </span>
    );
}
