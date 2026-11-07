import type { Meta, StoryObj } from '@storybook/react-vite';
import { GlobeIcon, LaptopIcon, MonitorSmartphoneIcon, SmartphoneIcon, TabletIcon, TvIcon } from 'lucide-react';

import { PlatformGrid } from './Platforms';

const meta = {
    title: 'Showcase/Platforms',
    component: PlatformGrid,
    args: {
        label: 'Platforms',
        platforms: [
            {
                name: 'Web',
                detail: 'Set up and run the server from any browser.',
                icon: <GlobeIcon />,
                status: 'available',
                statusLabel: 'Working',
            },
            {
                name: 'iPhone and iPad',
                detail: 'Video in development.',
                icon: <SmartphoneIcon />,
                status: 'available',
                statusLabel: 'Music working',
            },
            {
                name: 'Mac',
                detail: 'Video in development.',
                icon: <LaptopIcon />,
                status: 'available',
                statusLabel: 'Music working',
            },
            {
                name: 'Apple TV & Watch',
                detail: 'Music and Video, plus Watch and CarPlay for music.',
                icon: <TvIcon />,
                status: 'development',
                statusLabel: 'In development',
            },
        ],
    },
    decorators: [
        (Story) => (
            <div className="mx-auto max-w-[1200px]">
                <Story />
            </div>
        ),
    ],
} satisfies Meta<typeof PlatformGrid>;

export default meta;

type Story = StoryObj<typeof meta>;

/** Every screen Lar Server reaches: cards on wide screens, compact rows on phones. */
export const Default: Story = {};

/** Planned platforms take a dashed, unfilled card. */
export const WithPlanned: Story = {
    args: {
        platforms: [
            ...meta.args.platforms,
            {
                name: 'Android',
                detail: 'Phones and tablets.',
                icon: <TabletIcon />,
                status: 'planned',
                statusLabel: 'Planned',
            },
            {
                name: 'Google TV',
                detail: 'A living-room app for your TV.',
                icon: <MonitorSmartphoneIcon />,
                status: 'planned',
                statusLabel: 'Planned',
            },
        ],
    },
};
