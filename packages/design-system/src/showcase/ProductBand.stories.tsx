import type { Meta, StoryObj } from '@storybook/react-vite';
import { DownloadIcon } from 'lucide-react';
import { fn } from 'storybook/test';

import boardDark from '../../.storybook/assets/board-dark.webp';
import boardLight from '../../.storybook/assets/board-light.webp';
import dashboardDark from '../../.storybook/assets/dashboard-dark.webp';
import dashboardLight from '../../.storybook/assets/dashboard-light.webp';
import deskQueueDark from '../../.storybook/assets/desk-queue-dark.webp';
import deskQueueLight from '../../.storybook/assets/desk-queue-light.webp';
import factoryIcon from '../../.storybook/assets/factory.webp';
import musicPlayer from '../../.storybook/assets/music-player-ship.webp';
import serverIcon from '../../.storybook/assets/server.webp';
import { ButtonLink } from '../actions/ButtonLink';
import { AppWindow, BrowserFrame, Callout, PhoneFrame, Screenshot } from './Devices';
import { ProductBand, ProductBands, ProductIndex } from './ProductBand';
import { DeviceStage, ResponsiveMedia } from './Stage';
import { AppIcon, ReadinessStatus } from './Status';

const navigate = fn();

const meta = {
    title: 'Showcase/ProductBand',
    component: ProductBand,
    args: {
        hue: 70,
        chroma: 0.09,
        icon: <AppIcon src={factoryIcon} alt="" size="sm" />,
        name: 'Lar Factory',
        status: <ReadinessStatus status="available">Available for Mac</ReadinessStatus>,
        title: 'Turn issues into reviewed pull requests.',
        description:
            'Shape ideas on a board. Let agents build them in isolated worktrees. Review and merge every pull request yourself.',
        note: 'Free · Apple silicon · Requires T3 Code',
        actions: (
            <>
                <ButtonLink
                    href="https://github.com/maddec01/lar-factory/releases/latest"
                    external
                    icon={<DownloadIcon />}
                >
                    Download for Mac
                </ButtonLink>
                <ButtonLink href="/factory" variant="quiet" arrow onNavigate={navigate}>
                    How it works
                </ButtonLink>
            </>
        ),
        media: (
            <ResponsiveMedia
                wide={
                    <AppWindow>
                        <Screenshot
                            dark={boardDark}
                            light={boardLight}
                            alt="The Lar Factory board: your desk, the queue and the work being shaped."
                            width={2400}
                            height={1500}
                        />
                    </AppWindow>
                }
                narrow={
                    <Callout fade>
                        <Screenshot
                            dark={deskQueueDark}
                            light={deskQueueLight}
                            alt="The Lar Factory board: your desk, the queue and the work being shaped."
                            width={1400}
                            height={897}
                        />
                    </Callout>
                }
            />
        ),
    },
    argTypes: {
        icon: { control: false },
        status: { control: false },
        actions: { control: false },
        media: { control: false },
        hue: { control: { type: 'range', min: 0, max: 360 } },
    },
    decorators: [
        (Story) => (
            <div className="max-w-page mx-auto">
                <Story />
            </div>
        ),
    ],
} satisfies Meta<typeof ProductBand>;

export default meta;

type Story = StoryObj<typeof meta>;

/** Lar Factory’s band: its warm hue, the board, and a download. */
export const Factory: Story = {};

/** Lar Server’s band, media on the left: the web app with the phone standing in front. */
export const Server: Story = {
    args: {
        reverse: true,
        hue: 264,
        chroma: undefined,
        icon: <AppIcon src={serverIcon} alt="" size="sm" />,
        name: 'Lar Server',
        status: <ReadinessStatus status="development">In development</ReadinessStatus>,
        title: 'Your music and films, on every screen.',
        description:
            'Indexed on a server you own and streamed to native apps on your phone, tablet and computer, with the TV next.',
        note: undefined,
        actions: (
            <ButtonLink href="/server" arrow onNavigate={navigate}>
                See Lar Server
            </ButtonLink>
        ),
        media: (
            <DeviceStage
                endSize="lg"
                main={
                    <BrowserFrame address="lar-server.local" aspect="1600 / 1040" fade="tail">
                        <Screenshot dark={dashboardDark} light={dashboardLight} alt="The Lar Server dashboard." />
                    </BrowserFrame>
                }
                end={
                    <PhoneFrame>
                        <Screenshot dark={musicPlayer} alt="Lar Music on iPhone, playing a symphony." />
                    </PhoneFrame>
                }
            />
        ),
    },
};

/** Both bands one after another, as on the home page. */
export const Bands: Story = {
    render: (args) => (
        <ProductBands>
            <ProductBand {...args} />
            <ProductBand {...args} {...Server.args} />
        </ProductBands>
    ),
};

/** The compact product family under the home hero. */
export const Index: Story = {
    render: () => (
        <ProductIndex
            label="Lar products"
            onNavigate={navigate}
            products={[
                {
                    name: 'Lar Factory',
                    icon: <AppIcon src={factoryIcon} alt="" size="sm" />,
                    status: <ReadinessStatus status="available">Available for Mac</ReadinessStatus>,
                    summary: 'Turn repository issues into reviewed pull requests.',
                    href: '/factory',
                },
                {
                    name: 'Lar Server',
                    icon: <AppIcon src={serverIcon} alt="" size="sm" />,
                    status: <ReadinessStatus status="development">In development</ReadinessStatus>,
                    summary: 'Stream your own music and films to native apps.',
                    href: '/server',
                },
            ]}
        />
    ),
};
