import type { Meta, StoryObj } from '@storybook/react-vite';
import {
    CircleAlertIcon,
    CircleCheckIcon,
    HardDriveIcon,
    MoreHorizontalIcon,
    RefreshCwIcon,
    TriangleAlertIcon,
    UserIcon,
} from 'lucide-react';

import { IconButton } from '../actions/IconButton';
import { Avatar } from './Avatar';
import { Badge } from './Badge';
import { RowList, RowListItem } from './RowList';

const meta = {
    title: 'Display/RowList',
    component: RowListItem,
    args: {
        icon: <HardDriveIcon />,
        title: 'Media disk',
        subtitle: '/mnt/media',
        detail: '3.2 TB of 4 TB used',
        tone: 'neutral',
    },
    render: (args) => (
        <div className="max-w-2xl">
            <RowList label="Storage">
                <RowListItem {...args} />
            </RowList>
        </div>
    ),
} satisfies Meta<typeof RowListItem>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Item: Story = {};

export const Link: Story = { args: { href: '/settings/storage/media', onNavigate: () => undefined } };

export const WithBadgesAndActions: Story = {
    args: {
        tone: 'warning',
        icon: <TriangleAlertIcon />,
        title: '12 unmatched files',
        subtitle: 'Movies',
        detail: 'Found during last night’s scan',
        badges: <Badge tone="accent">lar can fix</Badge>,
        actions: <IconButton aria-label="Rescan Movies" icon={<RefreshCwIcon />} />,
    },
};

export const AvatarRow: Story = {
    args: {
        avatar: true,
        icon: <Avatar name="Ana Ferreira" src="https://picsum.photos/seed/lar-ana/96/96" />,
        title: 'Ana Ferreira',
        subtitle: 'Administrator',
        detail: 'Last seen 5 minutes ago on Living Room TV',
        href: '/users/ana',
        onNavigate: () => undefined,
    },
};

export const LongText: Story = {
    args: {
        title: 'A remarkably long title for a row that should truncate rather than wrap onto a second line',
        subtitle: '//nas.local/share/video/Movies (4K)/Remuxes/Criterion Collection/1950s and 1960s',
        detail: 'This detail is also long enough that it needs to be truncated in narrow containers',
    },
};

/** A full list in its bordered panel, with every tone. */
export const Panel: Story = {
    render: () => (
        <div className="max-w-2xl">
            <RowList label="Server health">
                <RowListItem
                    tone="success"
                    icon={<CircleCheckIcon />}
                    title="Backups"
                    subtitle="Last backup finished at 03:04"
                    detail="7 kept · 2.1 GB"
                    href="/settings/backups"
                    onNavigate={() => undefined}
                />
                <RowListItem
                    tone="warning"
                    icon={<TriangleAlertIcon />}
                    title="Metadata"
                    subtitle="12 files couldn’t be matched"
                    badges={<Badge tone="accent">lar can fix</Badge>}
                    href="/libraries/movies/unmatched"
                    onNavigate={() => undefined}
                />
                <RowListItem
                    tone="danger"
                    icon={<CircleAlertIcon />}
                    title="Transcoder"
                    subtitle="The GPU driver failed to load"
                    actions={<IconButton aria-label="More actions" icon={<MoreHorizontalIcon />} />}
                />
                <RowListItem
                    tone="info"
                    icon={<RefreshCwIcon />}
                    title="Update available"
                    subtitle="Lar Server 1.8.0"
                />
                <RowListItem icon={<UserIcon />} title="Users" subtitle="4 people, 1 guest" />
            </RowList>
        </div>
    ),
};

/** Ruled rows in two columns on wide screens. */
export const Columns: Story = {
    render: () => (
        <RowList label="Users" layout="columns">
            {['Ana Ferreira', 'Rui Costa', 'Marta Silva', 'João Santos'].map((name) => (
                <RowListItem
                    key={name}
                    avatar
                    icon={<Avatar name={name} />}
                    title={name}
                    detail="Member"
                    href={`/users/${name}`}
                    onNavigate={() => undefined}
                />
            ))}
        </RowList>
    ),
};
