import type { Meta, StoryObj } from '@storybook/react-vite';

import { MeterLegend, StackedMeter } from './StackedMeter';

const segments = [
    { id: 'movies', label: 'Movies 45%', tone: 'primary', value: 0.45 },
    { id: 'tv', label: 'TV 22%', tone: 'info', value: 0.22 },
    { id: 'music', label: 'Music 8%', tone: 'success', value: 0.08 },
    { id: 'photos', label: 'Photos 6%', tone: 'warning', value: 0.06 },
] as const;

const meta = {
    title: 'Display/StackedMeter',
    component: StackedMeter,
    args: { label: 'Media disk: 81% used, of which movies 45%, TV 22%, music 8%, photos 6%', segments },
    decorators: [
        (Story) => (
            <div className="max-w-lg">
                <Story />
            </div>
        ),
    ],
} satisfies Meta<typeof StackedMeter>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithMarker: Story = {
    args: {
        label: 'GPU encoder: 65% used, limit 80%',
        segments: [
            { id: 'playback', label: 'Playback 45%', tone: 'primary', value: 0.45 },
            { id: 'thumbnails', label: 'Thumbnails 20%', tone: 'info', value: 0.2 },
        ],
        marker: { label: 'Limit 80%', value: 0.8 },
    },
};

export const Empty: Story = { args: { label: 'Nothing stored yet', segments: [] } };

export const Full: Story = {
    args: { label: 'Disk full', segments: [{ id: 'all', label: 'Used 100%', tone: 'warning', value: 1 }] },
};

/** A meter with the legend for its tones. */
export const WithLegend: Story = {
    render: (args) => (
        <div className="flex flex-col gap-3">
            <StackedMeter {...args} />
            <MeterLegend label="Storage by kind" items={segments} />
        </div>
    ),
};
