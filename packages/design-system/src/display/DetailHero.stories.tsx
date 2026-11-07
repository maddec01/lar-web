import type { Meta, StoryObj } from '@storybook/react-vite';
import { FilmIcon, PlayIcon, PlusIcon } from 'lucide-react';
import type { ComponentProps } from 'react';

import { Button } from '../actions/Button';
import { Artwork } from './Artwork';
import { DetailHero, DetailHeroDetail, DetailHeroDetails, DetailHeroTags } from './DetailHero';
import { RatingLink } from './RatingLink';
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

export const NoArtwork: Story = {
    args: { artwork: <Artwork alt="" aspect="poster" fallback={<FilmIcon />} />, actions: undefined },
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
