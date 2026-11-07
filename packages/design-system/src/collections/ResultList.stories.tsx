import type { Meta, StoryObj } from '@storybook/react-vite';
import { FilmIcon, FolderIcon, MusicIcon, SettingsIcon } from 'lucide-react';
import { useState } from 'react';
import { fn } from 'storybook/test';

import { ResultEmpty, ResultList, ResultRow } from './ResultList';

function Art({ hue, aspect = 'square' }: { hue: number; aspect?: 'square' | 'poster' | 'video' }) {
    return (
        <span
            aria-hidden="true"
            className={`block w-full rounded-md ${aspect === 'poster' ? 'aspect-[2/3]' : aspect === 'video' ? 'aspect-video' : 'aspect-square'}`}
            style={{ background: `linear-gradient(135deg, hsl(${hue} 60% 55%), hsl(${hue + 50} 60% 25%))` }}
        />
    );
}

const albums = [
    { id: 'kind-of-blue', title: 'Kind of Blue', subtitle: 'Miles Davis · 1959', hue: 210 },
    { id: 'kid-a', title: 'Kid A', subtitle: 'Radiohead · 2000', hue: 0 },
    { id: 'bicho', title: 'Bicho', subtitle: 'Caetano Veloso · 1977', hue: 45 },
    { id: 'pastel-blues', title: 'Pastel Blues', subtitle: 'Nina Simone · 1965', hue: 260 },
];

function SearchResults() {
    const [selected, setSelected] = useState('kind-of-blue');

    return (
        <ResultList label="Albums">
            {albums.map((album) => (
                <ResultRow
                    key={album.id}
                    artwork={<Art hue={album.hue} />}
                    kind="Album"
                    title={album.title}
                    subtitle={album.subtitle}
                    selected={selected === album.id}
                    onSelect={() => setSelected(album.id)}
                />
            ))}
        </ResultList>
    );
}

const meta = {
    title: 'Collections/ResultList',
    component: ResultList,
    args: { label: 'Albums', density: 'comfortable', loading: false },
    decorators: [
        (Story) => (
            <div className="max-w-md">
                <Story />
            </div>
        ),
    ],
    render: () => <SearchResults />,
} satisfies Meta<typeof ResultList>;

export default meta;

type Story = StoryObj<typeof meta>;

/** A listbox of selectable results, such as search suggestions. */
export const Listbox: Story = {};

export const Loading: Story = {
    args: { loading: true, loadingLabel: 'Searching albums' },
    render: (args) => <ResultList {...args} />,
};

export const Empty: Story = {
    render: (args) => (
        <ResultList {...args}>
            <ResultEmpty>No albums match “bossa”</ResultEmpty>
        </ResultList>
    ),
};

/** Posters and video stills, with a chevron for rows that open a page. */
export const PostersAndVideos: Story = {
    render: (args) => (
        <ResultList {...args} label="Movies and episodes">
            <ResultRow
                presentation="poster"
                artwork={<Art hue={30} aspect="poster" />}
                kind="Movie"
                title="Dune: Part Two"
                subtitle="2024 · 2 h 46 min"
                detail="Paul Atreides unites with the Fremen while on a path of revenge against the conspirators who destroyed his family."
                onSelect={fn()}
            />
            <ResultRow
                presentation="video"
                artwork={<Art hue={180} aspect="video" />}
                kind="Episode"
                title="Ozymandias"
                subtitle="Breaking Bad · S5 E14"
                onSelect={fn()}
            />
        </ResultList>
    ),
};

/** `role="list"` with `href`s turns rows into links; the current page is marked. */
export const Links: Story = {
    args: { role: 'list', label: 'Go to' },
    render: (args) => (
        <ResultList {...args}>
            <ResultRow
                presentation="icon"
                artwork={<MusicIcon />}
                kind="Library"
                title="Music"
                href="/music"
                onSelect={fn()}
                current
            />
            <ResultRow
                presentation="icon"
                artwork={<FilmIcon />}
                kind="Library"
                title="Movies"
                href="/movies"
                onSelect={fn()}
            />
            <ResultRow
                presentation="icon"
                artwork={<FolderIcon />}
                kind="Folder"
                title="incoming"
                subtitle="/mnt/media/music/incoming"
                href="/folders/mnt/media/music/incoming"
                onSelect={fn()}
            />
            <ResultRow
                presentation="icon"
                artwork={<SettingsIcon />}
                kind="Page"
                title="Settings"
                href="/settings"
                onSelect={fn()}
            />
        </ResultList>
    ),
};

export const Compact: Story = {
    args: { density: 'compact' },
    render: (args) => (
        <ResultList {...args}>
            {albums.map((album, index) => (
                <ResultRow
                    key={album.id}
                    artwork={<Art hue={album.hue} />}
                    kind="Album"
                    title={album.title}
                    subtitle={album.subtitle}
                    selected={index === 0}
                    disabled={index === 3}
                    onSelect={fn()}
                />
            ))}
        </ResultList>
    ),
};

export const LongContent: Story = {
    render: (args) => (
        <ResultList {...args}>
            <ResultRow
                artwork={<Art hue={300} />}
                kind="Album"
                title="The Rise and Fall of Ziggy Stardust and the Spiders from Mars (50th Anniversary Half-Speed Remaster)"
                subtitle="David Bowie · RCA Records · 1972 · Remastered 2022 · 24-bit / 192 kHz"
                detail="Includes the original album, the 2012 remaster, and eleven previously unreleased demos recorded at Trident Studios in late 1971."
                onSelect={fn()}
            />
        </ResultList>
    ),
};
