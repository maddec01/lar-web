import type { Meta, StoryObj } from '@storybook/react-vite';
import { Disc3Icon, FilmIcon, MoreHorizontalIcon, PencilIcon, PlayIcon, PlusIcon } from 'lucide-react';
import type { ComponentProps } from 'react';

import { Button } from '../actions/Button';
import { IconButton } from '../actions/IconButton';
import { Artwork } from '../media/Artwork';
import { RatingLink } from '../media/RatingLink';
import { brightBackdrop, lightTitleLogo } from '../media/titleLogoFixtures';
import { Link } from '../typography/Link';
import { DetailHero, DetailHeroDetail, DetailHeroDetails, DetailHeroTags } from './DetailHero';
import { TextPreview } from './TextPreview';

const overview =
    'Paul Atreides unites with Chani and the Fremen while on a warpath of revenge against the conspirators who destroyed his family. Facing a choice between the love of his life and the fate of the known universe, he endeavors to prevent a terrible future only he can foresee.';

const details = (
    <>
        <DetailHeroDetails>
            <DetailHeroDetail label="Released" value="2024" />
            <DetailHeroDetail label="Runtime" value="2h 46m" />
            <DetailHeroDetail
                label="Rating"
                value={
                    <RatingLink source="IMDb" value="8.5" scale="/ 10" href="https://www.imdb.com/title/tt15239678/" />
                }
            />
            <DetailHeroTags
                label="Genres"
                moreLabel="+3"
                values={['Science Fiction', 'Adventure', 'Drama', 'Action']}
            />
            <DetailHeroTags label="Director" moreLabel="+1" values={['Denis Villeneuve']} />
        </DetailHeroDetails>
        <TextPreview title="Dune: Part Two" moreLabel="More" value={overview} />
    </>
);

// The loaded variant of the props, so stories' args and controls match it; the loading state has its own story.
type DetailHeroProps = Extract<ComponentProps<typeof DetailHero>, { title: string }>;

const meta = {
    title: 'Display/DetailHero',
    component: DetailHero,
    args: {
        label: 'Movie',
        title: 'Dune: Part Two',
        subtitle: 'Long live the fighters.',
        artwork: (
            <Artwork
                alt="Poster for Dune: Part Two"
                aspect="poster"
                src="https://picsum.photos/seed/lar-dune/400/600"
                fallback={<FilmIcon />}
            />
        ),
        actions: (
            <>
                <Button leftIcon={<PlayIcon />}>Play</Button>
                <Button variant="secondary" leftIcon={<PlusIcon />}>
                    Add to collection
                </Button>
            </>
        ),
        children: details,
    },
    render: (args) => <DetailHero {...args} />,
} satisfies Meta<DetailHeroProps>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Movie: Story = {};

export const WithBackground: Story = {
    args: { backgroundSrc: 'https://picsum.photos/seed/lar-dune-backdrop/1280/720' },
};

export const WithSummary: Story = {
    args: {
        label: 'Album',
        title: 'Kind of Blue',
        subtitle: 'Miles Davis · 1959',
        summary: 'Recorded in two sessions at Columbia’s 30th Street Studio; the best-selling jazz record of all time.',
        artwork: <Artwork alt="Cover of Kind of Blue" src="https://picsum.photos/seed/lar-kob/400/400" />,
        children: (
            <DetailHeroDetails>
                <DetailHeroDetail label="Tracks" value="5" />
                <DetailHeroDetail label="Length" value="45:44" />
                <DetailHeroDetail label="Format" value="FLAC 24/192" />
            </DetailHeroDetails>
        ),
    },
};

/** A long plot on a wide page keeps a reading measure (about 70 characters a line) instead of running edge to edge. */
export const WithSynopsis: Story = {
    args: {
        synopsis:
            'Paul Atreides unites with Chani and the Fremen while on a warpath of revenge against the conspirators who destroyed his family. Facing a choice between the love of his life and the fate of the known universe, he endeavours to prevent a terrible future only he can foresee, as the great houses gather on Arrakis and the Emperor’s legions close in on the desert.',
    },
    parameters: { layout: 'fullscreen' },
};

/** A film with no poster keeps its 2:3 frame, its kind's icon in place of the image, as its card in a grid does. */
export const NoArtwork: Story = {
    args: { artwork: <Artwork alt="" aspect="poster" fallback={<FilmIcon />} />, actions: undefined },
};

/** An album with no cover keeps its square frame. */
export const NoCover: Story = {
    args: {
        ...WithSummary.args,
        artwork: <Artwork alt="" fallback={<Disc3Icon />} />,
    },
};

export const LongTitle: Story = {
    args: {
        title: 'The Lord of the Rings: The Return of the King — Extended Edition, Remastered',
        subtitle: 'There can be no triumph without loss. No victory without suffering. No freedom without sacrifice.',
    },
};

