import type { Meta, StoryObj } from '@storybook/react-vite';
import { Disc3Icon, FilmIcon } from 'lucide-react';
import type { ComponentProps } from 'react';

import { Artwork } from './Artwork';
import { Avatar } from './Avatar';
import { ImageCard } from './ImageCard';

// The loaded variant of the props, so stories' args and controls match it; the loading state has its own story.
type ImageCardProps = Extract<ComponentProps<typeof ImageCard>, { title: string }>;

const meta = {
    title: 'Display/ImageCard',
    component: ImageCard,
    args: {
        title: 'Random Access Memories',
        subtitle: 'Daft Punk',
        detail: '2013',
        artwork: <Artwork alt="" src="https://picsum.photos/seed/lar-ram/300/300" fallback={<Disc3Icon />} />,
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

export const Album: Story = {};

export const TitleDetail: Story = { args: { titleDetail: 'Deluxe Edition' } };

export const Poster: Story = {
    args: {
        title: 'Past Lives',
        subtitle: '2023',
        detail: undefined,
        presentation: 'poster',
        artwork: (
            <Artwork
                alt=""
                aspect="poster"
                src="https://picsum.photos/seed/lar-past-lives/300/450"
                fallback={<FilmIcon />}
            />
        ),
        href: '/movies/past-lives',
    },
};

export const Person: Story = {
    args: {
        title: 'Greta Lee',
        subtitle: 'Nora',
        detail: undefined,
        presentation: 'person',
        artwork: <Avatar name="Greta Lee" />,
        href: '/people/greta-lee',
    },
};

/** A button instead of a link, for a card that opens something in place. */
export const Clickable: Story = { args: { href: undefined, onClick: () => undefined } };

export const Static: Story = { args: { href: undefined } };

export const LongTitle: Story = {
    args: {
        title: 'Sgt. Pepper’s Lonely Hearts Club Band (Super Deluxe Edition, 2017 Remix)',
        subtitle: 'The Beatles',
    },
};

export const Loading: Story = {
    render: () => (
        <div className="flex gap-4">
            <div className="w-44">
                <ImageCard loading />
            </div>
            <div className="w-44">
                <ImageCard loading aspect="poster" textRows={3} />
            </div>
        </div>
    ),
};

/** A shelf of cards, as on a library page. */
export const Grid: Story = {
    render: () => (
        <div className="grid max-w-3xl grid-cols-[repeat(auto-fill,minmax(9rem,1fr))] gap-4">
            {['Abbey Road', 'Blue', 'Rumours', 'Pet Sounds', 'Remain in Light', 'Hounds of Love'].map(
                (title, index) => (
                    <ImageCard
                        key={title}
                        title={title}
                        subtitle="Album"
                        artwork={
                            <Artwork
                                alt=""
                                src={`https://picsum.photos/seed/lar-shelf-${index}/300/300`}
                                fallback={<Disc3Icon />}
                            />
                        }
                        href={`/music/albums/${index}`}
                        onNavigate={() => undefined}
                    />
                ),
            )}
        </div>
    ),
};
