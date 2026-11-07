import type { Meta, StoryObj } from '@storybook/react-vite';

import { Button } from '../actions/Button';
import { dismissAllNotifications, showErrorNotification, showSuccessNotification } from './ErrorNotification';
import { Notifications } from './Notifications';

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
