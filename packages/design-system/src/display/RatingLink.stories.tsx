import type { Meta, StoryObj } from '@storybook/react-vite';

import { RatingLink } from './RatingLink';

const meta = {
    title: 'Display/RatingLink',
    component: RatingLink,
    args: { source: 'IMDb', value: '8.5', scale: '/ 10', href: 'https://www.imdb.com/title/tt15239678/' },
} satisfies Meta<typeof RatingLink>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Imdb: Story = {};

export const Trakt: Story = {
    args: { source: 'Trakt', value: '86%', scale: undefined, href: 'https://trakt.tv/movies/dune-part-two-2024' },
};

export const UnknownSource: Story = {
    args: { source: 'Letterboxd', value: '4.4', scale: '/ 5', href: 'https://letterboxd.com/film/dune-part-two/' },
};

/** Every known source, as in a movie's details. */
export const Sources: Story = {
    render: () => (
        <div className="flex flex-wrap items-center gap-5">
            <RatingLink source="IMDb" value="8.5" scale="/ 10" href="https://www.imdb.com/title/tt15239678/" />
            <RatingLink source="Trakt" value="86%" href="https://trakt.tv/movies/dune-part-two-2024" />
            <RatingLink
                source="Rotten Tomatoes Critics"
                value="92%"
                href="https://www.rottentomatoes.com/m/dune_part_two"
            />
            <RatingLink
                source="Rotten Tomatoes Audience"
                value="95%"
                href="https://www.rottentomatoes.com/m/dune_part_two"
            />
            <RatingLink source="Letterboxd" value="4.4" scale="/ 5" href="https://letterboxd.com/film/dune-part-two/" />
        </div>
    ),
};
