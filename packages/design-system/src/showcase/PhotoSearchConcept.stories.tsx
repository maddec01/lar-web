import type { Meta, StoryObj } from '@storybook/react-vite';

import absarokasLake from '../../.storybook/assets/absarokas-icy-lake.webp';
import grandCanyon from '../../.storybook/assets/grand-canyon-village-sunrise.webp';
import icebergLake from '../../.storybook/assets/iceberg-lake.webp';
import snowInZion from '../../.storybook/assets/snow-in-zion.webp';
import yellowstoneLake from '../../.storybook/assets/yellowstone-lake-sunset.webp';
import yellowstoneRiver from '../../.storybook/assets/yellowstone-river-sunset.webp';
import { PhotoSearchConcept } from './PhotoSearchConcept';

/** Public-domain photos (US National Park Service and NASA); the two sunsets match the search. */
const photos = [
    { src: yellowstoneLake, alt: 'Sunset over a lake', match: true },
    { src: grandCanyon, alt: 'A canyon at sunrise', match: false },
    { src: absarokasLake, alt: 'A mountain lake under ice', match: false },
    { src: icebergLake, alt: 'An icy mountain lake', match: false },
    { src: yellowstoneRiver, alt: 'Sunset over a river', match: true },
    { src: snowInZion, alt: 'Snow on red cliffs', match: false },
];

const meta = {
    title: 'Showcase/PhotoSearchConcept',
    component: PhotoSearchConcept,
    args: {
        query: 'sunset over water',
        label: 'Concept illustration with public-domain photos, not a screenshot.',
        photos,
    },
    decorators: [
        (Story) => (
            <div className="max-w-85">
                <Story />
            </div>
        ),
    ],
} satisfies Meta<typeof PhotoSearchConcept>;

export default meta;

type Story = StoryObj<typeof meta>;

/** Lar Photos' search, as an illustration: the photos that match are lit, the rest dimmed. */
export const Default: Story = {};

export const DifferentQuery: Story = {
    args: {
        query: 'snow',
        photos: photos.map((photo) => ({ ...photo, match: /ice|snow/i.test(photo.alt) })),
    },
};
