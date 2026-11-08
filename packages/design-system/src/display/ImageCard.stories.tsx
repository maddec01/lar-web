import type { Meta, StoryObj } from '@storybook/react-vite';
import { Disc3Icon, FilmIcon, ImagesIcon, ListMusicIcon, MicVocalIcon, TvIcon } from 'lucide-react';
import type { ComponentProps, ReactNode } from 'react';

import { Artwork } from '../media/Artwork';
import { BookCover } from '../media/BookCover';
import { Avatar } from './Avatar';
import { ImageCard } from './ImageCard';

// The loaded variant of the props, so stories' args and controls match it; the loading state has its own story.
type ImageCardProps = Extract<ComponentProps<typeof ImageCard>, { title: string }>;

const album = (seed: string) => (
    <Artwork alt="" src={`https://picsum.photos/seed/${seed}/300/300`} fallback={<Disc3Icon />} />
);
const poster = (seed?: string) => (
    <Artwork
        alt=""
        aspect="poster"
        src={seed ? `https://picsum.photos/seed/${seed}/300/450` : undefined}
        fallback={<FilmIcon />}
    />
);

const meta = {
    title: 'Display/ImageCard',
    component: ImageCard,
    args: {
        title: 'Random Access Memories',
        subtitle: 'Daft Punk',
        meta: '2013',
        artwork: album('lar-ram'),
        href: '/music/albums/random-access-memories',
        onNavigate: () => undefined,
    },
    render: (args) => (
        <div className="w-44">
            <ImageCard {...args} />
        </div>
    ),
} satisfies Meta<ImageCardProps>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * An album: its title, its artist, then its year (and an edition that tells it from its siblings). Every card has
 * these three rows — title, maker, meta — whatever it is, so every catalog grid ends its cards at one height.
 */
export const Album: Story = {};

/** A movie: its title, its director, then its year and its best copy's quality as a quiet badge on the same line. */
export const Movie: Story = {
    args: {
        title: 'Past Lives',
        subtitle: 'Celine Song',
        meta: '2023',
        quality: '4K HDR',
        presentation: 'poster',
        artwork: poster('lar-past-lives'),
        href: '/movies/past-lives',
    },
};

/** A show: its title, who created it, then the year it began. */
export const Show: Story = {
    args: {
        ...Movie.args,
        title: 'Severance',
        subtitle: 'Dan Erickson',
        meta: '2022',
        quality: undefined,
        artwork: <Artwork alt="" aspect="poster" fallback={<TvIcon />} />,
    },
};

/** A song: its title, its artists, then its year and its file's format. */
export const Track: Story = {
    args: {
        title: 'Get Lucky',
        subtitle: 'Daft Punk, Pharrell Williams, Nile Rodgers',
        meta: '2013',
        quality: 'FLAC 24-bit',
        href: undefined,
        onClick: () => undefined,
    },
};

/** An artist: the name, then a fact only when the grid is sorted by one; the rows stay reserved, empty. */
export const Artist: Story = {
    args: {
        noMaker: true,
        title: 'Ada Okoro',
        subtitle: undefined,
        meta: undefined,
        artwork: <Artwork alt="" fallback={<MicVocalIcon />} />,
    },
};

/** A book: its title, its author, then its file's format — not "Ebook" on every card of a catalog of ebooks. */
export const Book: Story = {
    args: {
        title: 'The Cartographer’s Daughter',
        subtitle: 'Helena Marsh',
        meta: undefined,
        quality: 'PDF',
        presentation: 'poster',
        artwork: <BookCover alt="" title="The Cartographer’s Daughter" author="Helena Marsh" seed="cartographer" />,
    },
};

export const Audiobook: Story = {
    args: {
        ...Book.args,
        title: 'Northbound Static',
        subtitle: 'Iris Calloway',
        quality: 'M4A',
        artwork: <BookCover alt="" title="Northbound Static" author="Iris Calloway" seed="northbound" />,
    },
};

