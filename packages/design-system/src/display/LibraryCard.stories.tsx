import type { Meta, StoryObj } from '@storybook/react-vite';
import { BookOpenIcon, FilmIcon, MoreHorizontalIcon, MusicIcon, TvIcon } from 'lucide-react';
import type { ComponentProps, ReactNode } from 'react';
import { fn } from 'storybook/test';

import { IconButton } from '../actions/IconButton';
import { ProgressStatusRow } from '../feedback/ProgressStatusRow';
import { Grid } from '../layout/Flow';
import { Artwork } from '../media/Artwork';
import { BookCover } from '../media/BookCover';
import { HeadingBase, TextBase } from '../typography/Typography';
import { LibraryCard, LibraryCardSkeleton } from './LibraryCard';

/** A deterministic cover for the stories: a gradient and a few shapes from a seed, as lar-server's sample draws. */
function cover(seed: number, aspect: 'square' | 'poster') {
    const hue = (seed * 67) % 360;
    const width = 200;
    const height = aspect === 'square' ? 200 : 300;
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="hsl(${hue} 55% 38%)"/><stop offset="1" stop-color="hsl(${(hue + 50) % 360} 60% 18%)"/></linearGradient></defs><rect width="100%" height="100%" fill="url(#g)"/><circle cx="${60 + (seed % 5) * 20}" cy="${height * 0.42}" r="${34 + (seed % 3) * 10}" fill="hsl(${(hue + 180) % 360} 80% 70% / .85)"/><rect x="0" y="${height * 0.72}" width="100%" height="${height * 0.28}" fill="hsl(${hue} 40% 10% / .35)"/></svg>`;

    return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

interface Library {
    name: string;
    icon: ReactNode;
    summary: string;
    aspect: 'square' | 'poster';
    covers: number;
    books?: boolean;
    stats: { value: string; label: string }[];
    status: ComponentProps<typeof ProgressStatusRow>;
}

/** lar-server's sample catalogs, in every state a dashboard shows. */
const libraries: Library[] = [
    {
        name: 'Music',
        icon: <MusicIcon />,
        summary: '12 albums · 94 tracks',
        aspect: 'square',
        covers: 6,
        stats: [
            { value: '12', label: 'albums' },
            { value: '94', label: 'tracks' },
        ],
        status: {
            status: 'running',
            label: 'Comparing with Lidarr',
            count: '7 of 12 albums',
            progress: { value: 7, max: 12 },
        },
    },
    {
        name: 'Vinyl Rips',
        icon: <MusicIcon />,
        summary: '2 albums · 15 tracks',
        aspect: 'square',
        covers: 2,
        stats: [
            { value: '2', label: 'albums' },
            { value: '15', label: 'tracks' },
        ],
        status: { status: 'running', label: 'Finding files', count: '634 files found · 135 new' },
    },
    {
        name: 'Field Recordings',
        icon: <MusicIcon />,
        summary: 'No albums yet',
        aspect: 'square',
        covers: 0,
        stats: [],
        status: { state: 'off', label: 'Turned off', secondaryDetail: 'Scanned Sep 29, 1:20 PM' },
    },
    {
        name: 'Movies',
        icon: <FilmIcon />,
        summary: '7 movies',
        aspect: 'poster',
        covers: 7,
        stats: [{ value: '7', label: 'movies' }],
        status: {
            status: 'running',
            label: 'Title enrichment',
            count: '5 of 7 titles',
            progress: { value: 5, max: 7 },
        },
    },
    {
        name: 'Documentaries',
        icon: <FilmIcon />,
        summary: 'No movies yet',
        aspect: 'poster',
        covers: 0,
        stats: [],
        status: { status: 'failed', label: 'File scan', statusLabel: 'Failed', reason: 'Folder not found' },
    },
    {
        name: 'Kids TV',
        icon: <TvIcon />,
        summary: 'No shows yet',
        aspect: 'poster',
        covers: 0,
        stats: [],
        status: { status: 'queued', label: 'File scan', statusLabel: 'Queued' },
    },
    {
        name: 'TV Shows',
        icon: <TvIcon />,
        summary: '2 shows · 11 episodes',
        aspect: 'poster',
        covers: 2,
        stats: [
            { value: '2', label: 'shows' },
            { value: '11', label: 'episodes' },
        ],
        status: {
            status: 'failed',
            label: 'Metadata',
            statusLabel: 'Failed',
            reason: 'Lar couldn’t read “The Quiet Harbour/Season 01/The Quiet Harbour - S01E04 - Low Tide.mkv”.',
        },
    },
    {
        name: 'Audiobooks',
        icon: <BookOpenIcon />,
        summary: '2 editions',
        aspect: 'poster',
        covers: 2,
        books: true,
        stats: [{ value: '2', label: 'editions' }],
        status: {
            state: 'off',
            label: 'Cancelled',
            reason: 'The last scan stopped before it finished',
            secondaryDetail: 'Scanned Nov 6',
        },
    },
    {
        name: 'Books',
        icon: <BookOpenIcon />,
        summary: '6 editions',
        aspect: 'poster',
        covers: 6,
        books: true,
        stats: [{ value: '6', label: 'editions' }],
        status: { status: 'done', label: 'Up to date', secondaryDetail: 'Scanned Nov 7, 12:20 PM · Found changes' },
    },
];

const bookTitles = [
    'The Salt Road',
    'Harbour Lights',
    'A Field Guide to Rain',
    'Winter Orchard',
    'Nine Bridges',
    'Tin',
];

function covers(library: Library, offset = 0) {
    return Array.from({ length: library.covers }, (_, index) =>
        library.books ? (
            <BookCover
                key={index}
                alt=""
                title={bookTitles[index % bookTitles.length]!}
                author="Marta Ventura"
                seed={`${library.name}${index}`}
            />
        ) : (
            <Artwork
                key={index}
                alt=""
                aspect={library.aspect}
                src={cover(index + offset + library.name.length, library.aspect)}
            />
        ),
    );
}

const menu = (name: string) => (
    <IconButton aria-label={`More actions for ${name}`} icon={<MoreHorizontalIcon />} onClick={fn()} />
);

const status = (library: Library) => (
    <ProgressStatusRow {...library.status} layout="line" onDetails={fn()} detailsLabel="Show scan details" />
);

function card(library: Library) {
    return (
        <LibraryCard
            key={library.name}
            title={<a href={`#${library.name}`}>{library.name}</a>}
            summary={library.summary}
            icon={library.icon}
            artwork={covers(library)}
            artworkAspect={library.aspect}
            actions={menu(library.name)}
            status={status(library)}
        />
    );
}

