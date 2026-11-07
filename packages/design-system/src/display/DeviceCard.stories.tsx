import type { Meta, StoryObj } from '@storybook/react-vite';

import { Select, SelectItem } from '../forms/Select';
import { Text } from '../typography/Typography';
import { Badge } from './Badge';
import { DeviceCard } from './DeviceCard';
import { StackedMeter } from './StackedMeter';

const meta = {
    title: 'Display/DeviceCard',
    component: DeviceCard,
    args: {
        name: 'NVIDIA GeForce RTX 3060',
        detail: '12 GB · Driver 550.54',
        badge: <Badge tone="success">Available</Badge>,
        children: (
            <StackedMeter
                label="Encoder load: 45% playback, 20% thumbnails"
                segments={[
                    { id: 'playback', label: 'Playback 45%', tone: 'primary', value: 0.45 },
                    { id: 'thumbnails', label: 'Thumbnails 20%', tone: 'info', value: 0.2 },
                ]}
                marker={{ label: 'Limit 80%', value: 0.8 }}
            />
        ),
        footer: (
            <Text variant="caption" tone="muted">
                Encoder: NVENC · HEVC, H.264, AV1
            </Text>
        ),
    },
    decorators: [
        (Story) => (
            <div className="max-w-md">
                <Story />
            </div>
        ),
    ],
} satisfies Meta<typeof DeviceCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithAction: Story = {
    args: {
        action: (
            <Select aria-label="Session limit" defaultValue="4">
                <SelectItem value="2">2 sessions</SelectItem>
                <SelectItem value="4">4 sessions</SelectItem>
                <SelectItem value="unlimited">Unlimited</SelectItem>
            </Select>
        ),
    },
};

export const Unavailable: Story = {
    args: {
        name: 'Intel UHD Graphics 630',
        detail: 'Detected, but the driver is missing',
        unavailable: true,
        badge: <Badge tone="warning">Unavailable</Badge>,
        children: (
            <Text tone="muted">Install the Intel media driver on the host to use Quick Sync for transcoding.</Text>
        ),
        footer: undefined,
    },
};

export const LongName: Story = {
    args: { name: 'Advanced Micro Devices, Inc. [AMD/ATI] Navi 23 [Radeon RX 6600/6600 XT/6600M] (rev c1)' },
};
