import { toast } from '@ninna-ui/feedback';

import { forgetNotificationSlots } from './Notifications';

export interface ErrorNotification {
    description: string;
    title: string;
}

export function dismissAllNotifications(): void {
    toast.dismissAll();
    forgetNotificationSlots();
}

export function showErrorNotification(notification: ErrorNotification): void {
    toast.create({
        ...notification,
        color: 'danger',
    });
}

export function showSuccessNotification(message: string): void {
    toast.create({
        color: 'success',
        title: message,
    });
}
