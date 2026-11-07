import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';

import { CollectionSectionHeader } from './CollectionSectionHeader';
import { DataRow } from './DataRow';
import { type ListColumn, VirtualList } from './VirtualList';

interface Track {
    id: string;
    title: string;
    artist: string;
    album: string;
    seconds: number;
    hue: number;
}

const words = ['Blue', 'Night', 'River', 'Summer', 'Little', 'Song', 'Light', 'Morning', 'Road', 'Heart', 'Ocean'];
const artists = ['Miles Davis', 'Nina Simone', 'Radiohead', 'Caetano Veloso', 'Björk', 'Fela Kuti', 'Amália Rodrigues'];
const albums = ['Kind of Blue', 'Pastel Blues', 'Kid A', 'Bicho', 'Homogenic', 'Zombie', 'Com que voz'];

const tracks: Track[] = Array.from({ length: 500 }, (_, index) => ({
    id: `track-${index}`,
    title:
        index === 3
            ? 'A Very Long Track Title That Keeps Going Well Past the Width of Its Column (Live at Montreux, 1983)'
            : `${words[index % words.length]} ${words[(index * 7) % words.length]} ${index + 1}`,
    artist: artists[index % artists.length]!,
    album: albums[(index * 3) % albums.length]!,
    seconds: 120 + ((index * 53) % 420),
    hue: (index * 37) % 360,
})).sort((a, b) => a.title.localeCompare(b.title));

const byDuration = [...tracks].sort((a, b) => b.seconds - a.seconds);

function duration(seconds: number) {
    return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;
}

const columns: ListColumn<Track>[] = [
    {
        id: 'title',
        label: 'Title',
        size: 'primary',
        render: (track) => (
            <DataRow.Primary
                title={track.title}
                subtitle={track.artist}
                artwork={
                    <span
                        aria-hidden="true"
                        className="block size-full rounded-md"
                        style={{
                            background: `linear-gradient(135deg, hsl(${track.hue} 60% 55%), hsl(${track.hue + 50} 60% 25%))`,
                        }}
                    />
                }
            />
        ),
        placeholder: () => <DataRow.Primary loading />,
    },
    { id: 'album', label: 'Album', size: 'secondary', priority: 'secondary', render: (track) => track.album },
    { id: 'artist', label: 'Artist', size: 'secondary', priority: 'tertiary', render: (track) => track.artist },
    {
        id: 'duration',
        label: 'Duration',
        size: 'numeric',
        align: 'right',
        render: (track) => duration(track.seconds),
    },
];

/**
 * Virtualized against the window's scroll, not a scroll container of its own, so it sits directly in the page:
 * scroll the canvas to mount more rows. Columns with a lower priority appear as the table widens.
 */
const meta = {
    title: 'Collections/VirtualList',
    component: VirtualList<Track>,
    args: {
        label: 'Tracks',
        columns,
        count: tracks.length,
        itemAt: (index) => tracks[index],
        itemKey: (index) => tracks[index]?.id ?? `slot-${index}`,
        itemLabel: (track) => `${track.title}, ${track.artist}`,
        onRangeChange: fn(),
        onSelect: fn(),
        sort: 'title',
        direction: 'asc',
    },
    decorators: [
        (Story) => (
            <div className="max-w-5xl">
                <Story />
            </div>
        ),
    ],
} satisfies Meta<typeof VirtualList<Track>>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Tracks: Story = {};

/** Sorted by duration, descending: the sorted column always shows. */
export const SortedByDuration: Story = {
    args: {
        sort: 'duration',
        direction: 'desc',
        itemAt: (index) => byDuration[index],
        itemKey: (index) => byDuration[index]!.id,
    },
};

/** Section headers start each letter. */
export const Sectioned: Story = {
    args: {
        section: {
            isStart: (track, _index, previous) => !previous || previous.title[0] !== track.title[0],
            render: (track) => <CollectionSectionHeader>{track.title[0]}</CollectionSectionHeader>,
        },
    },
};

/** Rows whose page has not loaded yet show each column's placeholder. */
export const LoadingPages: Story = {
    args: { loading: true, itemAt: (index) => (index < 20 ? tracks[index] : undefined) },
};

/** Rows link to their pages instead of calling `onSelect`. */
export const Links: Story = {
    args: { onSelect: undefined, itemHref: (track) => `/music/tracks/${track.id}`, onNavigate: fn() },
};

export const Empty: Story = { args: { count: 0 } };
