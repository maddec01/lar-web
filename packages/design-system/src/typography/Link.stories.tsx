import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';

import { Badge } from '../display/Badge';
import { InlineLink, Link, LinkBox, LinkOverlay } from './Link';
import { Heading, Text } from './Typography';

const meta = {
    title: 'Typography/Link',
    component: Link,
    args: { href: '/libraries/music', children: 'Open music library', variant: 'body', onNavigate: fn() },
    argTypes: { variant: { control: 'inline-radio', options: ['body', 'caption'] } },
} satisfies Meta<typeof Link>;

export default meta;

type Story = StoryObj<typeof meta>;

/** An in-app link: `onNavigate` takes ordinary clicks, modified clicks keep the browser's behaviour. */
export const Body: Story = {};

export const Caption: Story = { args: { variant: 'caption', children: 'View import log' } };

export const External: Story = {
    args: { href: 'https://lucide.dev/icons', external: true, showExternalIcon: true, children: 'Browse lucide icons' },
};

export const LongText: Story = {
    render: (args) => (
        <div className="w-64">
            <Link {...args}>The Rise and Fall of Ziggy Stardust and the Spiders from Mars (2012 Remaster)</Link>
        </div>
    ),
};

/** InlineLink: a link inside running text, in the surrounding size and colour. Always opens a new tab. */
export const Inline: Story = {
    render: () => (
        <div className="flex max-w-md flex-col gap-2">
            <Text>
                Lar reads tags with MusicBrainz Picard&apos;s conventions; see the{' '}
                <InlineLink href="https://picard-docs.musicbrainz.org/">Picard documentation</InlineLink> for details.
            </Text>
            <Text variant="caption" tone="muted">
                Need a token? <InlineLink href="https://github.com/settings/tokens">Create one on GitHub</InlineLink>.
            </Text>
        </div>
    ),
};

/** LinkBox and LinkOverlay: the whole card opens the album, while the artist link stays clickable above it. */
export const CardOverlay: Story = {
    render: (args) => (
        <LinkBox className="border-base-300 bg-base-100 hover:bg-base-200/60 relative flex max-w-sm flex-col gap-1 rounded-lg border p-4">
            <div className="flex items-center gap-2">
                <Heading as="h3" variant="title">
                    <LinkOverlay href="/music/albums/blackstar" onNavigate={args.onNavigate}>
                        Blackstar
                    </LinkOverlay>
                </Heading>
                <Badge tone="accent">FLAC</Badge>
            </div>
            <Text variant="caption" tone="muted">
                <Link variant="caption" href="/music/artists/david-bowie" onNavigate={args.onNavigate}>
                    David Bowie
                </Link>{' '}
                · 2016 · 7 tracks
            </Text>
        </LinkBox>
    ),
};
