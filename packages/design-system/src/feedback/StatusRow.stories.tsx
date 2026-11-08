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

export const Compact: Story = { args: { size: 'sm', tone: 'danger', label: '/mnt/media/tv', value: 'Offline' } };

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
        detail: '14 files couldn’t be read because their names contain characters the filesystem rejects',
        value: '14 issues',
    },
};

/** A narrow popover row whose end holds the way to it and its state: `action` is the one "Review" look (a small
 *  secondary button, as in every attention row), and `value` the state word after it. The label wraps instead of
 *  truncating, and when even that can't fit, the end moves under the label, at the row's end. */
export const NarrowWithLinkAndState: Story = {
    decorators: [
        (Story) => (
            <div className="flex w-72 flex-col">
                <StatusRow size="sm" state="ready" label="Server" value="Online" />
                <Story />
                <StatusRow size="sm" state="waiting" label="Photo library on the backup drive" value="1 unavailable" />
            </div>
        ),
    ],
    args: {
        size: 'sm',
        tone: 'warning',
        label: 'Remote access',
        detail: 'Your router hasn’t answered yet',
        action: { label: 'Review', href: '#remote-access', onNavigate: fn() },
        value: 'On, confirming',
    },
};

/** A page row with the way to what it reports at its end; its value reads under the label. */
export const WithReviewAction: Story = {
    args: {
        tone: 'danger',
        label: 'Documentaries',
        detail: 'The folder /mnt/media/docs is missing',
        action: { label: 'Review', onClick: fn() },
        value: 'Unavailable',
    },
};