const meta = {
    title: 'Display/LibraryCard',
    component: LibraryCard,
    args: {
        title: <a href="#music">Music</a>,
        summary: '12 albums · 94 tracks',
        icon: <MusicIcon />,
        artwork: covers(libraries[0]!),
        actions: menu('Music'),
        status: status(libraries[0]!),
    },
    render: (args) => (
        <div className="max-w-md">
            <LibraryCard {...args} />
        </div>
    ),
} satisfies Meta<typeof LibraryCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** Films, shows and books stand as posters. */
export const Posters: Story = {
    args: {
        title: <a href="#movies">Movies</a>,
        summary: '7 movies',
        icon: <FilmIcon />,
        artwork: covers(libraries[3]!),
        artworkAspect: 'poster',
        status: status(libraries[3]!),
    },
};

/** An empty library keeps the card's anatomy: blank covers with its kind's icon, and what it waits for. */
export const Empty: Story = {
    args: {
        title: <a href="#kids-tv">Kids TV</a>,
        summary: 'No shows yet',
        icon: <TvIcon />,
        artwork: [],
        artworkAspect: 'poster',
        status: status(libraries[5]!),
    },
};

/** A library with only a couple of covers keeps the shelf's slots: blank covers fill the rest, so it reads as the
 *  start of a shelf rather than a gap. */
export const PartFilled: Story = {
    args: {
        title: <a href="#vinyl">Vinyl Rips</a>,
        summary: '2 albums · 15 tracks',
        artwork: covers({ ...libraries[0]!, covers: 2 }),
    },
};

/** A long name and a long failure stay one line each; every card keeps one height. */
export const LongContent: Story = {
    args: {
        title: <a href="#field">Field Recordings from the 2019 Lisbon trip (lossless masters)</a>,
        status: status(libraries[6]!),
    },
};

/** The dashboard's grid: every state, one anatomy, one height per row. */
export const Overview: Story = {
    render: () => <Grid variant="overview">{libraries.map(card)}</Grid>,
};

