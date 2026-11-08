import { toast } from '@ninna-ui/feedback';

import { forgetNotificationSlots, type NotificationAction, showNotification } from './Notifications';

export interface ErrorNotification {
    /** What failed, specifically, such as "Couldn't save Music". */
    title: string;
    /** Why, or what to do, in a sentence. */
    description: string;
    /** A follow-up, such as "Try again". */
    action?: NotificationAction;
}

export function dismissAllNotifications(): void {
    toast.dismissAll();
    forgetNotificationSlots();
}

/** A failure as a `danger` Notification, which stays until it's closed. The same failure again replaces it rather
 *  than stacking a copy. */
export function showErrorNotification(notification: ErrorNotification): void {
    showNotification({
        slot: `error:${notification.title}:${notification.description}`,
        tone: 'danger',
        ...notification,
    });
}

/** A success as a `success` Notification, which clears itself; a new success replaces the last. */
export function showSuccessNotification(message: string): void {
    showNotification({ slot: 'success', tone: 'success', title: message });
}
