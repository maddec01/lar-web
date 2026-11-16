import type { Meta, StoryObj } from '@storybook/react-vite';

import { TickMeter } from './TickMeter';

const slices = (states: ('ready' | 'active' | undefined)[]) =>
    states.map((state, index) => ({
        label: `Slice ${index + 1}: ${state === 'ready' ? 'done' : state === 'active' ? 'working' : 'to do'}`,
        state,
        pulse: state === 'active',
    }));

const meta = {
    title: 'Feedback/TickMeter',
    component: TickMeter,
    args: {
        label: 'Slices, 2 of 5 done',
        segments: slices(['ready', 'ready', 'active', undefined, undefined]),
    },
    decorators: [
        (Story) => (
            // 37 ticks exactly (37 × 7px − 3px), so they space evenly.
            <div style={{ width: 256 }}>
                <Story />
            </div>
        ),
    ],
} satisfies Meta<typeof TickMeter>;

export default meta;

type Story = StoryObj<typeof meta>;

/** A piece of work's slices: done lit, the one at work breathing at its front, the rest ahead bare. */
export const Slices: Story = {};

/** Everything done: neighbours that look alike merge, so the meter reads as one done run. */
export const Done: Story = {
    args: { label: 'Slices, 3 of 3 done', segments: slices(['ready', 'ready', 'ready']) },
};

/** A scan of known size, lit as far as it has come, its front tick breathing while it runs. */
export const Scan: Story = {
    args: { label: 'Albums, 58%', segments: [{ label: 'Albums', state: 'active', value: 0.58, pulse: true }] },
};

/** Work of unknown size: a light travels along the ticks in its state's colour. */
export const Sweep: Story = {
    args: { label: 'Implementing', segments: [{ label: 'Implementing', state: 'active', sweep: true }] },
};

/** Work paused on you: the same sweep, in the waiting colour. */
export const WaitingSweep: Story = {
    args: { label: 'Waiting on you', segments: [{ label: 'Waiting', state: 'waiting', sweep: true }] },
};

/** Checks: shares by weight, failed in red, running at work, the rest still to report. */
export const Checks: Story = {
    args: {
        label: '6 of 10 checks passed, 1 failed, 2 running',
        segments: [
            { label: 'Passed', state: 'ready', weight: 6 },
            { label: 'Failed', state: 'failed', weight: 1 },
            { label: 'Running', state: 'active', weight: 2, pulse: true },
            { label: 'Not reported', weight: 1 },
        ],
    },
};

/** Shares in their own colours, with a limit marked where the meter stops being safe. */
export const SharesWithMarker: Story = {
    args: {
        label: 'Encoder: 40% playback, 20% downloads, limit 80%',
        marker: 0.8,
        segments: [
            { label: 'Playback', color: 'var(--color-info)', weight: 0.4 },
            { label: 'Downloads', color: 'var(--color-success)', weight: 0.2 },
            { label: 'Free', weight: 0.4 },
        ],
    },
};

/** Every size: `sm` on a row or a card, `md` in a lane or a popover, `lg` in a dialog. */
export const Sizes: Story = {
    render: (args) => (
        <div className="grid gap-3">
            <TickMeter {...args} size="sm" />
            <TickMeter {...args} size="md" />
            <TickMeter {...args} size="lg" />
        </div>
    ),
};
