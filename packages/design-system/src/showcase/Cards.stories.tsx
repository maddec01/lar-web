import type { Meta, StoryObj } from '@storybook/react-vite';
import {
    ActivityIcon,
    BookOpenIcon,
    ContainerIcon,
    FilmIcon,
    HandIcon,
    HouseIcon,
    ImageIcon,
    KeyRoundIcon,
    MonitorSmartphoneIcon,
    MusicIcon,
    ShieldCheckIcon,
    TagIcon,
    UserIcon,
} from 'lucide-react';
import { fn } from 'storybook/test';

import boardDark from '../../.storybook/assets/board-dark.webp';
import boardLight from '../../.storybook/assets/board-light.webp';
import dashboardDark from '../../.storybook/assets/dashboard-dark.webp';
import dashboardLight from '../../.storybook/assets/dashboard-light.webp';
import factoryIcon from '../../.storybook/assets/factory.webp';
import serverIcon from '../../.storybook/assets/server.webp';
import { FeatureGrid, FeatureTile, ProductCard, ProductGrid } from './Cards';
import { AppWindow, BrowserFrame, Screenshot } from './Devices';
import { AppIcon, ReadinessStatus } from './Status';

const meta = {
    title: 'Showcase/Cards',
    component: ProductCard,
    args: {
        hue: 264,
        icon: <AppIcon src={serverIcon} alt="" size="sm" />,
        name: 'Lar Server',
        status: <ReadinessStatus status="development">In development</ReadinessStatus>,
        title: 'Your music and films, on every screen.',
        description:
            'Indexed on a server you own and streamed to native apps on your phone, tablet and computer, with the TV next.',
        linkLabel: 'See Lar Server',
        href: '/server',
        onNavigate: fn(),
        media: (
            <BrowserFrame address="lar-server.local" aspect="1600 / 1040">
                <Screenshot dark={dashboardDark} light={dashboardLight} alt="The Lar Server dashboard." />
            </BrowserFrame>
        ),
    },
    argTypes: { icon: { control: false }, status: { control: false }, media: { control: false } },
    decorators: [
        (Story) => (
            <div className="max-w-page mx-auto">
                <Story />
            </div>
        ),
    ],
} satisfies Meta<typeof ProductCard>;

export default meta;

type Story = StoryObj<typeof meta>;

/** A product on the home page: the whole card is the link, and its screenshot runs off the bottom edge. */
export const Product: Story = {
    decorators: [
        (Story) => (
            <div className="max-w-145">
                <Story />
            </div>
        ),
    ],
};

/** Two products side by side; Factory has no hue and takes the neutral graphite. */
export const Products: Story = {
    render: (args) => (
        <ProductGrid>
            <ProductCard
                {...args}
                hue={undefined}
                icon={<AppIcon src={factoryIcon} alt="" size="sm" />}
                name="Lar Factory"
                status={<ReadinessStatus status="available">Available for Mac</ReadinessStatus>}
                title="Turn issues into reviewed pull requests."
                description="Shape ideas on a board. Let agents build them in isolated worktrees. Review and merge every pull request yourself."
                linkLabel="How it works"
                href="/factory"
                media={
                    <AppWindow>
                        <Screenshot dark={boardDark} light={boardLight} alt="The Lar Factory board." />
                    </AppWindow>
                }
            />
            <ProductCard {...args} />
        </ProductGrid>
    ),
};

/** Three benefits: cards on wide screens, compact rows in one panel on phones. */
export const Features: Story = {
    render: () => (
        <FeatureGrid>
            <FeatureTile icon={<HouseIcon />} title="It runs on your machines">
                Your repositories, work records and media libraries live on hardware you own. What&apos;s yours stays
                home.
            </FeatureTile>
            <FeatureTile icon={<MonitorSmartphoneIcon />} title="It fits in where you are">
                Each product works with the tools and devices you already use, from your tracker and CI to your iPhone,
                iPad and Mac.
            </FeatureTile>
            <FeatureTile icon={<HandIcon />} title="You stay in control">
                You approve what ships, decide who gets access, and your own changes are never overwritten.
            </FeatureTile>
        </FeatureGrid>
    ),
};

/** Lar Server’s collector features, six tiles in three columns. */
export const ManyFeatures: Story = {
    render: () => (
        <FeatureGrid>
            <FeatureTile icon={<TagIcon />} title="Your tags come first">
                The catalog comes from your files&apos; tags, and your edits survive every rescan.
            </FeatureTile>
            <FeatureTile icon={<UserIcon />} title="Everyone gets a library">
                Invite family and friends and choose which catalogs each one sees.
            </FeatureTile>
            <FeatureTile icon={<KeyRoundIcon />} title="Recovery without email">
                A recovery key resets a forgotten password, no mail server needed.
            </FeatureTile>
            <FeatureTile icon={<ShieldCheckIcon />} title="Integrity checks">
                Find broken tags and missing artwork, and confirm every repair.
            </FeatureTile>
            <FeatureTile icon={<ActivityIcon />} title="Nothing hidden">
                Activity, jobs and daily logs show what the server is doing.
            </FeatureTile>
            <FeatureTile icon={<ContainerIcon />} title="Runs where your media lives">
                A container image, Docker Compose and an Unraid template.
            </FeatureTile>
        </FeatureGrid>
    ),
};

/** Tiles tinted with app hues instead of the brand navy, four to a row. */
export const TintedFourColumns: Story = {
    render: () => (
        <FeatureGrid columns={4}>
            <FeatureTile icon={<MusicIcon />} title="Music" hue={20}>
                Albums, artists and playlists from your own tags.
            </FeatureTile>
            <FeatureTile icon={<FilmIcon />} title="Video" hue={300}>
                Films and series in their original quality.
            </FeatureTile>
            <FeatureTile icon={<ImageIcon />} title="Photos" hue={190}>
                Your own photo cloud, on your own disks.
            </FeatureTile>
            <FeatureTile icon={<BookOpenIcon />} title="Books" hue={140}>
                Your ebook shelf, with covers, on every device.
            </FeatureTile>
        </FeatureGrid>
    ),
};
