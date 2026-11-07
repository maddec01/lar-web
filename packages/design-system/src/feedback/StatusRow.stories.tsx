import type { Meta, StoryObj } from '@storybook/react-vite';
import { CpuIcon, RefreshCwIcon } from 'lucide-react';
import { fn } from 'storybook/test';

import { IconButton } from '../actions/IconButton';
import { SkeletonLoader } from './SkeletonLoader';
import { StatusRow } from './StatusRow';

const meta = {
    title: 'Feedback/StatusRow',
    component: StatusRow,
    args: { tone: 'success', label: 'Database', value: 'Healthy' },
    decorators: [
        (Story) => (
            <div className="max-w-sm">
                <Story />
            </div>
        ),
    ],
} satisfies Meta<typeof StatusRow>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithDetail: Story = {
    args: { tone: 'warning', label: 'Transcoder', detail: 'Hardware acceleration unavailable', value: 'CPU' },
};

export const WithIndicator: Story = {
    args: {
        tone: 'info',
        indicator: <CpuIcon />,
        label: 'CPU',
        detail: '8 cores · 34% in use',
        secondaryDetail: 'Load 2.4 · 1.9 · 1.6',
        value: '34%',
    },
};

export const Compact: Story = { args: { compact: true, tone: 'danger', label: '/mnt/media/tv', value: 'Offline' } };

export const Loading: Story = {
    args: {
        loading: true,
        indicator: <SkeletonLoader.Shape presentation="circle" />,
        detail: 'Loading',
        value: undefined,
    },
};

export const WithTrailingAction: Story = {
    args: {
        tone: 'neutral',
        label: 'Metadata cache',
        detail: '2.3 GB · last cleared 14 days ago',
        trailing: <IconButton aria-label="Refresh cache" icon={<RefreshCwIcon />} onClick={fn()} />,
    },
};

export const LongContent: Story = {
    args: {
        tone: 'warning',
        label: '/mnt/media/photos/Family/2019 - Summer holidays in Lisbon and Porto (edited)',
        detail: '14 files could not be read because their names contain characters the filesystem rejects',
        value: '14 issues',
    },
};
