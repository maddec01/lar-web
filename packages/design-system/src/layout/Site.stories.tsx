import type { Meta, StoryObj } from '@storybook/react-vite';
import { DownloadIcon, HandIcon, HouseIcon, MonitorSmartphoneIcon } from 'lucide-react';
import { useState } from 'react';
import { fn } from 'storybook/test';

import boardDark from '../../.storybook/assets/board-dark.webp';
import boardLight from '../../.storybook/assets/board-light.webp';
import dashboardDark from '../../.storybook/assets/dashboard-dark.webp';
import dashboardLight from '../../.storybook/assets/dashboard-light.webp';
import factoryIcon from '../../.storybook/assets/factory.webp';
import musicPlayer from '../../.storybook/assets/music-player-ship.webp';
import serverIcon from '../../.storybook/assets/server.webp';
import { ButtonLink } from '../actions/ButtonLink';
import { ThemeSwitch } from '../actions/ThemeSwitch';
import { BrandLink, BrandMark } from '../display/BrandMark';
import type { ThemePreference } from '../foundations/Theme';
import { CallToAction } from '../showcase/CallToAction';
import { FeatureGrid, FeatureTile } from '../showcase/Cards';
import { AppWindow, BrowserFrame, PhoneFrame, Screenshot } from '../showcase/Devices';
import { Hero } from '../showcase/Hero';
import { ProductBand, ProductBands, ProductIndex } from '../showcase/ProductBand';
import { DeviceStage, Reveal } from '../showcase/Stage';
import { Announcement, AppIcon, ReadinessStatus } from '../showcase/Status';
import { PageSection, SectionHeading } from './PageSection';
import { SiteFooter, SiteHeader, type SiteLink, SiteShell } from './Site';

const navigate = fn();

const links: readonly SiteLink[] = [
    { label: 'Factory', href: '/factory' },
    { label: 'Server', href: '/server' },
];

function DemoHeader({ current }: { current?: string }) {
    const [theme, setTheme] = useState<ThemePreference>('system');

    return (
        <SiteHeader
            brand={<BrandLink href="/" label="Lar home" onNavigate={navigate} />}
            navigationLabel="Main"
            menuLabel="Open menu"
            closeMenuLabel="Close menu"
            menuTitle="Menu"
            onNavigate={navigate}
            links={links.map((link) => ({ ...link, current: link.href === current }))}
            utilities={<ThemeSwitch value={theme} onChange={setTheme} />}
            mobileUtilities={<ThemeSwitch value={theme} onChange={setTheme} labelsVisible />}
            actions={
                <ButtonLink
                    href="https://github.com/maddec01/lar-factory/releases/latest"
                    external
                    size="md"
                    icon={<DownloadIcon />}
                >
                    Download Factory
                </ButtonLink>
            }
        />
    );
}

const footer = (
    <SiteFooter
        brand={<BrandMark label="Lar" />}
        tagline="Software that stays home. Lar is Portuguese for home."
        onNavigate={navigate}
        columns={[
            {
                title: 'Products',
                links: [
                    { label: 'Lar Factory', href: '/factory' },
                    { label: 'Lar Server', href: '/server' },
                ],
            },
            {
                title: 'Factory',
                links: [
                    {
                        label: 'Download for Mac',
                        href: 'https://github.com/maddec01/lar-factory/releases/latest',
                        external: true,
                    },
                    { label: 'Source on GitHub', href: 'https://github.com/maddec01/lar-factory', external: true },
                ],
            },
            {
                title: 'Server',
                links: [
                    { label: 'See progress', href: '/server#progress' },
                    { label: 'Launch email', href: 'mailto:dev@lar.works?subject=Lar%20Server%20launch' },
                ],
            },
            { title: 'Lar Works', links: [{ label: 'dev@lar.works', href: 'mailto:dev@lar.works' }] },
        ]}
        legal="© 2026 Lar Works"
        note="Made for people who like to own their things."
    />
);

