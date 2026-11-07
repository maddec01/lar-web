import type { Meta, StoryObj } from '@storybook/react-vite';

import { CheckList } from './CheckList';

const meta = {
    title: 'Display/CheckList',
    component: CheckList,
    args: {
        label: 'What Lar Server includes',
        items: [
            { key: 'stream', text: 'Stream music, movies and TV to every device at home.' },
            { key: 'photos', text: 'Back up photos from phones automatically.' },
            { key: 'users', text: 'Separate profiles and watch history for everyone in the household.' },
        ],
    },
    decorators: [
        (Story) => (
            <div className="max-w-md">
                <Story />
            </div>
        ),
    ],
} satisfies Meta<typeof CheckList>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const LongText: Story = {
    args: {
        label: 'What this job does',
        items: [
            {
                key: 'scan',
                text: 'Rescans every library folder, matches new files against MusicBrainz and TMDB, and refreshes artwork for anything whose metadata changed since the last scan.',
            },
            { key: 'keep', text: 'Keeps your edits.' },
        ],
    },
};
