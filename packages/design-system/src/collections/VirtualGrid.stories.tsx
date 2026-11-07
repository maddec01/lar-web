import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';

import { SkeletonLoader } from '../feedback/SkeletonLoader';
import { Text } from '../typography/Typography';
import { VirtualGrid } from './VirtualGrid';

const artists = ['Miles Davis', 'Nina Simone', 'Radiohead', 'Caetano Veloso', 'Björk', 'Fela Kuti', 'Amália Rodrigues'];

const albums = Array.from({ length: 600 }, (_, index) => ({
    id: `album-${index}`,
    title: index === 7 ? 'The Rise and Fall of Ziggy Stardust and the Spiders from Mars' : `Album ${index + 1}`,
    artist: artists[index % artists.length]!,
    year: 1955 + (index % 70),
    hue: (index * 37) % 360,
}));

function AlbumCard({ index, aspect = 'square' }: { index: number; aspect?: 'square' | 'poster' }) {
    const album = albums[index]!;

    return (
        <div className="flex flex-col gap-2">
            <div
                aria-hidden="true"
                className={`w-full rounded-lg ${aspect === 'poster' ? 'aspect-[2/3]' : 'aspect-square'}`}
                style={{
                    background: `linear-gradient(135deg, hsl(${album.hue} 60% 55%), hsl(${album.hue + 50} 60% 25%))`,
                }}
            />
            <div className="flex min-w-0 flex-col">
                <Text as="span" variant="label" truncate>
                    {album.title}
                </Text>
                <Text as="span" variant="caption" tone="muted" truncate>
                    {album.artist} · {album.year}
                </Text>
            </div>
        </div>
    );
}

function CardPlaceholder() {
    return (
        <div className="flex flex-col gap-2">
            <SkeletonLoader.Shape presentation="artwork" />
            <SkeletonLoader.Shape width="wide" />
            <SkeletonLoader.Shape width="medium" />
        </div>
    );
}

/**
 * Virtualized against the window's scroll, not a scroll container of its own, so it sits directly in the page:
 * scroll the canvas to load more rows.
 */
const meta = {
    title: 'Collections/VirtualGrid',
    component: VirtualGrid,
    args: {
        count: albums.length,
        label: 'Albums',
        itemKey: (index) => albums[index]!.id,
        renderItem: (index) => <AlbumCard index={index} />,
        onRangeChange: fn(),
    },
    decorators: [
        (Story) => (
            <div className="max-w-5xl">
                <Story />
            </div>
        ),
    ],
} satisfies Meta<typeof VirtualGrid>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Albums: Story = {};

export const Posters: Story = {
    args: { label: 'Movies', aspect: 'poster', renderItem: (index) => <AlbumCard index={index} aspect="poster" /> },
};

/** Pages that have not arrived yet render placeholders in their slots. */
export const Loading: Story = {
    args: {
        loading: true,
        renderItem: (index) => (index < 12 ? <AlbumCard index={index} /> : <CardPlaceholder />),
    },
};

export const FewItems: Story = { args: { count: 3 } };
