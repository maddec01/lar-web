import type { Meta, StoryObj } from '@storybook/react-vite';
import { HouseIcon, LaptopIcon, RouterIcon, ServerIcon, ShieldCheckIcon, SmartphoneIcon } from 'lucide-react';

import { RouteDiagram } from './RouteDiagram';

const meta = {
    title: 'Showcase/RouteDiagram',
    component: RouteDiagram,
    args: {
        label: 'Encrypted and direct, end to end',
        caption: 'Lar runs no relay. Your media travels from your home to your device and nowhere else.',
        nodes: [
            { icon: <ServerIcon />, title: 'Your server', detail: 'At home' },
            { icon: <RouterIcon />, title: 'Your router', detail: 'Passes it straight through' },
            { icon: <SmartphoneIcon />, title: 'Your phone', detail: 'Anywhere' },
        ],
    },
    argTypes: { nodes: { control: false } },
    decorators: [
        (Story) => (
            <div className="mx-auto max-w-180">
                <Story />
            </div>
        ),
    ],
} satisfies Meta<typeof RouteDiagram>;

export default meta;

type Story = StoryObj<typeof meta>;

/** Remote access on Lar Server: a line of travelling light through every hop, horizontal on wide screens. */
export const Default: Story = {};

/** The same route over a VPN you already run. */
export const OverVpn: Story = {
    args: {
        label: 'Through your own VPN',
        caption:
            'Keep the VPN or Tailscale you already use. Apps pin the server’s own certificate, so no domain is needed.',
        nodes: [
            { icon: <HouseIcon />, title: 'Lar Server', detail: 'In the cupboard' },
            { icon: <ShieldCheckIcon />, title: 'Tailscale', detail: 'Your private network' },
            { icon: <LaptopIcon />, title: 'Your Mac', detail: 'On the road' },
        ],
    },
};
