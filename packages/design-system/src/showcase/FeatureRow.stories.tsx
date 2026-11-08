import type { Meta, StoryObj } from '@storybook/react-vite';
import { RouterIcon, ServerIcon, SmartphoneIcon } from 'lucide-react';

import albumDark from '../../.storybook/assets/album-dark.webp';
import albumLight from '../../.storybook/assets/album-light.webp';
import boardDark from '../../.storybook/assets/board-dark.webp';
import boardLight from '../../.storybook/assets/board-light.webp';
import usersDark from '../../.storybook/assets/users-dark.webp';
import usersLight from '../../.storybook/assets/users-light.webp';
import { BrowserFrame, AppWindow, Screenshot } from './Devices';
import { FeatureRow, FeatureRows, PointList } from './FeatureRow';
import { RouteDiagram } from './RouteDiagram';
import { AngledDevice } from './Stage';
import { ReadinessStatus } from './Status';

const meta = {
    title: 'Showcase/FeatureRow',
    component: FeatureRow,
    args: {
        eyebrow: 'The web app',
        title: 'Run the whole house from any browser.',
        children:
            'The server’s own web app is where you run it: add catalogs, invite people, choose what each person can see, and check what’s playing.',
        points: [
            'Invitations, roles and per-catalog access',
            'Devices you can see and revoke',
            'Now playing for everyone, with format and quality',
        ],
        media: (
            <AngledDevice angle="right">
                <BrowserFrame address="lar-server.local" aspect="1400 / 689">
                    <Screenshot
                        dark={usersDark}
                        light={usersLight}
                        alt="Lar Server’s users: everyone you invited, their access to each catalog and their sign-in."
                        width={1400}
                        height={689}
                    />
                </BrowserFrame>
            </AngledDevice>
        ),
    },
    argTypes: { media: { control: false }, badge: { control: false } },
    decorators: [
        (Story) => (
            <div className="max-w-page mx-auto px-5 py-10 sm:px-8">
                <Story />
            </div>
        ),
    ],
} satisfies Meta<typeof FeatureRow>;

export default meta;

type Story = StoryObj<typeof meta>;

/** Copy on one side, the product on a device on the other. */
export const Default: Story = {};

/** Media on the left, as rows alternate down a page. */
export const Reversed: Story = { args: { reverse: true } };

/** A status chip beside the eyebrow and the media given two-thirds of the row. */
export const WithBadge: Story = {
    args: {
        largeMedia: true,
        eyebrow: 'Lar Music',
        badge: <ReadinessStatus status="available">Working</ReadinessStatus>,
        title: 'Your music, the way you tagged it.',
        children: "Browse albums, artists and playlists built from your files' own tags.",
        points: [
            'Lossless at home, converted to fit the connection away, always with the format in view',
            'Downloads and an offline cache for when you’re away',
            'On iPhone, iPad and Mac, with Apple TV in development',
        ],
        media: (
            <BrowserFrame address="lar-server.local" aspect="1400 / 859" fade="right">
                <Screenshot dark={albumDark} light={albumLight} alt="An album in the Lar Server web app." />
            </BrowserFrame>
        ),
    },
};

/** Copy in two columns above media that spans the row, for a detailed screenshot. */
export const Wide: Story = {
    args: {
        wide: true,
        mediaWidth: 'full',
        eyebrow: 'The board',
        title: 'Everything waiting for you, in one place.',
        children:
            'Work is grouped by stage, and your desk sits on top: the questions agents need answered and the changes waiting for you to verify. Press Start and an agent picks an item up.',
        points: [
            'Live progress from every shaping and build thread',
            'Open pull requests followed as they change',
            'Usage totals for the work on the board',
        ],
        media: (
            <AppWindow>
                <Screenshot dark={boardDark} light={boardLight} alt="The Lar Factory board." />
            </AppWindow>
        ),
    },
};

/** A diagram instead of a screenshot. */
export const WithDiagram: Story = {
    args: {
        eyebrow: 'Remote access',
        title: 'Stream straight from home, with no relay in between.',
        children:
            'Use automatic router setup, forward a port by hand, or keep your VPN. Apps pin your server’s own certificate, so joining needs no domain.',
        points: [
            'Automatic router forwarding, or clear manual steps',
            'Works over the VPN or Tailscale you already use',
            'Invite people with a link, and revoke any device',
        ],
        media: (
            <RouteDiagram
                label="Encrypted and direct, end to end"
                caption="Lar runs no relay. Your media travels from your home to your device and nowhere else."
                nodes={[
                    { icon: <ServerIcon />, title: 'Your server', detail: 'At home' },
                    { icon: <RouterIcon />, title: 'Your router', detail: 'Passes it straight through' },
                    { icon: <SmartphoneIcon />, title: 'Your phone', detail: 'Anywhere' },
                ]}
            />
        ),
    },
};

/** Rows stacked with room between them. */
export const Rows: Story = {
    render: (args) => (
        <FeatureRows>
            <FeatureRow {...args} />
            <FeatureRow {...args} {...WithBadge.args} reverse />
        </FeatureRows>
    ),
};

/** The checked lines on their own. */
export const Points: Story = {
    render: (args) => <PointList points={args.points ?? []} />,
};
