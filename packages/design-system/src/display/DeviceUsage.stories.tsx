import type { Meta, StoryObj } from '@storybook/react-vite';

import { StatusIndicator } from '../feedback/StatusIndicator';
import { Grid } from '../layout/Flow';
import { DeviceCard } from '../media/DeviceCard';
import { Text } from '../typography/Typography';
import { DeviceUsage } from './DeviceUsage';
import { MeterLegend } from './StackedMeter';

/** lar-server's encode budget on a GPU: playback and a waiting download, room left at its limit. */
const busy = {
    value: '13%',
    valueLabel: 'in use',
    summary: 'Room for 6 more transcodes at 1080p or lower · limit 100%',
    meter: {
        label: '13% in use: playback 13%, download 0%, music 0%',
        segments: [
            { id: 'playback', label: 'Playback 13%', series: 1 as const, value: 0.13 },
            { id: 'download', label: 'Download 0%', series: 2 as const, value: 0 },
            { id: 'music', label: 'Music 0%', series: 3 as const, value: 0 },
        ],
    },
    items: [
        {
            id: 'a',
            series: 1 as const,
            label: 'Playback · 1080p and smaller transcode',
            detail: 'Running',
            value: '13%',
        },
        {
            id: 'b',
            series: 2 as const,
            label: 'Download · 4K HDR to 1080p (tone-mapped)',
            detail: 'Waiting #1',
            value: '50%',
        },
    ],
    emptyLabel: 'Idle',
};

const meta = {
    title: 'Display/DeviceUsage',
    component: DeviceUsage,
    args: busy,
    render: (args) => (
        <div className="max-w-md">
            <DeviceCard name="Intel UHD Graphics 770" detail="Intel Quick Sync · i915 · /dev/dri/renderD128">
                <DeviceUsage {...args} />
            </DeviceCard>
        </div>
    ),
} satisfies Meta<typeof DeviceUsage>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Busy: Story = {};

/** A limit under 100% stands as a dashed marker across the meter. */
export const WithLimit: Story = {
    args: {
        value: '3%',
        summary: 'Room for 2 more transcodes at 1080p or lower · limit 75%',
        meter: {
            label: '3% in use: music 3%; limit 75%',
            segments: [{ id: 'music', label: 'Music 3%', series: 3, value: 0.03 }],
            marker: { label: 'Limit 75%', value: 0.75 },
        },
        items: [{ id: 'm', series: 3, label: 'Music', detail: 'Running', value: '3%' }],
    },
};

export const Idle: Story = {
    args: {
        value: '0%',
        summary: 'Room for 8 more transcodes at 1080p or lower · limit 100%',
        meter: { label: 'Nothing in use', segments: [] },
        items: [],
    },
};

/** Before calibration has measured the device, the room left isn't known: the summary says so. */
export const NotCalibrated: Story = {
    args: {
        value: '0%',
        summary: 'Not measured yet · calibration runs after the first scan',
        meter: { label: 'Nothing in use', segments: [] },
        items: [],
    },
};

/** The dashboard's Encoding section: one card per device, the slim meter, an unavailable device outlined, and the key
 *  to the colours under them. */
export const DashboardGrid: Story = {
    render: () => (
        <div className="flex flex-col gap-3">
            <Grid variant="content">
                <DeviceCard name="Intel UHD Graphics 770" detail="Intel Quick Sync · i915">
                    <DeviceUsage {...busy} size="sm" />
                </DeviceCard>
                <DeviceCard name="CPU" detail="Intel Core i5-13500 · 20 threads">
                    <DeviceUsage
                        {...busy}
                        size="sm"
                        value="3%"
                        summary="Room for 2 more transcodes at 1080p or lower · limit 75%"
                        meter={{
                            label: '3% in use',
                            segments: [{ id: 'music', label: 'Music 3%', series: 3, value: 0.03 }],
                            marker: { label: 'Limit 75%', value: 0.75 },
                        }}
                        items={[{ id: 'm', series: 3, label: 'Music', detail: 'Running', value: '3%' }]}
                    />
                </DeviceCard>
                <DeviceCard
                    unavailable
                    name="NVIDIA GeForce GTX 1050"
                    detail="NVIDIA NVENC/NVDEC · PCI 0000:01:00.0"
                    badge={<StatusIndicator tone="warning" label="Unavailable" />}
                >
                    <Text variant="caption">The NVIDIA driver isn’t loaded in this container.</Text>
                </DeviceCard>
            </Grid>
            <MeterLegend
                label="Encode budget colours"
                items={[
                    { id: 'playback', series: 1, label: 'Playback' },
                    { id: 'download', series: 2, label: 'Download' },
                    { id: 'music', series: 3, label: 'Music' },
                ]}
            />
        </div>
    ),
};

/** At a phone's width: job lines stay one line each. */
export const Narrow: Story = {
    render: (args) => (
        <div className="w-90">
            <DeviceCard name="Intel UHD Graphics 770" detail="Intel Quick Sync · i915 · /dev/dri/renderD128">
                <DeviceUsage {...args} size="sm" />
            </DeviceCard>
        </div>
    ),
};
