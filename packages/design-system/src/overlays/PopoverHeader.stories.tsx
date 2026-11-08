import type { Meta, StoryObj } from '@storybook/react-vite';
import { RefreshCwIcon } from 'lucide-react';

import { Button } from '../actions/Button';
import { IconButton } from '../actions/IconButton';
import { StatusRow } from '../feedback/StatusRow';
import { Popover } from './Popover';
import { PopoverHeader } from './PopoverHeader';

/** The header of a toolbar or counter popover: a sentence-case title, a quiet count or a status, a divider always. */
const meta = {
    title: 'Overlays/PopoverHeader',
    component: PopoverHeader,
    args: { title: 'Building' },
    render: (args) => (
        <div className="flex h-72 justify-end">
            <Popover defaultOpen>
                <Popover.Trigger asChild>
                    <Button variant="secondary">Open</Button>
                </Popover.Trigger>
                <Popover.Content align="end" width="md" layout="fill" presentation="flush">
                    <PopoverHeader {...args} />
                    <div className="flex flex-col gap-1 p-2">
                        <StatusRow size="sm" tone="info" label="#150 Relay for streaming away from home" value="17d" />
                        <StatusRow size="sm" tone="info" label="#30 Chapter markers in the scrubber" value="17d" />
                    </div>
                </Popover.Content>
            </Popover>
        </div>
    ),
} satisfies Meta<typeof PopoverHeader>;

export default meta;

type Story = StoryObj<typeof meta>;

/** A counter’s popover: the title and how many rows follow, quietly. */
export const Count: Story = { args: { title: 'Building', count: 4, countLabel: '4 running' } };

/** A status popover: the overall state as a light and a word. */
export const Status: Story = {
    args: { title: 'Server health', detail: 'Up 3 days', status: { state: 'ready', label: 'Healthy' } },
};

export const Warning: Story = {
    args: { title: 'Remote access', status: { state: 'waiting', label: 'On, waiting' } },
};

/** A trailing action follows the status. */
export const WithAction: Story = {
    args: {
        title: 'Playback',
        count: 2,
        action: <IconButton aria-label="Refresh" icon={<RefreshCwIcon />} variant="title-bar" />,
    },
};

/** A long title wraps; when the status no longer fits beside it, the status moves under it. Nothing truncates. */
export const LongTitle: Story = {
    args: {
        title: 'Everything the server is working on right now across every catalog',
        count: 12,
        status: { tone: 'info', label: 'Working' },
    },
};

/** A mixed state: each part in its own tone, the failures never in the active blue. */
export const MixedStatus: Story = {
    args: {
        title: 'Background tasks',
        status: [
            { state: 'active', label: '5 active' },
            { state: 'failed', label: '3 failed' },
        ],
    },
};

/** Four parts don’t fit beside the title: the summary moves under the title, which keeps its whole name. */
export const ManyStatusParts: Story = {
    args: {
        title: 'Background tasks',
        count: 9,
        status: [
            { state: 'active', label: '3 running' },
            { state: 'off', label: '2 queued' },
            { state: 'waiting', label: '1 waiting' },
            { state: 'failed', label: '3 failed' },
        ],
    },
};

/** A long detail wraps under the title instead of cutting off mid-word. */
export const LongDetail: Story = {
    args: {
        title: 'Building',
        count: 4,
        detail: '4 count toward the limit · 1 running · 2 over the automatic limit',
    },
};