/** At a phone's width. */
export const Narrow: Story = {
    render: () => <div className="flex w-90 flex-col gap-3">{libraries.slice(0, 5).map(card)}</div>,
};

export const Loading: Story = {
    render: () => (
        <Grid variant="overview">
            <LibraryCardSkeleton />
            <LibraryCardSkeleton />
            <LibraryCardSkeleton />
        </Grid>
    ),
};

/* Explorations for the dashboard's catalog cards (kept for the design review; LibraryCard is the chosen one). */

/** B · No artwork: the name leads, figures on one baseline, an empty library says so, the state in a footer band. */
function StatsCard({ library }: { library: Library }) {
    return (
        <article className="surface-card flex min-w-0 flex-col overflow-hidden rounded-xl border">
            <div className="flex items-start gap-3 p-4">
                <span className="bg-surface-sunken border-line text-fg-muted flex size-10 shrink-0 items-center justify-center rounded-lg border [&_svg]:size-5">
                    {library.icon}
                </span>
                <div className="min-w-0 flex-1">
                    <HeadingBase as="h3" variant="title" className="truncate">
                        {library.name}
                    </HeadingBase>
                    {library.stats.length ? (
                        <div className="mt-2 flex items-baseline gap-5">
                            {library.stats.map((stat) => (
                                <span key={stat.label} className="flex items-baseline gap-1.5">
                                    <span className="text-fg text-2xl leading-none font-semibold tabular-nums">
                                        {stat.value}
                                    </span>
                                    <TextBase as="span" variant="caption" tone="muted">
                                        {stat.label}
                                    </TextBase>
                                </span>
                            ))}
                        </div>
                    ) : (
                        <TextBase as="p" variant="caption" tone="muted" className="mt-2 leading-6">
                            {library.summary}
                        </TextBase>
                    )}
                </div>
                {menu(library.name)}
            </div>
            <div className="border-line bg-surface-sunken mt-auto border-t px-4 py-3">{status(library)}</div>
        </article>
    );
}

/** C · Banner: the newest artwork edge to edge behind the name, the state under it. */
function BannerCard({ library }: { library: Library }) {
    return (
        <article className="surface-card flex min-w-0 flex-col overflow-hidden rounded-xl border">
            <div className="bg-surface-sunken relative flex h-40 overflow-hidden">
                {library.covers ? (
                    <div className="flex h-full [&_*]:rounded-none [&>div]:h-full [&>div]:shrink-0">
                        {covers(library).map((art, index) => (
                            <div key={index} className={library.aspect === 'square' ? 'w-40' : 'w-27'}>
                                {art}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-fg-muted/50 flex w-full items-center justify-center [&_svg]:size-10">
                        {library.icon}
                    </div>
                )}
                <div className="absolute inset-0 bg-linear-to-t from-black/75 via-black/20 to-transparent" />
                <div className="absolute inset-x-4 bottom-3 flex items-end justify-between gap-3 text-white">
                    <div className="min-w-0">
                        <p className="truncate text-base font-semibold">{library.name}</p>
                        <p className="truncate text-xs text-white/75">{library.summary}</p>
                    </div>
                </div>
            </div>
            <div className="px-4 py-3">{status(library)}</div>
        </article>
    );
}

/** The three explorations side by side: A (LibraryCard, a shelf of covers), B (figures, no artwork) and C (a
 *  banner of artwork behind the name). */
export const Variants: Story = {
    parameters: { layout: 'fullscreen' },
    render: () => (
        <div className="flex flex-col gap-8 p-6">
            {(
                [
                    ['A · Shelf of covers (LibraryCard)', (library: Library) => card(library)],
                    [
                        'B · Figures, no artwork',
                        (library: Library) => <StatsCard key={library.name} library={library} />,
                    ],
                    ['C · Artwork banner', (library: Library) => <BannerCard key={library.name} library={library} />],
                ] as const
            ).map(([name, render]) => (
                <section key={name} className="flex flex-col gap-3">
                    <HeadingBase as="h2" variant="title">
                        {name}
                    </HeadingBase>
                    <Grid variant="overview">{libraries.slice(0, 6).map(render)}</Grid>
                </section>
            ))}
        </div>
    ),
};
