import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';

import { Button } from '../actions/Button';
import { dismissAllNotifications, showErrorNotification, showSuccessNotification } from './ErrorNotification';
import { Notifications, showNotification, useNotificationControls } from './Notifications';

/**
 * The toaster is mounted once by the app (and by Storybook's preview), so these stories only call the helpers that
 * raise notifications into it.
 */
const meta = {
    title: 'Feedback/Notifications',
    component: Notifications,
    render: () => (
        <div className="flex flex-wrap gap-3">
            <Button variant="secondary" onClick={() => showSuccessNotification('“Kind of Blue” added to Favourites')}>
                Show success
            </Button>
            <Button
                variant="destructive"
                onClick={() =>
                    showErrorNotification({
                        title: 'Scan failed',
                        description: 'Lar could not read /mnt/media/movies. Check that the drive is mounted.',
                    })
                }
            >
                Show error
            </Button>
            <Button
                variant="quiet"
                onClick={() =>
                    showErrorNotification({
                        title: 'Could not save the catalog',
                        description:
                            'The server rejected the change because another administrator edited “Family photos” at the same time. Reload the catalog to see their changes, then apply yours again.',
                    })
                }
            >
                Show long error
            </Button>
            <Button variant="quiet" onClick={dismissAllNotifications}>
                Dismiss all
            </Button>
        </div>
    ),
} satisfies Meta<typeof Notifications>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Triggers: Story = {};

/** A body with its own action, which holds its notification open while it runs and turns it red if it fails. */
function QueueAction({ fails }: { fails: boolean }) {
    const { hold, fail } = useNotificationControls();
    const [state, setState] = useState<'added' | 'queueing' | 'queued' | 'failed'>('added');

    return (
        <>
            <span role={state === 'failed' ? 'alert' : 'status'}>
                {state === 'added'
                    ? 'Added #61 to List.'
                    : state === 'queueing'
                      ? 'Queueing…'
                      : state === 'queued'
                        ? 'Moved #61 to Queued.'
                        : 'Could not queue #61: the board server is unreachable.'}
            </span>{' '}
            {state === 'added' && (
                <Button
                    variant="secondary"
                    compact
                    onClick={() => {
                        setState('queueing');
                        hold(true);
                        setTimeout(() => {
                            setState(fails ? 'failed' : 'queued');
                            hold(false);
                            fail(fails);
                        }, 800);
                    }}
                >
                    Queue
                </Button>
            )}
        </>
    );
}

let shown = 0;

/** The stack: every notification stays until closed (failures) or for five seconds after the pointer leaves it
 *  (successes), oldest above, and one per slot, so a new one in a slot replaces the last. */
export const Stack: Story = {
    parameters: { notifications: false },
    render: () => (
        <div className="flex flex-wrap gap-3">
            <Button
                variant="secondary"
                onClick={() =>
                    showNotification({
                        slot: `move-${(shown += 1)}`,
                        dismissLabel: `Dismiss: Moved #${60 + shown}`,
                        body: `Moved #${60 + shown} to Building.`,
                    })
                }
            >
                Show success
            </Button>
            <Button
                variant="destructive"
                onClick={() =>
                    showNotification({
                        slot: 'error',
                        tone: 'danger',
                        dismissLabel: 'Dismiss: error for #61',
                        body: "Couldn't move #61 to List. GitHub answered 502.",
                    })
                }
            >
                Show failure (replaces the last)
            </Button>
            <Button
                variant="quiet"
                onClick={() =>
                    showNotification({
                        slot: 'added',
                        dismissLabel: 'Dismiss: Added #61',
                        body: <QueueAction fails={false} />,
                    })
                }
            >
                Show with an action
            </Button>
            <Button
                variant="quiet"
                onClick={() =>
                    showNotification({
                        slot: 'added',
                        dismissLabel: 'Dismiss: Added #61',
                        body: <QueueAction fails />,
                    })
                }
            >
                Show with a failing action
            </Button>
            <Button variant="quiet" onClick={dismissAllNotifications}>
                Dismiss all
            </Button>
            <Notifications presentation="stack" />
        </div>
    ),
};
