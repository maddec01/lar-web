import type { Meta, StoryObj } from '@storybook/react-vite';
import { useEffect, useState } from 'react';

import { Button } from '../actions/Button';
import { dismissAllNotifications, showErrorNotification, showSuccessNotification } from './ErrorNotification';
import { Notifications, showNotification, useNotificationControls } from './Notifications';

/**
 * The toaster is mounted once by the app (and by Storybook’s preview), so these stories only call the helpers that
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
                variant="secondary"
                onClick={() =>
                    showErrorNotification({
                        title: 'Scan failed',
                        description: 'Lar couldn’t read /mnt/media/movies. Check that the drive is mounted.',
                    })
                }
            >
                Show error
            </Button>
            <Button
                variant="quiet"
                onClick={() =>
                    showErrorNotification({
                        title: 'Couldn’t save the catalog',
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
                        : 'Couldn’t queue #61: the board server is unreachable.'}
            </span>{' '}
            {state === 'added' && (
                <Button
                    variant="secondary"
                    size="sm"
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
                variant="secondary"
                onClick={() =>
                    showNotification({
                        slot: 'error',
                        tone: 'danger',
                        dismissLabel: 'Dismiss: error for #61',
                        body: 'Couldn’t move #61 to List. GitHub answered 502.',
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
            <Notifications />
        </div>
    ),
};

/** Raises one notification of every tone as it mounts: a success and an info clear themselves, a warning and a failure
 *  wait; each has its icon, a specific title, and the failure offers to try again. */
function EveryTone() {
    useEffect(() => {
        showNotification({ slot: 'tone-success', tone: 'success', title: '“Kind of Blue” added to Favourites' });
        showNotification({
            slot: 'tone-info',
            tone: 'info',
            title: 'Scan started',
            description: 'Music is being read again; playback keeps working.',
        });
        showNotification({
            slot: 'tone-warning',
            tone: 'warning',
            title: 'TheMovieDB is slow to answer',
            description: 'New movies wait for their metadata.',
        });
        showErrorNotification({
            title: 'Couldn’t save Music',
            description: 'Lar couldn’t reach the server. Your changes are still in the form.',
            action: { label: 'Try again', onAction: () => {} },
        });

        return dismissAllNotifications;
    }, []);

    return (
        <>
            <p className="text-fg-muted text-sm">Every tone, in the bottom right corner.</p>
            <Notifications />
        </>
    );
}

export const Tones: Story = { parameters: { notifications: false }, render: () => <EveryTone /> };
