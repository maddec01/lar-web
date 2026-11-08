import type { Meta, StoryObj } from '@storybook/react-vite';
import {
    AudioLinesIcon,
    BookOpenIcon,
    GlobeIcon,
    ImageIcon,
    KeyRoundIcon,
    LayersIcon,
    MonitorSmartphoneIcon,
} from 'lucide-react';

import absarokasLake from '../../.storybook/assets/absarokas-icy-lake.webp';
import grandCanyon from '../../.storybook/assets/grand-canyon-village-sunrise.webp';
import icebergLake from '../../.storybook/assets/iceberg-lake.webp';
import snowInZion from '../../.storybook/assets/snow-in-zion.webp';
import yellowstoneLake from '../../.storybook/assets/yellowstone-lake-sunset.webp';
import yellowstoneRiver from '../../.storybook/assets/yellowstone-river-sunset.webp';
import { PhotoSearchConcept } from './PhotoSearchConcept';
import { Roadmap, type RoadmapItem } from './Roadmap';

const planned: readonly RoadmapItem[] = [
    { icon: <BookOpenIcon />, title: 'Lar Books', body: 'Your ebook shelf, with covers, on every device.' },
    {
        icon: <MonitorSmartphoneIcon />,
        title: 'Android and Google TV',
        body: 'Phones, tablets and a living-room app for your TV.',
    },
    {
        icon: <KeyRoundIcon />,
        title: 'Sign in with a Lar account',
        body: 'One account for every server you’re invited to: passkey, Apple or Google.',
    },
    { icon: <GlobeIcon />, title: 'Always findable', body: 'Apps look up your server’s new address when it changes.' },
    {
        icon: <LayersIcon />,
        title: 'The Lar metadata service',
        body: 'Finished metadata and artwork for films, shows and music, no API keys.',
    },
    {
        icon: <AudioLinesIcon />,
        title: 'Play to your speakers',
        body: 'Send music to Chromecast and DLNA speakers around the house.',
    },
];

const photos: RoadmapItem = {
    icon: <ImageIcon />,
    title: 'Lar Photos: your own photo cloud',
    body: 'Every picture you take backs up to your server instead of iCloud or Google Photos, and search finds photos by what’s in them.',
    featured: {
        hue: 190,
        highlights: ['Every photo on your own disks'],
        steps: ['Take a photo', 'It backs up to your server', 'Search finds it by what is in it'],
        visual: (
            <PhotoSearchConcept
                query="sunset over water"
                label="Concept illustration with public-domain photos, not a screenshot."
                photos={[
                    { src: yellowstoneLake, alt: 'Sunset over a lake', match: true },
                    { src: grandCanyon, alt: 'A canyon at sunrise', match: false },
                    { src: absarokasLake, alt: 'A mountain lake under ice', match: false },
                    { src: icebergLake, alt: 'An icy mountain lake', match: false },
                    { src: yellowstoneRiver, alt: 'Sunset over a river', match: true },
                    { src: snowInZion, alt: 'Snow on red cliffs', match: false },
                ]}
            />
        ),
    },
};

const meta = {
    title: 'Showcase/Roadmap',
    component: Roadmap,
    args: { label: 'Planned features', statusLabel: 'Planned', items: [photos, ...planned] },
    argTypes: { items: { control: false } },
    decorators: [
        (Story) => (
            <div className="max-w-page mx-auto">
                <Story />
            </div>
        ),
    ],
} satisfies Meta<typeof Roadmap>;

export default meta;

type Story = StoryObj<typeof meta>;

/** Lar Server’s roadmap: Photos featured in its hue with an illustration, then quiet dashed promises. */
export const Default: Story = {};

/** A featured item without a visual: its highlights and steps take the room. */
export const FeaturedWithoutVisual: Story = {
    args: {
        items: [
            {
                ...photos,
                featured: {
                    hue: 190,
                    highlights: ['Every photo on your own disks', 'Recognition on your server'],
                    steps: photos.featured?.steps,
                },
            },
            ...planned.slice(0, 3),
        ],
    },
};

/** Only planned items, no featured card. */
export const PlannedOnly: Story = { args: { items: planned } };

/** Closing a section that has its own SectionHeading: a heading of its own above the list. */
export const WithTitle: Story = {
    args: { title: 'Coming next', lead: 'Planned and on the way, after Music and Video ship.' },
};