/** A playlist or a photo album: its name, then how much it holds; it has no maker, so its empty row comes last. */
export const Collection: Story = {
    args: {
        noMaker: true,
        title: 'Late drives',
        subtitle: undefined,
        meta: '24 songs',
        artwork: <Artwork alt="" fallback={<ListMusicIcon />} />,
    },
};

/** A photo: its title, then when it was taken, and its reserved row last. */
export const Photo: Story = {
    args: {
        noMaker: true,
        title: 'Harbour at dusk',
        subtitle: undefined,
        meta: '12 Aug 2024, 19:42',
        artwork: album('lar-harbour'),
    },
};

/** A person in a cast: a round portrait over their name and their role, two rows (a cast is not a catalog grid). */
export const Person: Story = {
    args: {
        title: 'Greta Lee',
        subtitle: 'Nora',
        meta: undefined,
        presentation: 'person',
        artwork: <Avatar name="Greta Lee" />,
        href: '/people/greta-lee',
    },
};

/** An episode: its number and title over a still, its director, then its air date and length. */
export const Episode: Story = {
    args: {
        title: '1. Good News About Hell',
        subtitle: 'Ben Stiller',
        meta: '18 Feb 2022 · 57 min',
        artwork: <Artwork alt="" aspect="video" src="https://picsum.photos/seed/lar-episode/480/270" />,
    },
    render: (args) => (
        <div className="w-64">
            <ImageCard {...args} />
        </div>
    ),
};

/** The card open now, such as the one a panel beside its grid shows. */
export const Selected: Story = { ...Episode, args: { ...Episode.args, selected: true } };

/** The keyboard's focus rings the whole card. */
export const Focused: Story = {
    play: ({ canvasElement }) => canvasElement.querySelector<HTMLElement>('a')?.focus(),
};

/** A button instead of a link, for a card that opens something in place. */
export const Clickable: Story = { args: { href: undefined, onClick: () => undefined } };

export const Static: Story = { args: { href: undefined } };

/** One line whatever the length: the rest is clipped, and the whole title shows on hover and to screen readers. */
export const LongTitle: Story = {
    args: {
        title: 'Sgt. Pepper’s Lonely Hearts Club Band (Super Deluxe Edition, 2017 Remix)',
        subtitle: 'The Beatles, George Martin, Giles Martin',
        meta: '1967 · Super Deluxe Edition',
    },
};

/** No art: the kind's icon takes its place. */
export const MissingArt: Story = { args: { artwork: <Artwork alt="" fallback={<Disc3Icon />} /> } };

/** A file name with no year or director: the maker row stays empty and the meta row holds the quality alone. */
export const NoYear: Story = {
    args: {
        ...Movie.args,
        title: 'harbour_footage_2009_FINAL',
        subtitle: undefined,
        meta: undefined,
        quality: '720p',
        artwork: poster(),
    },
};

/** No quality to show: the year alone, the row's height unchanged. */
export const NoQuality: Story = { args: { ...Movie.args, quality: undefined } };

/** Lar is updating it: the meta row says so in place of its facts, adding no line. */
export const Updating: Story = {
    args: {
        status: 'Updating details…',
        artwork: (
            <Artwork
                alt=""
                src="https://picsum.photos/seed/lar-ram/300/300"
                fallback={<Disc3Icon />}
                loadingLabel="Updating Random Access Memories"
            />
        ),
    },
};

/** Loading: the art's shape and the caption's three rows, so cards don't grow when they arrive. */
export const Loading: Story = {
    render: () => (
        <div className="flex gap-4">
            <div className="w-44">
                <ImageCard loading />
            </div>
            <div className="w-44">
                <ImageCard loading aspect="poster" />
            </div>
            <div className="w-64">
                <ImageCard loading aspect="video" />
            </div>
        </div>
    ),
};

function Shelf({ children }: { children: ReactNode }) {
    return (
        <div className="grid max-w-4xl grid-cols-[repeat(auto-fill,minmax(9rem,1fr))] gap-x-4 gap-y-5">{children}</div>
    );
}