/** Lar’s home page: the hero and product index, a band per product, the principles and the closing call. */
function HomePage() {
    return (
        <>
            <Hero
                announcement={
                    <Announcement href="/factory" tag="New" onNavigate={navigate}>
                        Lar Factory is out for Mac
                    </Announcement>
                }
                title="Software that stays home."
                lead="Lar makes software that runs on machines you own. Each product does one job well, and leaves the final word to you."
                note="Lar is Portuguese for home."
                visual={
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
                }
            />
            <PageSection id="products" space="closing" label="Lar products">
                <ProductBands>
                    <Reveal>
                        <ProductBand
                            hue={70}
                            chroma={0.09}
                            icon={<AppIcon src={factoryIcon} alt="" size="sm" />}
                            name="Lar Factory"
                            status={<ReadinessStatus status="available">Available for Mac</ReadinessStatus>}
                            title="Turn issues into reviewed pull requests."
                            description="Shape ideas on a board. Let agents build them in isolated worktrees. Review and merge every pull request yourself."
                            note="Free · Apple silicon · Requires T3 Code"
                            actions={
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
                            }
                            media={
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
                        />
                    </Reveal>
                    <Reveal>
                        <ProductBand
                            reverse
                            hue={264}
                            icon={<AppIcon src={serverIcon} alt="" size="sm" />}
                            name="Lar Server"
                            status={<ReadinessStatus status="development">In development</ReadinessStatus>}
                            title="Your music and films, on every screen."
                            description="Indexed on a server you own and streamed to native apps on your phone, tablet and computer, with the TV next."
                            actions={
                                <ButtonLink href="/server" arrow onNavigate={navigate}>
                                    See Lar Server
                                </ButtonLink>
                            }
                            media={
                                <DeviceStage
                                    endSize="lg"
                                    main={
                                        <BrowserFrame address="lar-server.local" aspect="1600 / 1040" fade="tail">
                                            <Screenshot
                                                dark={dashboardDark}
                                                light={dashboardLight}
                                                alt="The Lar Server dashboard: catalogs, the machine’s resources and who’s listening right now."
                                            />
                                        </BrowserFrame>
                                    }
                                    end={
                                        <PhoneFrame>
                                            <Screenshot
                                                dark={musicPlayer}
                                                alt="Lar Music on iPhone, playing a symphony."
                                            />
                                        </PhoneFrame>
                                    }
                                />
                            }
                        />
                    </Reveal>
                </ProductBands>
            </PageSection>
            <PageSection heading={<SectionHeading eyebrow="Why Lar" title="Three promises in everything we make." />}>
                <Reveal>
                    <FeatureGrid>
                        <FeatureTile icon={<HouseIcon />} title="It runs on your machines">
                            Your repositories, work records and media libraries live on hardware you own. What&apos;s
                            yours stays home.
                        </FeatureTile>
                        <FeatureTile icon={<MonitorSmartphoneIcon />} title="It fits in where you are">
                            Each product works with the tools and devices you already use, from your tracker and CI to
                            your iPhone, iPad and Mac.
                        </FeatureTile>
                        <FeatureTile icon={<HandIcon />} title="You stay in control">
                            You approve what ships, decide who gets access, and your own changes are never overwritten.
                        </FeatureTile>
                    </FeatureGrid>
                </Reveal>
            </PageSection>
            <PageSection space="closing">
                <Reveal>
                    <CallToAction
                        title="Bring it home."
                        lead="Start with Lar Factory today, and watch Lar Server grow one app at a time."
                        actions={
                            <>
                                <ButtonLink
                                    href="https://github.com/maddec01/lar-factory/releases/latest"
                                    external
                                    icon={<DownloadIcon />}
                                >
                                    Download Lar Factory
                                </ButtonLink>
                                <ButtonLink href="/server#progress" variant="secondary" arrow onNavigate={navigate}>
                                    See progress on Server
                                </ButtonLink>
                            </>
                        }
                    />
                </Reveal>
            </PageSection>
        </>
    );
}

const meta = {
    title: 'Layout/Site',
    component: SiteShell,
    parameters: { layout: 'fullscreen' },
    args: {
        skipLabel: 'Skip to content',
        header: <DemoHeader />,
        footer,
        children: <HomePage />,
    },
    argTypes: { header: { control: false }, footer: { control: false }, children: { control: false } },
} satisfies Meta<typeof SiteShell>;

export default meta;

type Story = StoryObj<typeof meta>;

/** The top-level marketing page: the site shell with its glass header, Lar’s home page and the footer. */
export const MarketingPage: Story = {};

/** The header on a product page, with that page’s link marked current. Narrow screens fold the links into a menu. */
export const Header: Story = {
    render: () => (
        <div className="glass-bar">
            <DemoHeader current="/server" />
        </div>
    ),
};

/** The menu open on a phone: the links, the theme switch and the page’s call to action. Escape closes it and focus
 *  goes back to its button. */
export const MobileMenuOpen: Story = {
    globals: { viewport: { value: 'mobile1' } },
    render: () => (
        <div className="glass-bar relative min-h-96">
            <DemoHeader current="/factory" />
        </div>
    ),
    play: async ({ canvasElement }) => canvasElement.querySelector<HTMLButtonElement>('button[aria-expanded]')?.click(),
};

export const Footer: Story = { render: () => footer };
