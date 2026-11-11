import type { Meta, StoryObj } from '@storybook/react-vite';
import { CircleDashedIcon, EyeIcon, HammerIcon } from 'lucide-react';

import { Button } from '../actions/Button';
import { StatusIndicator } from '../feedback/StatusIndicator';
import { Panel } from './Panel';

const rows = [
    'Fix the importer’s date parsing',
    'Add a shuffle mode to playlists',
    'Show the scan queue on the dashboard',
];

function Row({ title, state }: { title: string; state?: 'active' | 'waiting' | 'off' }) {
    return (
        <li className="flex h-10 min-w-0 items-center gap-2 px-3 text-sm">
            <span className="min-w-0 flex-1 truncate">{title}</span>
            {state ? <StatusIndicator state={state} label={state === 'active' ? 'Building' : 'Queued'} /> : null}
        </li>
    );
}

const meta = {
    title: 'Display/Panel',
    component: Panel,
    args: {
        title: 'Build',
        icon: <StatusIndicator state="active" glyph={<HammerIcon strokeWidth={2.25} />} />,
        count: 3,
        countLabel: '3 items',
        action: (
            <Button variant="quiet" size="sm">
                Limit 2
            </Button>
        ),
        children: (
            <ol className="m-0 list-none p-0">
                {rows.map((title, index) => (
                    <Row key={title} title={title} state={index === 0 ? 'active' : 'off'} />
                ))}
            </ol>
        ),
    },
    decorators: [
        (Story) => (
            <div className="max-w-xl">
                <Story />
            </div>
        ),
    ],
} satisfies Meta<typeof Panel>;

export default meta;

type Story = StoryObj<typeof meta>;

/** A titled group of rows: its status glyph, title, count and action, then the rows under hairlines. */
export const Default: Story = {};

/** A group of things that need the reader: the count in the attention pill. */
export const NeedsYou: Story = {
    args: {
        title: 'Needs you',
        icon: <StatusIndicator state="waiting" />,
        count: 2,
        countTone: 'warning',
        action: undefined,
    },
};

/** Nothing in it: one muted line under the header. */
export const Empty: Story = {
    args: {
        title: 'Review',
        icon: <StatusIndicator state="off" glyph={<EyeIcon strokeWidth={2.25} />} />,
        count: 0,
        children: undefined,
        empty: 'Nothing waits for review.',
        action: undefined,
    },
};

/** Folded to its header, as an empty lane collapses to its header line. */
export const Collapsed: Story = {
    args: {
        title: 'Shaping',
        icon: <StatusIndicator state="off" glyph={<CircleDashedIcon strokeWidth={2.25} />} />,
        count: 0,
        children: undefined,
        collapsed: true,
        action: undefined,
    },
};

/** Lanes stacked, as a board's stages. */
export const Stack: Story = {
    render: () => (
        <div className="flex flex-col gap-3">
            <Panel {...meta.args} {...NeedsYou.args} title="Needs you" />
            <Panel {...meta.args} />
            <Panel {...meta.args} {...Empty.args} title="Review" />
            <Panel {...meta.args} {...Collapsed.args} title="Shaping" />
        </div>
    ),
};
