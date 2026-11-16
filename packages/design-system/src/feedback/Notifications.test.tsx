import { act, render, screen } from '@testing-library/react';
import { useEffect } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vite-plus/test';

import { Notifications, showNotification, useNotificationControls } from './Notifications';

describe('slot notifications', () => {
    beforeEach(() => {
        vi.useFakeTimers({ shouldAdvanceTime: true });
        render(<Notifications />);
    });

    afterEach(() => vi.useRealTimers());

    it('lets its body hold it open and show it as failed, and moves the focus on when it closes with the focus in it', async () => {
        const onFocusLost = vi.fn();

        function Body() {
            const { hold, fail } = useNotificationControls();

            useEffect(() => {
                hold(true);
                fail(true);
            }, [hold, fail]);

            return <span>Queueing failed</span>;
        }

        await act(async () =>
            showNotification({ slot: 'q', dismissLabel: 'Dismiss: queue', body: <Body />, onFocusLost }),
        );
        await act(async () => vi.advanceTimersByTime(6_000));

        const dismiss = screen.getByRole('button', { name: 'Dismiss: queue' });

        expect(dismiss.closest('[data-slot="toast"]')).toHaveAttribute('data-toast-color', 'danger');
        dismiss.focus();
        await act(async () => dismiss.click());
        expect(onFocusLost).toHaveBeenCalledOnce();
    });
});