export const Loading: Story = {
    render: () => <DetailHero loading loadingLabel="Loading movie" summary description details={4} />,
};

// A white title logo, as fanart.tv’s clear logos are drawn for dark backdrops.
const whiteLogo = `data:image/svg+xml,${encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="640" height="200" viewBox="0 0 640 200"><g fill="#fff" font-family="Georgia, serif" font-size="80" font-weight="700"><text x="0" y="84" textLength="460" lengthAdjust="spacingAndGlyphs">THE LANTERN</text><text x="0" y="180" textLength="300" lengthAdjust="spacingAndGlyphs">KEEPER</text></g></svg>',
)}`;

/** A white logo over a pale backdrop in the light theme: the hero takes a dark stage in both themes so it stays
 *  readable. */
export const WhiteLogoOnPaleBackdrop: Story = {
    args: {
        title: 'The Lantern Keeper',
        subtitle: '2023 · 2h 8m · Drama, Mystery · 4K Dolby Vision',
        titleLogoSrc: whiteLogo,
        backgroundSrc: `data:image/svg+xml,${encodeURIComponent(
            '<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="720"><defs><radialGradient id="g" cx="0.5" cy="0.1" r="0.9"><stop offset="0" stop-color="#fffbe6"/><stop offset="1" stop-color="#a9dcdc"/></radialGradient></defs><rect width="1280" height="720" fill="url(#g)"/></svg>',
        )}`,
    },
};

// Title logos as sources often deliver them: lettering in the middle of a wide transparent canvas.
const paddedLogo = `data:image/svg+xml,${encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="400" viewBox="0 0 1200 400"><g text-anchor="middle" fill="#fff" font-family="Georgia, serif" font-size="110" font-weight="700" letter-spacing="4"><text x="600" y="190">COPPER &amp;</text><text x="600" y="300">PINE</text></g></svg>',
)}`;
const longPaddedLogo = `data:image/svg+xml,${encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="400" viewBox="0 0 1200 400"><text x="600" y="228" text-anchor="middle" fill="#fff" font-family="Georgia, serif" font-size="78" font-weight="700" letter-spacing="4">THE LANTERN KEEPER</text></svg>',
)}`;

/** A logo with wide transparent margins is sized by its visible lettering, so the label, title and facts sit close
 *  together instead of around an empty box. */
export const PaddedLogo: Story = {
    args: { title: 'Copper & Pine', label: 'TV show', subtitle: '2020 · 28 min · Comedy', titleLogoSrc: paddedLogo },
};

/** A logo so wide its lettering would be smaller than the heading falls back to the text title, on the same stage. */
export const WideLogoFallsBackToText: Story = {
    args: { titleLogoSrc: longPaddedLogo },
};

/** A logo that fails to load falls back to the text title. */
export const BrokenLogo: Story = {
    args: { titleLogoSrc: 'https://invalid.example/logo.png' },
};

/** Under 40rem the cover sits beside the identity, and the facts past the first two wait behind “All details”. */
export const NarrowAlbum: Story = {
    globals: { viewport: { value: 'mobile1' } },
    args: {
        label: 'Album',
        title: 'Tidewater Hymns',
        actions: (
            <>
                <IconButton aria-label="Edit album" icon={<PencilIcon />} />
                <IconButton aria-label="More album actions" icon={<MoreHorizontalIcon />} />
            </>
        ),
        subtitle: 'Juniper Vale',
        summary: '10 January 2021 · 10 tracks · 42:04',
        artwork: <Artwork alt="Cover of Tidewater Hymns" src="https://picsum.photos/seed/lar-tidewater/400/400" />,
        children: (
            <DetailHeroDetails moreLabel="All details" lessLabel="Fewer details">
                <DetailHeroTags label="Genre" moreLabel="+1 more" values={['indie folk', 'chamber pop']} />
                <DetailHeroDetail label="Record label" value={<Link href="#label">Lighthouse Records</Link>} />
                <DetailHeroDetail label="Format" value="Digital Media" />
                <DetailHeroDetail label="Country" value="Europe" />
                <DetailHeroDetail label="Catalog number" value="LIG-100" />
                <DetailHeroDetail label="Barcode" value="5004400000000" />
                <DetailHeroDetail label="Quality" value="FLAC · 16 bit · 44.1 kHz" />
            </DetailHeroDetails>
        ),
    },
};

/** A track has no artwork of its own: the identity takes the full width. */
export const WithoutArtwork: Story = {
    args: { artwork: null, actions: undefined, children: null },
};

/** A near-white/yellow/cyan backdrop exercises the worst contrast case in both themes. */
export const BrightBackdrop: Story = {
    args: {
        backgroundSrc: brightBackdrop,
        subtitle: '2024 · 2 h 46 min · Science fiction · 4K',
        titleLogoSrc: lightTitleLogo,
    },
};
