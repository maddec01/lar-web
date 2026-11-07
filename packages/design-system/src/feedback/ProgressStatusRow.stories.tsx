import type { Meta, StoryObj } from '@storybook/react-vite';
import { PauseIcon } from 'lucide-react';
import { fn } from 'storybook/test';

import { IconButton } from '../actions/IconButton';
import { ProgressStatusRow } from './ProgressStatusRow';

const meta = {
    title: 'Feedback/ProgressStatusRow',
    component: ProgressStatusRow,
    args: {
        active: true,
        label: 'Scanning Music',
        detail: '1,204 of 3,890 files',
        progress: { value: 1204, max: 3890 },
    },
    decorators: [
        (Story) => (
            <div className="max-w-sm">
                <Story />
            </div>
        ),
    ],
} satisfies Meta<typeof ProgressStatusRow>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Determinate: Story = {};

export const Indeterminate: Story = {
    args: { label: 'Matching movies', detail: 'Looking up TheMovieDB', progress: undefined },
};

export const Idle: Story = {
    args: { active: false, tone: 'neutral', label: 'Photos', detail: 'Last scanned 2 hours ago', progress: undefined },
};

export const Completed: Story = {
    args: { active: false, tone: 'success', label: 'Books', detail: '412 books, up to date', progress: undefined },
};

export const WithIssue: Story = {
    args: {
        tone: 'warning',
        label: 'Transcoding “Dune: Part Two”',
        detail: '38% · 12 min left',
        progress: { value: 38, max: 100 },
        issue: 'Hardware acceleration unavailable; using the CPU.',
    },
};

export const Failed: Story = {
    args: {
        active: false,
        tone: 'danger',
        label: 'Scanning TV',
        detail: 'Stopped after 214 of 980 files',
        issue: 'Permission denied: /mnt/media/tv/The Wire/Season 3',
        progress: undefined,
    },
};

export const WithDetailsAndTrailing: Story = {
    args: {
        onDetails: fn(),
        detailsLabel: 'Show scan details',
        secondaryDetail: 'Started 4 minutes ago',
        trailing: <IconButton aria-label="Pause scan" icon={<PauseIcon />} onClick={fn()} />,
    },
};

export const Compact: Story = {
    args: {
        compact: true,
        label: 'Indexing /mnt/media/photos/2019 Lisbon trip with a very long folder name',
        detail: 'IMG_20190614_183301_HDR_edited_final_v2.jpg and 1,204 more files',
    },
};
