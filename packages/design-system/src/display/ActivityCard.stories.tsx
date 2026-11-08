import type { Meta, StoryObj } from '@storybook/react-vite';
import { BookOpenIcon, FilmIcon, MusicIcon } from 'lucide-react';

import { Artwork } from '../media/Artwork';
import { ActivityCard, ActivityCardSkeleton } from './ActivityCard';
import { Badge } from './Badge';

const cover = (hue: number) =>
    `data:image/svg+xml,${encodeURIComponent(
        `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="hsl(${hue} 45% 45%)"/><circle cx="50" cy="50" r="28" fill="hsl(${hue} 55% 70%)"/></svg>`,
    )}`;

const meta = {
    title: 'Display/ActivityCard',
    component: ActivityCard,
    args: {
        title: 'Kind of Blue',
        subtitle: 'Miles Davis · So What',
        detail: 'Ana on Living Room Speaker',
        artwork: <Artwork alt="" src={cover(215)} fallback={<MusicIcon />} />,
        badges: (
            <>
                <Badge tone="success">Direct play</Badge>
                <Badge>FLAC 24/96</Badge>
            </>
        ),
    },
    decorators: [
        (Story) => (
            <div className="max-w-md">
                <Story />
            </div>
        ),
    ],
} satisfies Meta<typeof ActivityCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playing: Story = {};

export const Transcoding: Story = {
    args: {
        title: 'Dune: Part Two',
        subtitle: '2024 · 2h 46m',
        detail: 'Rui on Bedroom TV',
        artwork: <Artwork alt="" aspect="poster" src={cover(30)} fallback={<FilmIcon />} />,
        badges: (
            <>
                <Badge tone="warning">Transcoding</Badge>
                <Badge>4K → 1080p</Badge>
                <Badge tone="info">Subtitles burned in</Badge>
            </>
        ),
    },
};

export const IconArtwork: Story = {
    args: {
        title: 'Project Hail Mary',
        subtitle: 'Andy Weir · Chapter 12',
        detail: 'Marta on iPad',
        artwork: <Artwork alt="" fallback={<BookOpenIcon />} />,
        badges: <Badge>Reading</Badge>,
    },
};

export const Compact: Story = { args: { size: 'sm' } };

export const LongText: Story = {
    args: {
        title: 'The Lord of the Rings: The Return of the King (Extended Edition, Remastered Director’s Cut)',
        subtitle: 'Peter Jackson · Disc 2 of 2 · Chapter 47: The Grey Havens and everything that follows',
        detail: 'A very long user name on a device with an equally long name in the guest room',
    },
};

export const Loading: Story = { render: () => <ActivityCardSkeleton /> };
