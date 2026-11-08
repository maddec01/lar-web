import type { Meta, StoryObj } from '@storybook/react-vite';

import { StatusRow } from '../feedback/StatusRow';
import { LegendSwatch, MeterLegend, StackedMeter } from './StackedMeter';

const segments = [
    { id: 'movies', label: 'Movies 45%', series: 1, value: 0.45 },
    { id: 'tv', label: 'TV 22%', series: 2, value: 0.22 },
    { id: 'music', label: 'Music 8%', series: 3, value: 0.08 },
] as const;

const meta = {
    title: 'Display/StackedMeter',
    component: StackedMeter,
    args: { label: 'Media disk: 75% used, of which movies 45%, TV 22%, music 8%', segments },
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
            { id: 'playback', label: 'Playback 45%', series: 1, value: 0.45 },
            { id: 'thumbnails', label: 'Thumbnails 20%', series: 2, value: 0.2 },
        ],
        marker: { label: 'Limit 80%', value: 0.8 },
    },
};

export const Empty: Story = { args: { label: 'Nothing stored yet', segments: [] } };

export const Full: Story = {
    args: { label: 'Disk full', segments: [{ id: 'all', label: 'Used 100%', series: 1, value: 1 }] },
};

/** A meter with the legend for its series. */
export const WithLegend: Story = {
    render: (args) => (
        <div className="flex flex-col gap-3">
            <StackedMeter {...args} />
            <MeterLegend label="Storage by kind" items={segments} />
        </div>
    ),
};

/** A series' key is a square swatch; a status is a round light that only a state colours. A row that names a series
 *  and has a status (an encode device’s jobs) takes the swatch as its indicator and says the status in words. */
export const LegendSwatchVersusStatus: Story = {
    args: {
        label: 'GPU encoder: 65% used, of which playback 45%, downloads 20%',
        segments: [
            { id: 'playback', label: 'Playback 45%', series: 1, value: 0.45 },
            { id: 'download', label: 'Downloads 20%', series: 2, value: 0.2 },
        ],
    },
    render: (args) => (
        <div className="flex flex-col gap-3">
            <StackedMeter {...args} />
            <MeterLegend label="Encoder use by purpose" items={args.segments} />
            <div>
                <StatusRow
                    size="sm"
                    indicator={<LegendSwatch series={1} />}
                    label="Playback · 4K"
                    detail="Running"
                    value="45%"
                />
                <StatusRow
                    size="sm"
                    indicator={<LegendSwatch series={2} />}
                    label="Download · 1080p"
                    detail="Waiting #1"
                    value="20%"
                />
                <StatusRow size="sm" state="active" label="Lights are status: this one is running" />
            </div>
        </div>
    ),
};
