import type { Meta, StoryObj } from '@storybook/react-vite';

import { ActivityLabel, ActivityTrack } from './ActivityTrack';

const meta = {
    title: 'Board/ActivityTrack',
    component: ActivityTrack,
    decorators: [
        (Story) => (
            <div className="w-40">
                <Story />
            </div>
        ),
    ],
    args: { label: 'Working', running: true },
} satisfies Meta<typeof ActivityTrack>;

export default meta;

type Story = StoryObj<typeof meta>;

/** A bar sweeps the track while the work runs. */
export const Running: Story = {};

export const Idle: Story = { args: { label: 'Run finished', running: false } };

export const Label: Story = { render: () => <ActivityLabel>Starting</ActivityLabel> };
