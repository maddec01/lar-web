import type { Meta, StoryObj } from '@storybook/react-vite';
import { FilmIcon, FolderGitIcon, MoreHorizontalIcon, MusicIcon, RefreshCwIcon, TvIcon } from 'lucide-react';

import { Button } from '../actions/Button';
import { IconButton } from '../actions/IconButton';
import { StatusIndicator } from '../feedback/StatusIndicator';
import { Text } from '../typography/Typography';
import { Badge } from './Badge';
import { DetailList } from './DetailList';
import { ResourceCard, ResourceCardSkeleton } from './ResourceCard';

const details = (
    <>
        <Text variant="label">Movies</Text>
        <Text variant="caption" tone="muted">
            /mnt/media/movies · 1,284 items
        </Text>
    </>
);

const status = (
    <span className="inline-flex items-center gap-2">
        <StatusIndicator tone="success" size="sm" />
        <Text as="span" variant="caption" tone="muted">
            Scanned 12 minutes ago
        </Text>
    </span>
);

const actions = (
    <>
        <Button variant="quiet" leftIcon={<RefreshCwIcon />}>
            Scan
        </Button>
        <IconButton aria-label="More actions for Movies" icon={<MoreHorizontalIcon />} />
    </>
);

const meta = {
    title: 'Display/ResourceCard',
    component: ResourceCard,
    args: {
        leading: <FilmIcon />,
        details,
        status,
        actions,
        trailing: <Badge>18.2 TB</Badge>,
    },
    decorators: [
        (Story) => (
            <div className="max-w-3xl">
                <Story />
            </div>
        ),
    ],
} satisfies Meta<typeof ResourceCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithPanel: Story = {
    args: {
        panel: (
            <div className="p-4">
                <DetailList
                    compact
                    title="Library settings"
                    items={[
                        { label: 'Agent', value: 'TMDB' },
                        { label: 'Language', value: 'English (en-GB)' },
                    ]}
                />
            </div>
        ),
    },
};

export const Compact: Story = { args: { compact: true, trailing: undefined } };

export const CompactWithTrailing: Story = {
    args: {
        compact: true,
        trailing: (
            <Button variant="secondary" leftIcon={<RefreshCwIcon />}>
                Scan now
            </Button>
        ),
        actions: null,
    },
};

/** A dense ruled row for scanning long lists, such as Factory repositories. */
export const Scan: Story = {
    render: () => (
        <div className="border-base-300 bg-base-100 rounded-lg border">
            {(
                [
                    { name: 'lar-web', branch: 'main', tone: 'success', text: 'Up to date' },
                    { name: 'lar-server', branch: 'feat/transcoder', tone: 'warning', text: '3 jobs queued' },
                    { name: 'lar-ios', branch: 'main', tone: 'danger', text: 'Build failed' },
                ] as const
            ).map((repo) => (
                <ResourceCard
                    key={repo.name}
                    presentation="scan"
                    leading={<FolderGitIcon />}
                    details={
                        <Text as="span" variant="label" truncate>
                            {repo.name}
                        </Text>
                    }
                    status={
                        <span className="inline-flex items-center gap-2">
                            <StatusIndicator tone={repo.tone} size="sm" />
                            <Text as="span" variant="caption" tone="muted">
                                {repo.branch} · {repo.text}
                            </Text>
                        </span>
                    }
                    actions={<Button variant="quiet">Open</Button>}
                />
            ))}
        </div>
    ),
};

/** Tiles with metrics, as on the server overview. */
export const Overview: Story = {
    render: () => (
        <div className="grid gap-4 sm:grid-cols-3">
            {[
                { name: 'Music', icon: <MusicIcon />, items: '48,210', label: 'tracks', size: '1.1 TB' },
                { name: 'Movies', icon: <FilmIcon />, items: '1,284', label: 'movies', size: '18.2 TB' },
                { name: 'TV', icon: <TvIcon />, items: '6,402', label: 'episodes', size: '9.7 TB' },
            ].map((library) => (
                <ResourceCard
                    key={library.name}
                    presentation="overview"
                    leading={library.icon}
                    details={
                        <>
                            <Text variant="label">{library.name}</Text>
                            <Text variant="caption" tone="muted">
                                Scanned today
                            </Text>
                        </>
                    }
                    actions={
                        <IconButton aria-label={`More actions for ${library.name}`} icon={<MoreHorizontalIcon />} />
                    }
                    metricsLabel={`${library.name} totals`}
                    metrics={[
                        { label: library.label, value: library.items },
                        { label: 'on disk', value: library.size },
                    ]}
                    status={status}
                />
            ))}
        </div>
    ),
};

export const Loading: Story = {
    render: () => (
        <div className="flex flex-col gap-4">
            <div className="border-base-300 rounded-lg border">
                <ResourceCardSkeleton />
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
                <ResourceCardSkeleton presentation="overview" />
                <ResourceCardSkeleton presentation="overview" />
                <ResourceCardSkeleton presentation="overview" />
            </div>
        </div>
    ),
};
