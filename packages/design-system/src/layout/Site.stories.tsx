import type { Meta, StoryObj } from '@storybook/react-vite';
import { DownloadIcon } from 'lucide-react';
import { useState } from 'react';
import { fn } from 'storybook/test';

import { ButtonLink } from '../actions/ButtonLink';
import { ThemeSwitch } from '../actions/ThemeSwitch';
import { BrandMark } from '../display/BrandMark';
import type { ThemePreference } from '../foundations/Theme';
import { Text } from '../typography/Typography';
import { Inline } from './Flow';
import { PageSection, SectionHeading } from './PageSection';
import { SiteFooter, SiteHeader, type SiteLink, SiteShell } from './Site';

const navigate = fn();

const links: readonly SiteLink[] = [
    { label: 'Product', href: '/product' },
    { label: 'Pricing', href: '/pricing' },
];

function DemoHeader({ current }: { current?: string }) {
    const [theme, setTheme] = useState<ThemePreference>('system');

    return (
        <SiteHeader
            home={{ href: '/', label: 'Lar, home' }}
            navigationLabel="Main"
            menuLabel="Open menu"
            closeMenuLabel="Close menu"
            menuTitle="Menu"
            onNavigate={navigate}
            links={links.map((link) => ({ ...link, current: link.href === current }))}
            utilities={<ThemeSwitch value={theme} onChange={setTheme} />}
            mobileUtilities={<ThemeSwitch value={theme} onChange={setTheme} labelsVisible />}
            actions={
                <ButtonLink href="https://example.com/download" external size="md" icon={<DownloadIcon />}>
                    Download
                </ButtonLink>
            }
        />
    );
}

const footer = (
    <SiteFooter
        brand={<BrandMark label="Home" />}
        tagline="Software that runs on machines you own."
        onNavigate={navigate}
        columns={[
            {
                title: 'Product',
                links: [
                    { label: 'Overview', href: '/product' },
                    { label: 'Pricing', href: '/pricing' },
                ],
            },
            {
                title: 'Download',
                links: [
                    { label: 'Download for Mac', href: 'https://example.com/download', external: true },
                    { label: 'Source code', href: 'https://example.com/source', external: true },
                ],
            },
            { title: 'Contact', links: [{ label: 'hello@example.com', href: 'mailto:hello@example.com' }] },
        ]}
        legal="© 2026 Example"
        note="Made for people who like to own their things."
    />
);

/** A marketing page: an opening statement, a band of content and the closing call. */
function HomePage() {
    return (
        <>
            <PageSection
                space="hero"
                heading={
                    <SectionHeading
                        level="h1"
                        variant="display"
                        title="Software that stays home."
                        lead="It runs on machines you own, does one job well, and leaves the final word to you."
                    />
                }
            >
                <Inline space="tight">
                    <ButtonLink href="https://example.com/download" external icon={<DownloadIcon />}>
                        Download for Mac
                    </ButtonLink>
                    <ButtonLink href="/product" variant="quiet" arrow onNavigate={navigate}>
                        How it works
                    </ButtonLink>
                </Inline>
            </PageSection>
            <PageSection
                variant="raised"
                heading={<SectionHeading eyebrow="Why it" title="Three promises in everything it does." />}
            >
                <Text variant="prose" tone="muted">
                    Your files live on hardware you own. It works with the tools and devices you already use. You
                    approve what changes, and your own changes are never overwritten.
                </Text>
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

/** The top-level marketing page: the site shell with its glass header, a home page and the footer. */
export const MarketingPage: Story = {};

/** The header on a product page, with that page’s link marked current. Narrow screens fold the links into a menu. */
export const Header: Story = {
    render: () => (
        <div className="glass-bar">
            <DemoHeader current="/pricing" />
        </div>
    ),
};

/** The menu open on a phone: the links, the theme switch and the page’s call to action. Escape closes it and focus
 *  goes back to its button. */
export const MobileMenuOpen: Story = {
    globals: { viewport: { value: 'mobile1' } },
    render: () => (
        <div className="glass-bar relative min-h-96">
            <DemoHeader current="/product" />
        </div>
    ),
    play: async ({ canvasElement }) => canvasElement.querySelector<HTMLButtonElement>('button[aria-expanded]')?.click(),
};

export const Footer: Story = { render: () => footer };
