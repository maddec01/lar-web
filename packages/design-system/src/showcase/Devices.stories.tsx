import type { Meta, StoryObj } from '@storybook/react-vite';

import albumDark from '../../.storybook/assets/album-dark.webp';
import albumLight from '../../.storybook/assets/album-light.webp';
import albumsDark from '../../.storybook/assets/albums-dark.webp';
import albumsLight from '../../.storybook/assets/albums-light.webp';
import boardDark from '../../.storybook/assets/board-dark.webp';
import boardLight from '../../.storybook/assets/board-light.webp';
import buildNarrowDark from '../../.storybook/assets/build-narrow-dark.webp';
import buildNarrowLight from '../../.storybook/assets/build-narrow-light.webp';
import conceptMapDark from '../../.storybook/assets/concept-map-dark.webp';
import conceptMapLight from '../../.storybook/assets/concept-map-light.webp';
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
import {
    AppWindow,
    BrowserFrame,
    Callout,
    CalloutPair,
    CalloutStack,
    GuidedMedia,
    LaptopFrame,
    PhoneFrame,
    Screenshot,
    TabletFrame,
    TvFrame,
} from './Devices';

const meta = {
    title: 'Showcase/Devices',
    component: BrowserFrame,
    args: {
        address: 'lar-server.local',
        aspect: '1600 / 1040',
        children: (
            <Screenshot
                dark={dashboardDark}
                light={dashboardLight}
                alt="The Lar Server dashboard: catalogs, the machine’s resources and who’s listening right now."
            />
        ),
    },
    argTypes: { children: { control: false } },
    decorators: [
        (Story) => (
            <div className="mx-auto max-w-225 p-6">
                <Story />
            </div>
        ),
    ],
} satisfies Meta<typeof BrowserFrame>;

export default meta;

type Story = StoryObj<typeof meta>;

/** A Safari-style window around the server’s web app. The screenshot follows the page’s theme. */
export const Browser: Story = {};

/** A dark-only capture in a dark window, its lower edge fading under the page. */
export const BrowserDark: Story = {
    args: {
        aspect: '1400 / 605',
        scheme: 'dark',
        fade: 'under',
        children: <Screenshot dark={moviesDark} alt="Films in the Lar Server web app." />,
    },
};

/** A cropped capture whose right edge dissolves. */
export const BrowserFadeRight: Story = {
    args: {
        aspect: '1400 / 859',
        fade: 'right',
        children: <Screenshot dark={albumDark} light={albumLight} alt="An album in the Lar Server web app." />,
    },
};

/** A MacBook Pro with the Lar mark in its menu bar. */
export const Laptop: Story = {
    render: () => (
        <LaptopFrame app="Lar Factory" menu={['File', 'Edit', 'View', 'Window', 'Help']} time="Fri 9:41">
            <Screenshot
                dark={boardDark}
                light={boardLight}
                alt="The Lar Factory board, with items in List, Shaping, Ready, Building and Ready to merge."
            />
        </LaptopFrame>
    ),
};

/** An iPhone Pro, for an iOS capture at 1206 × 2622. */
export const Phone: Story = {
    render: () => (
        <div className="mx-auto w-65">
            <PhoneFrame>
                <Screenshot dark={musicPlayer} alt="Lar Music on iPhone, playing a symphony." />
            </PhoneFrame>
        </div>
    ),
};

/** An iPad Pro; the aspect follows the capture. */
export const Tablet: Story = {
    render: () => (
        <TabletFrame aspect="1400 / 689">
            <Screenshot dark={usersDark} light={usersLight} alt="Everyone invited to Lar Server and their access." />
        </TabletFrame>
    ),
};

/** A slim television on its pedestal. */
export const Television: Story = {
    render: () => (
        <TvFrame>
            <Screenshot dark={moviesDark} alt="Films in Lar Video on a TV." />
        </TvFrame>
    ),
};

/** A Mac app window whose capture brings its own title bar: just corners, a hairline and depth. */
export const MacAppWindow: Story = {
    render: () => (
        <AppWindow>
            <Screenshot dark={boardDark} light={boardLight} alt="The Lar Factory board." width={2400} height={1500} />
        </AppWindow>
    ),
};

/** A bezel sets the capture in a theme-aware display edge, and a fade dissolves its cropped bottom. */
export const MacAppWindowWithBezel: Story = {
    render: () => (
        <AppWindow bezel fade="bottom">
            <Screenshot dark={deskQueueDark} light={deskQueueLight} alt="Your desk and the queue in Lar Factory." />
        </AppWindow>
    ),
};

