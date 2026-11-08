import type { Meta, StoryObj } from '@storybook/react-vite';
import { HardDriveIcon } from 'lucide-react';

import { Button } from '../actions/Button';
import { Popover } from '../overlays/Popover';
import { ProgressStatusRow } from './ProgressStatusRow';
import { StatusIndicator } from './StatusIndicator';
import { StatusPopoverContent, StatusPopoverSection } from './StatusPopoverContent';
import { StatusRow } from './StatusRow';

/** The body of a status popover, such as the server status in Lar’s header. It renders inside a `Popover`. */
const meta = {
    title: 'Feedback/StatusPopoverContent',
    component: StatusPopoverContent,
    args: {
        title: 'Server health',
        detail: 'Version 0.14.2 · up 12 days',
        status: 'Online',
        tone: 'success',
        width: 'sm',
        children: null,
    },
    render: (args) => (
        <div className="flex h-96 justify-end">
            <Popover defaultOpen>
                <Popover.Trigger asChild>
                    <Button variant="status" leftIcon={<StatusIndicator tone={args.tone} state={args.state} />}>
                        {typeof args.status === 'string' ? args.status : args.title}
                    </Button>
                </Popover.Trigger>
                <StatusPopoverContent {...args} />
            </Popover>
        </div>
    ),
} satisfies Meta<typeof StatusPopoverContent>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Online: Story = {
    args: {
        children: (
            <>
                <StatusRow size="sm" tone="success" label="Database" value="Healthy" />
                <StatusRow size="sm" tone="success" label="Transcoder" value="Idle" />
                <StatusRow
                    size="sm"
                    tone="neutral"
                    indicator={<HardDriveIcon />}
                    label="/mnt/media"
                    detail="1.2 TB free of 4 TB"
                    value="70%"
                />
            </>
        ),
    },
};

export const Busy: Story = {
    args: {
        status: 'Working',
        tone: 'info',
        width: 'md',
        children: (
            <>
                <ProgressStatusRow
                    active
                    label="Scanning Music"
                    detail="1,204 of 3,890 files"
                    progress={{ value: 1204, max: 3890 }}
                />
                <ProgressStatusRow active label="Matching movies" detail="Looking up TheMovieDB" />
            </>
        ),
    },
};

export const Degraded: Story = {
    args: {
        status: 'Degraded',
        tone: 'danger',
        detail: 'One library is unavailable',
        children: (
            <>
                <StatusRow size="sm" tone="success" label="Database" value="Healthy" />
                <StatusRow size="sm" tone="danger" label="/mnt/media/tv" detail="Drive not mounted" value="Offline" />
            </>
        ),
    },
};

/** Rows of different structure keep one rhythm: a row whose value is a control (Remote access’s row button) is as tall
 *  as a row whose value is a word, so no row gains space above it. */
export const MixedRows: Story = {
    args: {
        title: 'Server health',
        detail: 'Uptime 3d 7h',
        status: 'Needs attention',
        state: 'waiting',
        tone: undefined,
        children: (
            <>
                <StatusRow size="sm" state="ready" label="Server" value="Online" />
                <StatusRow size="sm" state="waiting" label="Catalogs" value="1 unavailable" />
                <StatusRow size="sm" state="ready" label="Storage" value="Accessible" />
                <StatusRow
                    size="sm"
                    state="waiting"
                    label="Remote access"
                    trailing={
                        <Button type="button" variant="row">
                            On, waiting
                        </Button>
                    }
                />
            </>
        ),
    },
};

/** Many rows stop the popover at 32rem; they scroll under the header. */
export const ManyRows: Story = {
    args: {
        status: 'Healthy',
        tone: 'success',
        count: 14,
        children: (
            <>
                {Array.from({ length: 14 }, (_, index) => (
                    <StatusRow
                        key={index}
                        size="sm"
                        tone="success"
                        label={`Catalog ${index + 1}`}
                        detail="Checked 4 minutes ago"
                        value="Up to date"
                    />
                ))}
            </>
        ),
    },
};

