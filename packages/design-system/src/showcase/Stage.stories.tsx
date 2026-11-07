import type { Meta, StoryObj } from '@storybook/react-vite';

import albumDark from '../../.storybook/assets/album-dark.webp';
import albumLight from '../../.storybook/assets/album-light.webp';
import boardDark from '../../.storybook/assets/board-dark.webp';
import boardLight from '../../.storybook/assets/board-light.webp';
import dashboardDark from '../../.storybook/assets/dashboard-dark.webp';
import dashboardLight from '../../.storybook/assets/dashboard-light.webp';
import deskDark from '../../.storybook/assets/desk-dark.webp';
import deskLight from '../../.storybook/assets/desk-light.webp';
import deskQueueDark from '../../.storybook/assets/desk-queue-dark.webp';
import deskQueueLight from '../../.storybook/assets/desk-queue-light.webp';
import moviesDark from '../../.storybook/assets/movies-dark.webp';
import musicPlayer from '../../.storybook/assets/music-player-ship.webp';
import usersDark from '../../.storybook/assets/users-dark.webp';
import usersLight from '../../.storybook/assets/users-light.webp';
import { Heading, Text } from '../typography/Typography';
import { AppWindow, BrowserFrame, Callout, LaptopFrame, PhoneFrame, Screenshot, TvFrame } from './Devices';
import { AngledDevice, Backdrop, DeviceStage, ResponsiveMedia, Reveal } from './Stage';

const phone = (
    <PhoneFrame>
        <Screenshot dark={musicPlayer} alt="Lar Music on iPhone, playing a symphony." />
    </PhoneFrame>
);

const meta = {
    title: 'Showcase/Stage',
    component: DeviceStage,
    parameters: { layout: 'fullscreen' },
    args: {
        pitch: 4,
        main: (
            <BrowserFrame address="lar-server.local" aspect="1400 / 859">
                <Screenshot dark={albumDark} light={albumLight} alt="An album in the Lar Server web app." />
            </BrowserFrame>
        ),
        end: phone,
    },
    argTypes: {
        main: { control: false },
        end: { control: false },
        start: { control: false },
        callout: { control: false },
        narrowMain: { control: false },
        pitch: { control: { type: 'range', min: 0, max: 12 } },
    },
    decorators: [
        (Story) => (
            <div className="mx-auto max-w-[1200px] px-5 py-12 sm:px-8 sm:pb-28">
                <Story />
            </div>
        ),
    ],
} satisfies Meta<typeof DeviceStage>;

export default meta;

type Story = StoryObj<typeof meta>;

/** The web app with the phone in front at the lower right. The scene leans gently toward the pointer. */
export const Default: Story = {};

/** A device at the lower left too: a TV beside the web app. */
export const WithStartDevice: Story = {
    args: {
        start: (
            <TvFrame>
                <Screenshot dark={moviesDark} alt="Films in Lar Video on a TV." />
            </TvFrame>
        ),
    },
};

/** The Factory hero: a MacBook with a close-up floating across the lower left. Phones see a close-up pair. */
export const WithCallout: Story = {
    args: {
        pitch: 6,
        end: undefined,
        narrow: 'pair',
        narrowMain: (
            <AppWindow bezel>
                <Screenshot dark={deskQueueDark} light={deskQueueLight} alt="The Lar Factory board." />
            </AppWindow>
        ),
        callout: (
            <Callout>
                <Screenshot dark={deskDark} light={deskLight} alt="A change waiting for you to verify." />
            </Callout>
        ),
        main: (
            <LaptopFrame app="Lar Factory" menu={['File', 'Edit', 'View', 'Window', 'Help']} time="Fri 9:41">
                <Screenshot dark={boardDark} light={boardLight} alt="The Lar Factory board on a MacBook." />
            </LaptopFrame>
        ),
    },
};

/** When the phone is the point: a large end device beside the browser, here on the left. */
export const LargeEndOnLeft: Story = {
    args: {
        pitch: 0,
        endSize: 'large',
        endSide: 'left',
        main: (
            <BrowserFrame address="lar-server.local" aspect="1600 / 1040" fade="tail">
                <Screenshot dark={dashboardDark} light={dashboardLight} alt="The Lar Server dashboard." />
            </BrowserFrame>
        ),
    },
};

/** On a phone-width screen only the phone shows, where the laptop's text would be too small to read. */
export const NarrowShowsEnd: Story = {
    args: { narrow: 'end' },
    globals: { viewport: { value: 'mobile1' } },
};

/** One device turned in space, for a feature row, in each of its angles. */
export const Angles: Story = {
    render: () => (
        <div className="grid gap-12 sm:grid-cols-2">
            {(['left', 'right', 'lean', 'tilt', 'flat'] as const).map((angle) => (
                <div key={angle} className="flex flex-col gap-3">
                    <Text as="span" variant="caption" tone="muted">
                        {angle}
                    </Text>
                    <AngledDevice angle={angle}>
                        <BrowserFrame address="lar-server.local" aspect="1400 / 689">
                            <Screenshot dark={usersDark} light={usersLight} alt="Lar Server's users." />
                        </BrowserFrame>
                    </AngledDevice>
                </div>
            ))}
        </div>
    ),
};

/** The navy glow and fading grid behind a hero, and the same tinted with Lar Server's hue. */
export const Backdrops: Story = {
    render: () => (
        <div className="grid sm:grid-cols-2">
            {[undefined, 264, 70].map((hue) => (
                <section key={hue ?? 'brand'} className="relative isolate flex h-80 items-center justify-center">
                    <Backdrop hue={hue} />
                    <Heading as="h2" variant="headline">
                        {hue === undefined ? 'Brand' : `Hue ${hue}`}
                    </Heading>
                </section>
            ))}
        </div>
    ),
};

/** Content that fades and lifts into place as it scrolls into view. */
export const RevealOnScroll: Story = {
    render: () => (
        <div className="flex flex-col gap-[60vh] pb-[40vh]">
            <Text tone="muted">Scroll down.</Text>
            <Reveal>
                <Heading as="h2" variant="headline">
                    Bring it home.
                </Heading>
            </Reveal>
        </div>
    ),
};

/** The full composition on wider screens, a readable close-up on phones. */
export const Responsive: Story = {
    render: () => (
        <ResponsiveMedia
            wide={
                <AppWindow>
                    <Screenshot dark={boardDark} light={boardLight} alt="The Lar Factory board." />
                </AppWindow>
            }
            narrow={
                <Callout fade>
                    <Screenshot dark={deskQueueDark} light={deskQueueLight} alt="The queue in Lar Factory." />
                </Callout>
            }
        />
    ),
};
