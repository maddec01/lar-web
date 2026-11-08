import type { Meta, StoryObj } from '@storybook/react-vite';
import { FilmIcon, FolderGitIcon, MoreHorizontalIcon, MusicIcon, RefreshCwIcon, TvIcon } from 'lucide-react';

import { Button } from '../actions/Button';
import { IconButton } from '../actions/IconButton';
import { ProgressStatusRow } from '../feedback/ProgressStatusRow';
import { StatusIndicator } from '../feedback/StatusIndicator';
import { Switch } from '../forms/Switch';
import { Grid, Inline, Stack } from '../layout/Flow';
import { Heading, Text } from '../typography/Typography';
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
                    variant="inline"
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

export const Compact: Story = { args: { size: 'sm', trailing: undefined } };

export const CompactWithTrailing: Story = {
    args: {
        size: 'sm',
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
        <div className="border-line bg-surface-raised rounded-lg border">
            {(
                [
                    { name: 'lar-web', branch: 'main', tone: 'success', text: 'Up to date' },
                    { name: 'lar-server', branch: 'feat/transcoder', tone: 'warning', text: '3 jobs queued' },
                    { name: 'lar-ios', branch: 'main', tone: 'danger', text: 'Build failed' },
                ] as const
            ).map((repo) => (
                <ResourceCard
                    key={repo.name}
                    presentation="row"
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
            <div className="border-line rounded-lg border">
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

/** A provider with no actions has no empty footer band. */
export const WithoutFooter: Story = { args: { actions: null, trailing: null } };

export const WithoutStatus: Story = {
    args: { status: null, trailing: <Switch aria-label="Movies on" defaultChecked /> },
};

/** Shared rows align the footer dividers even when one status needs three lines. */
export const OverviewAlignment: Story = {
    render: () => (
        <Grid variant="overview">
            {[
                'Scanned 2 min ago',
                'Waiting for the remote metadata provider to answer; files remain playable.',
                'Not scanned yet',
            ].map((status, index) => (
                <ResourceCard
                    key={status}
                    presentation="overview"
                    details={index ? 'TV shows' : 'Music'}
                    metrics={[{ label: 'Items', value: '1,204' }]}
                    status={
                        <Text variant="caption" tone="muted">
                            {status}
                        </Text>
                    }
                />
            ))}
        </Grid>
    ),
};

const longPath = '/mnt/user/media/field-recordings/archive/2019 - 2024 sessions/uncompressed masters';

/** A catalog in Settings: a long status and a long path each keep to their own column, cut with an ellipsis and
 *  whole in a hover title; the status never reaches over the details. */
export const LongContent: Story = {
    args: {
        leading: <MusicIcon />,
        details: (
            <Stack space="tight">
                <Inline align="center" space="related" wrap>
                    <Heading as="h3" variant="label">
                        Field Recordings
                    </Heading>
                    <Badge muted>Music</Badge>
                </Inline>
                <Text variant="caption" tone="muted" truncate title={longPath}>
                    {longPath}
                </Text>
            </Stack>
        ),
        status: (
            <Stack space="tight">
                <Text variant="caption" tone="muted">
                    0 albums · 0 tracks
                </Text>
                <ProgressStatusRow
                    layout="line"
                    size="sm"
                    label="Turned off"
                    state="off"
                    secondaryDetail="Last scanned Sep 29, 1:20 PM"
                    onDetails={() => undefined}
                    detailsLabel="Show scan details"
                />
            </Stack>
        ),
        actions: (
            <>
                <Button variant="secondary">Catalog check-up</Button>
                <Button variant="secondary">Edit</Button>
                <Button variant="destructive-quiet">Delete</Button>
            </>
        ),
        trailing: (
            <>
                <Text as="span" variant="caption" tone="muted">
                    Off
                </Text>
                <Switch aria-label="Turn Field Recordings on" />
            </>
        ),
    },
};

/** Below 36rem the status takes its own line under the details, from their text's start; the footer's switch keeps
 *  to the end when it wraps under the actions. */
export const LongContentNarrow: Story = {
    ...LongContent,
    decorators: [
        (Story) => (
            <div className="max-w-sm">
                <Story />
            </div>
        ),
    ],
};
