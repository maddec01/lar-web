import type { Meta, StoryObj } from '@storybook/react-vite';

import { SegmentedProgress } from './SegmentedProgress';

const stages = ['Queue', 'Shaping', 'Ready', 'Build', 'Review'];

const meta = {
    title: 'Feedback/SegmentedProgress',
    component: SegmentedProgress,
    args: {
        label: 'Stage 4 of 5: Build',
        current: 3,
        segments: stages.map((name, index) => ({
            label: name,
            state: index < 3 ? 'ready' : index === 3 ? 'active' : undefined,
            pulse: index === 3,
        })),
    },
    decorators: [
        (Story) => (
            <div className="max-w-sm">
                <Story />
            </div>
        ),
    ],
} satisfies Meta<typeof SegmentedProgress>;

export default meta;

type Story = StoryObj<typeof meta>;

/** A workflow's stages: past ones done, the current one at work (breathing), the rest ahead. */
export const Stages: Story = {};

/** The current stage hasn't begun: outlined, never filled. */
export const Waiting: Story = {
    args: {
        segments: stages.map((name, index) => ({
            label: name,
            state: index < 3 ? 'ready' : index === 3 ? 'waiting' : undefined,
            waiting: index === 3,
        })),
    },
};

/** A piece of work's slices, one segment each in its state's colour. */
export const Slices: Story = {
    args: {
        label: 'Slices: 2 of 5 done',
        current: undefined,
        segments: [
            { label: 'Slice 1: done', state: 'ready' },
            { label: 'Slice 2: done', state: 'ready' },
            { label: 'Slice 3: working', state: 'active', pulse: true },
            { label: 'Slice 4: blocked', state: 'waiting' },
            { label: 'Slice 5: queued', state: 'off' },
        ],
    },
};

/** One bar split into parts, a hairline apart, the current part half done: a row's stage track. */
export const Joined: Story = {
    args: {
        layout: 'joined',
        size: 'sm',
        segments: stages.map((name, index) => ({
            label: name,
            state: index < 3 ? 'ready' : index === 3 ? 'active' : undefined,
            value: index === 3 ? 0.5 : undefined,
        })),
    },
};

/** An activity of unknown length: one segment, swept. */
export const Sweep: Story = {
    args: {
        label: 'Agent working',
        current: undefined,
        segments: [{ label: 'Working', state: 'active', sweep: true }],
    },
};
