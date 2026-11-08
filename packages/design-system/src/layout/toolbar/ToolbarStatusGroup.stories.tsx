import type { Meta, StoryObj } from '@storybook/react-vite';
import { ActivityIcon, HeadphonesIcon, ServerIcon } from 'lucide-react';

import { Button } from '../../actions/Button';
import { ToolbarStatusGroup } from './ToolbarStatusGroup';
import { ToolbarStatusItem } from './ToolbarStatusItem';

const meta = {
    title: 'Layout/ToolbarStatusGroup',
    component: ToolbarStatusGroup,
    args: {
        role: 'group',
        'aria-label': 'Server online, 2 background tasks, 1 playing',
        children: (
            <>
                <Button variant="summary" aria-label="Background tasks: 2 running">
                    <ToolbarStatusItem icon={<ActivityIcon />} tone="info" />
                </Button>
                <Button variant="summary" aria-label="Playback: 1 stream">
                    <ToolbarStatusItem icon={<HeadphonesIcon />} tone="success" />
                </Button>
                <Button variant="summary" aria-label="Server: healthy">
                    <ToolbarStatusItem icon={<ServerIcon />} tone="success" />
                </Button>
            </>
        ),
    },
    argTypes: { children: { control: false } },
} satisfies Meta<typeof ToolbarStatusGroup>;

export default meta;

type Story = StoryObj<typeof meta>;

/** The title bar’s status summary: background tasks, playback and the server, each opening its own popover. */
export const Default: Story = {};

/** Something needs attention: a scan failed and the server can’t be reached from outside. */
export const NeedsAttention: Story = {
    args: {
        'aria-label': 'Server online, remote access unreachable, 1 failed task',
        children: (
            <>
                <Button variant="summary" aria-label="Background tasks: 1 failed">
                    <ToolbarStatusItem icon={<ActivityIcon />} tone="danger" />
                </Button>
                <Button variant="summary" aria-label="Playback: nothing playing">
                    <ToolbarStatusItem icon={<HeadphonesIcon />} />
                </Button>
                <Button variant="summary" aria-label="Server: remote access unreachable">
                    <ToolbarStatusItem icon={<ServerIcon />} tone="warning" />
                </Button>
            </>
        ),
    },
};

/** A quiet server: nothing running and nothing playing, so those icons are quiet (no light) at the same size as the
 *  server's lit one. */
export const Quiet: Story = {
    args: {
        'aria-label': 'Server online, no background tasks, nothing playing',
        children: (
            <>
                <Button variant="summary" aria-label="Background tasks: none running">
                    <ToolbarStatusItem icon={<ActivityIcon />} />
                </Button>
                <Button variant="summary" aria-label="Playback: nothing playing">
                    <ToolbarStatusItem icon={<HeadphonesIcon />} />
                </Button>
                <Button variant="summary" aria-label="Server: healthy">
                    <ToolbarStatusItem icon={<ServerIcon />} state="ready" />
                </Button>
            </>
        ),
    },
};