/** A shelf of albums: long and short titles, a missing year, missing art and one updating, all ending level. */
export const AlbumGrid: Story = {
    render: () => (
        <Shelf>
            {(
                [
                    ['Coastal Drift', 'The Mariner Collective', '2019'],
                    ['Late Night Transmissions, Vol. 2', 'Various Artists', '2021'],
                    ['Night Ferry', 'The Mariner Collective', '2020 · Deluxe edition'],
                    ['Hollow Pines', 'Hollow Pines', undefined],
                    ['Symphonies for Small Rooms, Unfinished', 'Glasshouse Orchestra', '2018'],
                    ['Tidewater Hymns', 'Juniper Vale', '2023', 'Updating details…'],
                ] as const
            ).map(([title, artist, year, status], index) => (
                <ImageCard
                    key={title}
                    title={title}
                    subtitle={artist}
                    meta={year}
                    status={status}
                    artwork={index === 3 ? <Artwork alt="" fallback={<Disc3Icon />} /> : album(`lar-shelf-${index}`)}
                    href={`/music/albums/${index}`}
                    onNavigate={() => undefined}
                />
            ))}
        </Shelf>
    ),
};

/** A shelf of movies: the director, then the year and the quality on one line; a missing value leaves its row. */
export const MovieGrid: Story = {
    render: () => (
        <Shelf>
            {(
                [
                    ['Glass Orchard', 'Mireille Okafor', '2017', '1080p'],
                    ['harbour_footage_2009_FINAL', undefined, undefined, '720p'],
                    ['Midnight at the Observatory of Small Hours and Distant Lights', 'Tobias Wren', '2024', '4K HDR'],
                    ['Northbound Static', 'Anselm Brook', '2015', undefined],
                    ['The Cartographer’s Daughter', 'Tobias Wren', '2021', '4K'],
                    ['The Lantern Keeper', 'Tobias Wren', '2023', '1080p', 'Updating details…'],
                ] as const
            ).map(([title, director, year, quality, status], index) => (
                <ImageCard
                    key={title}
                    title={title}
                    subtitle={director}
                    meta={year}
                    quality={quality}
                    status={status}
                    presentation="poster"
                    artwork={poster(index % 3 === 1 ? undefined : `lar-poster-${index}`)}
                    href={`/movies/${index}`}
                    onNavigate={() => undefined}
                />
            ))}
        </Shelf>
    ),
};

/** Photo albums: the name, then how many photos; with no maker, the reserved row is the last. */
export const PhotoAlbumGrid: Story = {
    render: () => (
        <Shelf>
            {(['Lisbon, spring', 'Family', 'Screenshots', 'An album with a very long name indeed'] as const).map(
                (title, index) => (
                    <ImageCard
                        key={title}
                        title={title}
                        meta={`${index * 37 + 1} photos`}
                        noMaker
                        artwork={
                            index === 2 ? <Artwork alt="" fallback={<ImagesIcon />} /> : album(`lar-photos-${index}`)
                        }
                        href={`/photos/${index}`}
                        onNavigate={() => undefined}
                    />
                ),
            )}
        </Shelf>
    ),
};

/**
 * Every kind on one shelf — album, movie, show, book, audiobook, artist, photo album, photo and a loading card: one
 * caption of three rows each, so cards end level whichever grid they are in.
 */
export const EveryKind: Story = {
    render: () => (
        <Shelf>
            <ImageCard {...meta.args} />
            <ImageCard {...meta.args} {...(Movie.args as ImageCardProps)} />
            <ImageCard {...meta.args} {...(Show.args as ImageCardProps)} />
            <ImageCard {...meta.args} {...(Book.args as ImageCardProps)} />
            <ImageCard {...meta.args} {...(Audiobook.args as ImageCardProps)} />
            <ImageCard {...meta.args} {...(Artist.args as ImageCardProps)} />
            <ImageCard
                {...meta.args}
                {...(Collection.args as ImageCardProps)}
                title="Lisbon, spring"
                meta="124 photos"
                artwork={<Artwork alt="" fallback={<ImagesIcon />} />}
            />
            <ImageCard {...meta.args} {...(Photo.args as ImageCardProps)} />
            <ImageCard loading />
        </Shelf>
    ),
};
