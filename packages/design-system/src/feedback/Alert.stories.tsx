import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';

import { Button } from '../actions/Button';
import { Alert } from './Alert';

const meta = {
    title: 'Feedback/Alert',
    component: Alert,
    args: {
        tone: 'info',
        title: 'Library scan in progress',
        description: 'New albums appear as soon as their folders are read. You can keep browsing meanwhile.',
    },
} satisfies Meta<typeof Alert>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Info: Story = {};

export const Success: Story = {
    args: { tone: 'success', title: 'Catalog imported', description: '1,284 movies were added to Films.' },
};

export const Warning: Story = {
    args: {
        tone: 'warning',
        title: 'Transcoding is slower than usual',
        description: 'Hardware acceleration is unavailable, so videos are transcoded on the CPU.',
    },
};

export const Danger: Story = {
    args: {
        tone: 'danger',
        title: 'Could not reach /mnt/media/music',
        description: 'The folder is missing or the server cannot read it. Check that the drive is mounted.',
    },
};

export const WithAction: Story = {
    args: {
        tone: 'danger',
        title: 'Metadata refresh failed',
        description: 'TheMovieDB did not respond in time.',
        action: (
            <Button variant="primary" onClick={fn()}>
                Retry
            </Button>
        ),
    },
};

export const Dismissible: Story = { args: { dismissible: true, onDismiss: fn() } };

export const Compact: Story = {
    args: {
        compact: true,
        tone: 'warning',
        title: 'Read-only folder',
        description: 'Lar can play these files but cannot write artwork next to them.',
    },
};

export const LongContent: Story = {
    args: {
        tone: 'info',
        title: 'Your library is being reorganised after the update to the new folder layout for TV shows and seasons',
        description:
            'Episodes stay playable while each show is moved to /media/tv/<Show>/Season <n>. Large libraries can take several hours; progress appears in Jobs, and nothing is deleted until every episode has been copied and verified against its checksum.',
    },
};

/** Every tone side by side, for comparing them in light and dark. */
export const Tones: Story = {
    render: (args) => (
        <div className="flex max-w-xl flex-col gap-3">
            {(['info', 'success', 'warning', 'danger'] as const).map((tone) => (
                <Alert key={tone} {...args} tone={tone} title={`${tone} alert`} />
            ))}
        </div>
    ),
};
