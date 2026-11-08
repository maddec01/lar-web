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
        title: 'Couldn’t reach /mnt/media/music',
        description: 'The folder is missing or the server can’t read it. Check that the drive is mounted.',
    },
};

export const WithAction: Story = {
    args: {
        tone: 'danger',
        title: 'Metadata refresh failed',
        description: 'TheMovieDB didn’t respond in time.',
        action: (
            <Button variant="secondary" onClick={fn()}>
                Try again
            </Button>
        ),
    },
};

export const Dismissible: Story = { args: { dismissible: true, onDismiss: fn() } };

export const Compact: Story = {
    args: {
        size: 'sm',
        tone: 'warning',
        title: 'Read-only folder',
        description: 'Lar can play these files but can’t write artwork next to them.',
    },
};

/** A title alone is a one-line notice: its words read as the regular-weight message, never as a bold sentence. */
export const TitleOnly: Story = {
    args: { tone: 'info', title: 'Edits shared metadata in Music and Vinyl Rips', description: undefined },
};

/** The same notice inside a modal or a pane: compact, at every place it appears in that surface. */
export const TitleOnlyCompact: Story = {
    args: { ...TitleOnly.args, size: 'sm' },
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

/** Compact alerts in every tone: the icon centres on the first line, with or without a title. */
export const CompactTones: Story = {
    render: (args) => (
        <div className="flex max-w-md flex-col gap-3">
            {(['info', 'success', 'warning', 'danger'] as const).map((tone) => (
                <Alert
                    key={tone}
                    {...args}
                    size="sm"
                    tone={tone}
                    title={undefined}
                    description={`A short ${tone} note.`}
                />
            ))}
            <Alert
                {...args}
                size="sm"
                tone="warning"
                title="Read-only folder"
                description="Lar can play these files but can’t write artwork next to them, so covers stay in the cache."
            />
        </div>
    ),
};

export const Message: Story = {
    args: {
        title: undefined,
        description: undefined,
        message: 'Changes here apply to every catalog that holds this album.',
    },
};
