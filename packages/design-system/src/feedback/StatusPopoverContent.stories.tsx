import type { Meta, StoryObj } from '@storybook/react-vite';
import { HardDriveIcon } from 'lucide-react';

import { Button } from '../actions/Button';
import { Popover } from '../overlays/Popover';
import { ProgressStatusRow } from './ProgressStatusRow';
import { StatusIndicator } from './StatusIndicator';
import { StatusPopoverContent } from './StatusPopoverContent';
import { StatusRow } from './StatusRow';

/** The body of a status popover, such as the server status in Lar's header. It renders inside a `Popover`. */
const meta = {
    title: 'Feedback/StatusPopoverContent',
    component: StatusPopoverContent,
    args: {
        title: 'Lar Server',
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
                    <Button variant="status" leftIcon={<StatusIndicator tone={args.tone} />}>
                        {args.status}
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
                <StatusRow compact tone="success" label="Database" value="Healthy" />
                <StatusRow compact tone="success" label="Transcoder" value="Idle" />
                <StatusRow
                    compact
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
                <StatusRow compact tone="success" label="Database" value="Healthy" />
                <StatusRow compact tone="danger" label="/mnt/media/tv" detail="Drive not mounted" value="Offline" />
            </>
        ),
    },
};
