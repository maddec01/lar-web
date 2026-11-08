import type { Meta, StoryObj } from '@storybook/react-vite';
import { CircleAlertIcon, CircleCheckIcon, HardDriveIcon, InfoIcon, TriangleAlertIcon } from 'lucide-react';

import { Button } from '../actions/Button';
import { Badge } from './Badge';
import { NoticeCard } from './NoticeCard';
import { PathList } from './PathList';

const meta = {
    title: 'Display/NoticeCard',
    component: NoticeCard,
    args: {
        tone: 'warning',
        icon: <TriangleAlertIcon />,
        title: '12 files couldn’t be matched',
        description:
            'Lar found these files in Movies but couldn’t tell which film they are. Rename them or match them by hand.',
        badge: <Badge tone="warning">Needs review</Badge>,
        actions: (
            <>
                <Button>Match files</Button>
                <Button variant="secondary">Ignore</Button>
            </>
        ),
    },
    decorators: [
        (Story) => (
            <div className="max-w-2xl">
                <Story />
            </div>
        ),
    ],
} satisfies Meta<typeof NoticeCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Warning: Story = {};

export const Danger: Story = {
    args: {
        tone: 'danger',
        icon: <HardDriveIcon />,
        title: 'Disk /mnt/media is almost full',
        description: 'Only 18 GB of 4 TB remain. New photo backups will stop when the disk is full.',
        badge: <Badge tone="danger">Critical</Badge>,
        actions: <Button>Review storage</Button>,
    },
};

/** On a wide page a long explanation keeps a reading measure (about 75 characters a line) instead of the card's width. */
export const WideLongDescription: Story = {
    args: {
        title: 'Different editions share one folder',
        description:
            'This folder holds 2 editions of the same album, so tracks show up more than once and players can mix them up. You can keep them all, each in its own folder, or keep just one and Lar sets the others aside. Lidarr tracks one edition per album, and whichever you keep, you choose which one it uses.',
        badge: <Badge tone="warning">Worth fixing</Badge>,
    },
    decorators: [
        (Story) => (
            <div className="w-full max-w-7xl">
                <Story />
            </div>
        ),
    ],
    parameters: { layout: 'fullscreen' },
};

export const WithDetails: Story = {
    args: {
        children: (
            <PathList
                label="Unmatched files"
                paths={[
                    { key: '1', path: '/mnt/media/movies/untitled_final_v2.mkv' },
                    { key: '2', path: '/mnt/media/movies/DVD_RIP_03/VIDEO_TS/VTS_01_1.VOB' },
                    { key: '3', path: '/mnt/media/movies/Some.Film.1080p.WEB-DL.DDP5.1.H.264-GROUP.mkv' },
                ]}
            />
        ),
        footer: (
            <details className="text-fg-muted text-xs">
                <summary className="cursor-pointer">Technical details</summary>
                <p className="mt-2 font-mono">matcher: tmdb · confidence threshold 0.82 · job 7f3a</p>
            </details>
        ),
    },
};

/** Every tone side by side, for comparing them in light and dark. */
export const Tones: Story = {
    render: (args) => (
        <div className="flex flex-col gap-4">
            {(
                [
                    { tone: 'neutral', icon: <InfoIcon /> },
                    { tone: 'info', icon: <InfoIcon /> },
                    { tone: 'success', icon: <CircleCheckIcon /> },
                    { tone: 'warning', icon: <TriangleAlertIcon /> },
                    { tone: 'danger', icon: <CircleAlertIcon /> },
                ] as const
            ).map(({ tone, icon }) => (
                <NoticeCard
                    key={tone}
                    {...args}
                    tone={tone}
                    icon={icon}
                    title={`A ${tone} notice`}
                    badge={<Badge tone={tone}>{tone}</Badge>}
                    level="h3"
                />
            ))}
        </div>
    ),
};
