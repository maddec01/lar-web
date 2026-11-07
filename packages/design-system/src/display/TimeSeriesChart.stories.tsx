import type { Meta, StoryObj } from '@storybook/react-vite';

import { TimeSeriesChart, TimeSeriesChartSkeleton, type TimeSeriesPoint } from './TimeSeriesChart';

// A fixed start, so the stories render the same everywhere.
const start = Date.UTC(2026, 10, 7, 20, 0, 0);

const series = (count: number, sample: (index: number) => Omit<TimeSeriesPoint, 'timestamp'>) =>
    Array.from({ length: count }, (_, index) => ({ timestamp: start + index * 5_000, ...sample(index) }));

const cpu = series(60, (index) => ({
    host: 32 + Math.round(18 * Math.sin(index / 6) + (index % 7) * 2),
    lar: 12 + Math.round(10 * Math.sin(index / 4) + (index % 5)),
}));

const percent = (value: number) => `${Math.round(value)}%`;

const meta = {
    title: 'Display/TimeSeriesChart',
    component: TimeSeriesChart,
    args: {
        label: 'CPU',
        larLabel: 'Lar',
        hostLabel: 'Host',
        unavailableLabel: 'Not measured',
        points: cpu,
        formatValue: percent,
        maximum: 100,
    },
    decorators: [
        (Story) => (
            <div className="max-w-xl">
                <Story />
            </div>
        ),
    ],
} satisfies Meta<typeof TimeSeriesChart>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Cpu: Story = {};

/** Without a maximum the scale fits the highest sample. */
export const Memory: Story = {
    args: {
        label: 'Memory',
        maximum: undefined,
        points: series(60, (index) => ({ host: 9.2 + (index % 10) * 0.05, lar: 1.4 + index * 0.01 })),
        formatValue: (value) => `${value.toFixed(1)} GB`,
    },
};

/** Missed samples leave gaps in the line. */
export const WithGaps: Story = {
    args: {
        points: cpu.map((point, index) =>
            index >= 20 && index < 28
                ? { ...point, lar: null, host: null }
                : index % 13 === 0
                  ? { ...point, lar: null }
                  : point,
        ),
    },
};

/** Only the host is measured, for example while Lar runs in a container without its own counters. */
export const HostOnly: Story = { args: { points: cpu.map((point) => ({ ...point, lar: null })) } };

export const SingleSample: Story = { args: { points: cpu.slice(0, 1) } };

export const Loading: Story = { render: () => <TimeSeriesChartSkeleton /> };
