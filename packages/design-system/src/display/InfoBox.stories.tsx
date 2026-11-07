import type { Meta, StoryObj } from '@storybook/react-vite';
import { HardDriveIcon, LightbulbIcon, SmartphoneIcon } from 'lucide-react';

import { InfoBox } from './InfoBox';

const meta = {
    title: 'Display/InfoBox',
    component: InfoBox,
    args: {
        icon: <LightbulbIcon />,
        title: 'How Lar organizes your media',
        description: 'Learn which folder layouts Lar recognizes, and how to name files so they match the right movie.',
        onClick: () => undefined,
    },
    decorators: [
        (Story) => (
            <div className="max-w-xl">
                <Story />
            </div>
        ),
    ],
} satisfies Meta<typeof InfoBox>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Devices: Story = {
    args: {
        icon: <SmartphoneIcon />,
        title: 'Connect your phone',
        description: 'Install the Lar app and scan the pairing code to stream and back up photos.',
    },
};

export const LongText: Story = {
    args: {
        icon: <HardDriveIcon />,
        title: 'Choosing storage for a library that will grow over many years without needing a migration',
        description:
            'Lar works with any folder the server can read: an internal disk, a USB drive or a network share. This guide compares them for speed, reliability and how they behave when a disk goes to sleep, and explains what happens to your library if a drive is disconnected while a scan is running.',
    },
};
