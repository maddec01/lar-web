import type { Meta, StoryObj } from '@storybook/react-vite';

import { StageTrack } from './StageTrack';
import { statusColor } from './StatusColors';
import { StatusGlyph } from './StatusGlyph';

const stages = ['Refining', 'Ready', 'Building', 'Review', 'Verify'];

const meta = {
    title: 'Board/StageTrack',
    component: StageTrack,
    decorators: [
        (Story) => (
            <div className="w-28">
                <Story />
            </div>
        ),
    ],
    args: {
        stages,
        at: 2,
        color: statusColor['In progress'],
        glyph: <StatusGlyph status="In progress" running />,
        title: 'Working',
    },
} satisfies Meta<typeof StageTrack>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Building: Story = {};

/** Waiting on other work: the stage faint and its glyph ringed dashed. */
export const Waiting: Story = {
    args: {
        at: 1,
        color: statusColor.Ready,
        glyph: <StatusGlyph status="Ready" />,
        title: 'Ready, waiting',
        waiting: true,
    },
};

/** Complete work shows its tick in place of the track. */
export const Complete: Story = { args: { complete: true, glyph: <StatusGlyph status="Done" />, title: 'Complete' } };
