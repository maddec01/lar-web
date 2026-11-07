import type { Meta, StoryObj } from '@storybook/react-vite';
import { CodeIcon, DownloadIcon, MailIcon } from 'lucide-react';
import { fn } from 'storybook/test';

import boardDark from '../../.storybook/assets/board-dark.webp';
import boardLight from '../../.storybook/assets/board-light.webp';
import dashboardDark from '../../.storybook/assets/dashboard-dark.webp';
import dashboardLight from '../../.storybook/assets/dashboard-light.webp';
import deskDark from '../../.storybook/assets/desk-dark.webp';
import deskLight from '../../.storybook/assets/desk-light.webp';
import deskQueueDark from '../../.storybook/assets/desk-queue-dark.webp';
import deskQueueLight from '../../.storybook/assets/desk-queue-light.webp';
import factoryIcon from '../../.storybook/assets/factory.webp';
import musicPlayer from '../../.storybook/assets/music-player-ship.webp';
import serverIcon from '../../.storybook/assets/server.webp';
import { ButtonLink } from '../actions/ButtonLink';
import { InlineLink } from '../typography/Link';
import { AppWindow, BrowserFrame, Callout, LaptopFrame, PhoneFrame, Screenshot } from './Devices';
import { Hero } from './Hero';
import { ProductIndex } from './ProductBand';
import { DeviceStage } from './Stage';
import { Announcement, AppIcon, StatusPill } from './Status';

const navigate = fn();

const meta = {
    title: 'Showcase/Hero',
    component: Hero,
    parameters: { layout: 'fullscreen' },
    args: {
        announcement: (
            <Announcement href="/factory" tag="New" onNavigate={navigate}>
                Lar Factory is out for Mac
            </Announcement>
        ),
        title: 'Software that stays home.',
        lead: 'Lar makes software that runs on machines you own. Each product does one job well, and leaves the final word to you.',
        note: 'Lar is Portuguese for home.',
        visual: (
            <ProductIndex
                label="Lar products"
                onNavigate={navigate}
                products={[
                    {
                        name: 'Lar Factory',
                        icon: <AppIcon src={factoryIcon} alt="" size="sm" />,
                        status: <StatusPill status="available">Available for Mac</StatusPill>,
                        summary: 'Turn repository issues into reviewed pull requests.',
                        href: '/factory',
                    },
                    {
                        name: 'Lar Server',
                        icon: <AppIcon src={serverIcon} alt="" size="sm" />,
                        status: <StatusPill status="development">In development</StatusPill>,
                        summary: 'Stream your own music and films to native apps.',
                        href: '/server',
                    },
                ]}
            />
        ),
    },
    argTypes: {
        announcement: { control: false },
        actions: { control: false },
        visual: { control: false },
        hue: { control: { type: 'range', min: 0, max: 360 } },
    },
} satisfies Meta<typeof Hero>;

export default meta;

type Story = StoryObj<typeof meta>;

/** The home page: a statement over the brand glow, then the product family. */
export const Home: Story = {};

/** Lar Factory: download and source, then the board on a MacBook with a close-up floating in front. */
export const Factory: Story = {
    args: {
        announcement: (
            <Announcement href="https://github.com/maddec01/lar-factory" external tag="Open source">
                MIT licensed and on GitHub
            </Announcement>
        ),
        title: 'Your software factory, running on your Mac.',
        lead: "Lar Factory lets AI agents turn your issues and ideas into reviewed pull requests. Shape the work on a board, start a build when it's ready, and merge every pull request yourself.",
        actions: (
            <>
                <ButtonLink
                    href="https://github.com/maddec01/lar-factory/releases/latest"
                    external
                    icon={<DownloadIcon />}
                >
                    Download for Mac
                </ButtonLink>
                <ButtonLink
                    href="https://github.com/maddec01/lar-factory"
                    external
                    variant="secondary"
                    icon={<CodeIcon />}
                >
                    View source
                </ButtonLink>
            </>
        ),
        note: (
            <>
                Free and open source · Apple silicon · Requires <InlineLink href="https://t3.codes">T3 Code</InlineLink>{' '}
                to run agents
            </>
        ),
        visual: (
            <DeviceStage
                pitch={6}
                narrow="pair"
                narrowMain={
                    <AppWindow bezel>
                        <Screenshot dark={deskQueueDark} light={deskQueueLight} alt="The Lar Factory board." />
                    </AppWindow>
                }
                callout={
                    <Callout>
                        <Screenshot
                            dark={deskDark}
                            light={deskLight}
                            alt="A change waiting for you to verify on your desk in Lar Factory."
                            eager
                        />
                    </Callout>
                }
                main={
                    <LaptopFrame app="Lar Factory" menu={['File', 'Edit', 'View', 'Window', 'Help']} time="Fri 9:41">
                        <Screenshot
                            dark={boardDark}
                            light={boardLight}
                            alt="The Lar Factory board on a MacBook, with items in List, Shaping, Ready, Building and Ready to merge."
                            eager
                        />
                    </LaptopFrame>
                }
            />
        ),
    },
};

/** Lar Server: tinted with its hue, a title over three lines, and the web app with the phone in front. */
export const Server: Story = {
    args: {
        hue: 264,
        announcement: (
            <Announcement href="#progress" status="development" tag="In development">
                See what works
            </Announcement>
        ),
        title: 'Your media.\nYour server.\nEvery screen.',
        lead: 'Stream your music and films from your own server to native apps on your phone, tablet and computer. TV is next.',
        actions: (
            <>
                <ButtonLink href="#progress" arrow>
                    See progress
                </ButtonLink>
                <ButtonLink
                    href="mailto:dev@lar.works?subject=Lar%20Server%20launch"
                    variant="secondary"
                    icon={<MailIcon />}
                >
                    Notify me at launch
                </ButtonLink>
            </>
        ),
        note: 'Not released yet. The button opens your email app with a note asking for one launch email.',
        visual: (
            <DeviceStage
                pitch={4}
                narrow="end"
                main={
                    <BrowserFrame address="lar-server.local" aspect="1600 / 1040" fade="tail">
                        <Screenshot dark={dashboardDark} light={dashboardLight} alt="The Lar Server dashboard." eager />
                    </BrowserFrame>
                }
                end={
                    <PhoneFrame>
                        <Screenshot dark={musicPlayer} alt="Lar Music on iPhone, playing a symphony." eager />
                    </PhoneFrame>
                }
            />
        ),
    },
};

/** Just the words: a page without a visual closes with room below the lead. */
export const TextOnly: Story = {
    args: {
        announcement: undefined,
        title: "This page isn't home.",
        lead: 'The address may have changed, or it never existed. Everything Lar makes is one click away.',
        note: undefined,
        visual: undefined,
        actions: (
            <ButtonLink href="/" arrow onNavigate={navigate}>
                Go to the home page
            </ButtonLink>
        ),
    },
};