/** A close-up cut from a screenshot, raised on glass. */
export const CloseUp: Story = {
    render: () => (
        <Callout size="sm">
            <Screenshot dark={deskDark} light={deskLight} alt="A change waiting for you to verify on your desk." />
        </Callout>
    ),
};

/** A close-up with a smaller detail card over its corner, as phones see the Factory hero. */
export const CloseUpPair: Story = {
    render: () => (
        <div className="mx-auto max-w-105">
            <CalloutPair
                base={
                    <Callout fade>
                        <Screenshot dark={deskQueueDark} light={deskQueueLight} alt="The queue in Lar Factory." />
                    </Callout>
                }
                detail={
                    <Callout>
                        <Screenshot dark={deskDark} light={deskLight} alt="A change waiting for you to verify." />
                    </Callout>
                }
            />
        </div>
    ),
};

/** Close-ups one under another, for a phone-width column. */
export const CloseUpStack: Story = {
    render: () => (
        <CalloutStack>
            <Callout>
                <Screenshot dark={deskDark} light={deskLight} alt="A change waiting for you to verify." />
            </Callout>
            <Callout fade>
                <Screenshot dark={deskQueueDark} light={deskQueueLight} alt="The queue in Lar Factory." />
            </Callout>
        </CalloutStack>
    ),
};

/** A numbered reading guide below the media, preserving every label and action. */
export const Guided: Story = {
    render: () => (
        <GuidedMedia
            label="How to read the board"
            guide={[
                'Your desk: what needs you right now',
                'The queue: work waiting to be shaped',
                'Builds: agents working in their own worktrees',
            ]}
        >
            <AppWindow>
                <Screenshot dark={boardDark} light={boardLight} alt="The Lar Factory board." />
            </AppWindow>
        </GuidedMedia>
    ),
};

/** A bare screenshot: the light capture in light mode, the dark one in dark mode. */
export const ThemedScreenshot: Story = {
    render: () => (
        <Screenshot dark={albumDark} light={albumLight} alt="An album in the Lar Server web app." width={1400} />
    ),
};

/** At phone width, show the slice count and a complete slice instead of shrinking the whole build dialog. */
export const BuildDetail: Story = {
    render: () => (
        <div className="mx-auto max-w-82.5">
            <Callout>
                <Screenshot
                    dark={buildNarrowDark}
                    light={buildNarrowLight}
                    alt="Slice progress and one complete slice with its Done status."
                    detail="build-slices"
                />
            </Callout>
        </div>
    ),
};

/** Keep the creation action and a complete tracker identity at the same UI scale on phones. */
export const CreateItemDetail: Story = {
    render: () => (
        <CalloutStack>
            <Callout size="sm">
                <Screenshot
                    dark={boardDark}
                    light={boardLight}
                    alt="Add an item straight from the board."
                    detail="item-create"
                />
            </Callout>
            <Callout>
                <Screenshot dark={deskDark} light={deskLight} alt="An item with its tracker, project and title." />
            </Callout>
        </CalloutStack>
    ),
};

export const AlbumShelf: Story = {
    args: {
        aspect: '1490 / 400',
        children: (
            <Screenshot dark={albumsDark} light={albumsLight} alt="Five albums with cover art." detail="album-shelf" />
        ),
    },
};

/** A phone-width close-up preserves three complete user identities and their catalog access. */
export const ServerUsersDetail: Story = {
    render: () => (
        <div className="mx-auto max-w-87.5">
            <BrowserFrame address="lar-server.local" aspect="575 / 363">
                <Screenshot
                    dark={usersDark}
                    light={usersLight}
                    alt="Three users, their account states and catalog access."
                    detail="server-users"
                    width={1400}
                    height={689}
                />
            </BrowserFrame>
        </div>
    ),
};

export const CompleteDependencies: Story = {
    render: () => (
        <GuidedMedia
            label="How to read the concept map"
            guide={['Settle the question', 'Start the builds it unblocks', 'Check the outcome after the builds merge']}
        >
            <AppWindow>
                <Screenshot
                    dark={conceptMapDark}
                    light={conceptMapLight}
                    alt="A complete concept map: the decisions, the build they unblock and the outcome check."
                    detail="concept-dependencies"
                />
            </AppWindow>
        </GuidedMedia>
    ),
};
