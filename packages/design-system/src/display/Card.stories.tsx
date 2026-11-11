import type { Meta, StoryObj } from '@storybook/react-vite';
import { DiscAlbumIcon, EllipsisIcon, FolderIcon, GitPullRequestIcon, MonitorIcon } from 'lucide-react';
import { fn } from 'storybook/test';

import { Button } from '../actions/Button';
import { IconButton } from '../actions/IconButton';
import { StatusIndicator } from '../feedback/StatusIndicator';
import { categoricalHues } from '../foundations/tokens';
import { Text } from '../typography/Typography';
import { Badge } from './Badge';
import { Card, CardHeader } from './Card';

const meta = {
    title: 'Display/Card',
    component: Card,
    args: {
        label: 'Music',
        header: (
            <CardHeader
                leading={<FolderIcon />}
                title="Music"
                subtitle="/mnt/media/music · 1,204 albums"
                aside={<StatusIndicator state="ready" label="Up to date" />}
            />
        ),
        footer: (
            <Text as="span" variant="caption" tone="muted">
                Scanned 2 hours ago
            </Text>
        ),
        actions: (
            <>
                <Button variant="quiet" size="sm">
                    Settings
                </Button>
                <Button variant="tinted" size="sm">
                    Scan now
                </Button>
            </>
        ),
        divided: true,
    },
    decorators: [
        (Story) => (
            <div className="max-w-md">
                <Story />
            </div>
        ),
    ],
} satisfies Meta<typeof Card>;

export default meta;

type Story = StoryObj<typeof meta>;

/** A thing you act on: header, footer and its actions (`sm`, the tinted one for "you can act on this"). */
export const Default: Story = {};

/** A card that goes somewhere: its title is the stretched link, so under the pointer its fill lifts and its edge
 *  too; its own buttons stay above the link. */
export const Navigates: Story = {
    args: {
        header: (
            <CardHeader
                leading={<DiscAlbumIcon />}
                title="Kind of Blue"
                href="#album"
                subtitle="Miles Davis · 1959"
                aside={<IconButton aria-label="More actions" variant="inline" icon={<EllipsisIcon />} onClick={fn()} />}
            />
        ),
        footer: undefined,
        actions: undefined,
        divided: false,
    },
};

/** Factory's desk card: one item awaiting you, opening its dialog (`onOpen`) on the attention recipe in amber,
 *  its source, kind and age above a two-line title, its status and a tinted action at the foot. */
export const NeedsYou: Story = {
    args: {
        label: 'Fix the importer’s date parsing',
        onOpen: fn(),
        attention: 'warning',
        padding: 'sm',
        divided: false,
        header: (
            <CardHeader
                eyebrow={
                    <>
                        <GitPullRequestIcon className="size-3.5" />
                        <Badge hue={categoricalHues.rose}>bug</Badge>
                        <span className="ml-auto">2h</span>
                    </>
                }
                title="Fix the importer’s date parsing when the year comes first in ISO week dates"
                titleLines={2}
            />
        ),
        footer: <StatusIndicator state="waiting" label="Answer the question in T3" />,
        actions: (
            <Button variant="tinted" size="sm">
                Answer in T3
            </Button>
        ),
    },
    decorators: [
        (Story) => (
            <div className="w-88">
                <Story />
            </div>
        ),
    ],
};

/** The one the reader has open: the current wash and a navy edge, over the attention bar when it has one. */
export const Selected: Story = { args: { ...NeedsYou.args, selected: true }, decorators: NeedsYou.decorators };

/** Something on it broke: the attention recipe in red. */
export const Danger: Story = {
    args: {
        attention: 'danger',
        header: (
            <CardHeader
                leading={<FolderIcon />}
                title="Films"
                subtitle="/mnt/media/films"
                aside={<StatusIndicator state="failed" label="Folder not found" />}
            />
        ),
        footer: undefined,
        actions: (
            <Button variant="tinted" size="sm">
                Review
            </Button>
        ),
        divided: false,
    },
};

/** Detected but out of use: a dashed outline, no fill. */
export const Unavailable: Story = {
    args: {
        unavailable: true,
        header: (
            <CardHeader
                leading={<MonitorIcon />}
                title="Intel Quick Sync"
                subtitle="Not supported by this driver"
                aside={<StatusIndicator state="off" label="Unavailable" />}
            />
        ),
        footer: undefined,
        actions: undefined,
    },
};

/** A strip edge to edge above the header, such as a library's newest covers. */
export const WithMedia: Story = {
    args: {
        media: (
            <div className="bg-fill-muted flex h-28 items-center gap-2 px-4">
                {Array.from({ length: 4 }, (_, index) => (
                    <div key={index} className="categorical-fill category-cyan size-20 rounded-md border" />
                ))}
            </div>
        ),
        header: <CardHeader title="Jazz" href="#jazz" subtitle="12 albums · 94 tracks" />,
        footer: <StatusIndicator state="active" motion="spin" label="Scanning · 31%" />,
        actions: undefined,
        divided: true,
    },
};

/** Cards side by side in a grid, every state at once. */
export const Grid: Story = {
    render: () => (
        <div className="grid w-4xl grid-cols-3 gap-3">
            <Card {...meta.args} />
            <Card {...meta.args} {...Navigates.args} />
            <Card {...meta.args} {...NeedsYou.args} />
            <Card {...meta.args} {...Selected.args} />
            <Card {...meta.args} {...Danger.args} />
            <Card {...meta.args} {...Unavailable.args} />
        </div>
    ),
};