/** `lg` (24rem) gives rows with a long value room, so labels don’t squeeze. */
export const Wide: Story = {
    args: {
        width: 'lg',
        status: 'Healthy',
        tone: 'success',
        children: (
            <>
                <StatusRow size="sm" tone="success" label="Remote access" value="On, reachable from anywhere" />
                <StatusRow size="sm" tone="warning" label="Metadata providers" value="2 of 3 answering" />
            </>
        ),
    },
};

/** A mixed state keeps each part’s tone: "5 active" in the active blue and "3 failed" in the failure red, never one
 *  forced colour. Rows are identity-first: the catalog leads, the operation follows. */
export const MixedStatus: Story = {
    args: {
        title: 'Background tasks',
        detail: undefined,
        status: [
            { state: 'active', label: '5 active' },
            { state: 'failed', label: '3 failed' },
        ],
        tone: undefined,
        width: 'lg',
        children: (
            <>
                <ProgressStatusRow
                    size="sm"
                    status="running"
                    label="Vinyl Rips"
                    operation="Re-read file metadata · Scanning files"
                    count="1,204 of 3,890 files"
                    eta="12 min left"
                    progress={{ value: 1204, max: 3890 }}
                />
                <ProgressStatusRow
                    size="sm"
                    status="paused"
                    statusLabel="Waiting"
                    label="Music"
                    operation="Reading release details"
                    count="9 of 12 releases"
                    progress={{ value: 9, max: 12 }}
                    reason="MusicBrainz is busy; trying again at 8:21 PM"
                />
                <ProgressStatusRow
                    size="sm"
                    status="failed"
                    label="Field Recordings"
                    operation="Catalog scan"
                    reason="Folder not found: /mnt/media/field"
                />
            </>
        ),
    },
};

/** lar-server's Background tasks: sections with a heading and count, each row a ProgressStatusRow with its action on
 *  the name's line and its bar from the text's start to the row's end. */
export const BackgroundTasks: Story = {
    args: {
        title: 'Background tasks',
        detail: undefined,
        status: [
            { state: 'active', label: '2 running' },
            { state: 'failed', label: '2 failed' },
        ],
        width: 'lg',
        children: (
            <>
                <StatusPopoverSection title="Needs attention" count={2}>
                    <ProgressStatusRow
                        size="sm"
                        status="failed"
                        label="Documentaries"
                        operation="File scan"
                        statusLabel="Failed"
                        reason="Folder not found"
                        trailing={
                            <Button variant="secondary" size="sm">
                                Review
                            </Button>
                        }
                    />
                    <ProgressStatusRow
                        size="sm"
                        status="failed"
                        label="TV Shows"
                        operation="Metadata"
                        statusLabel="Failed"
                        reason="Lar couldn’t read “The Quiet Harbour/Season 01/The Quiet Harbour - S01E04 - Low Tide.mkv”."
                        trailing={
                            <Button variant="secondary" size="sm">
                                Review
                            </Button>
                        }
                    />
                </StatusPopoverSection>
                <StatusPopoverSection title="Current work" count={2}>
                    <ProgressStatusRow
                        size="sm"
                        status="running"
                        label="Vinyl Rips"
                        operation="Re-read file metadata · Finding files"
                        count="606 files found"
                        detail="127 new"
                        trailing={
                            <Button variant="secondary" size="sm">
                                Cancel
                            </Button>
                        }
                    />
                    <ProgressStatusRow
                        size="sm"
                        status="running"
                        label="Music"
                        operation="Metadata · Comparing with Lidarr"
                        count="7 of 12 albums"
                        progress={{ value: 7, max: 12 }}
                        trailing={
                            <Button variant="secondary" size="sm">
                                Cancel
                            </Button>
                        }
                    />
                </StatusPopoverSection>
            </>
        ),
    },
};
