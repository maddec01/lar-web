import type { Meta, StoryObj } from '@storybook/react-vite';
import { FolderGitIcon } from 'lucide-react';

import { Artwork } from '../media/Artwork';
import { Identity } from './Identity';

const meta = {
    title: 'Display/Identity',
    component: Identity,
    args: {
        artwork: <Artwork alt="" src="https://picsum.photos/seed/lar-ok/200/200" />,
        title: 'OK Computer',
        detail: 'Radiohead · 1997 · 12 tracks',
        tag: 'FLAC',
    },
    decorators: [
        (Story) => (
            <div className="max-w-md">
                <Story />
            </div>
        ),
    ],
} satisfies Meta<typeof Identity>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Album: Story = {};

export const Poster: Story = {
    args: {
        presentation: 'poster',
        artwork: <Artwork alt="" aspect="poster" src="https://picsum.photos/seed/lar-sev/200/300" />,
        title: 'Severance',
        detail: 'Season 2 · 10 episodes',
        tag: 'Apple TV+',
    },
};

/** Heads its page: a larger poster, an overline and the title as the page’s h1. */
export const PageHeading: Story = {
    args: {
        presentation: 'poster',
        overline: 'Fix metadata',
        artwork: <Artwork alt="" aspect="poster" src="https://picsum.photos/seed/lar-arrival/200/300" />,
        title: 'Arrival',
        detail: '2016 · Denis Villeneuve',
        tag: undefined,
    },
};

export const IconArtwork: Story = {
    args: {
        artwork: <Artwork alt="" fallback={<FolderGitIcon />} />,
        title: 'lar-web',
        detail: 'github.com/lar-works/lar-web · main',
        tag: 'Factory',
    },
};

export const LongText: Story = {
    args: {
        title: 'The Rise and Fall of Ziggy Stardust and the Spiders from Mars (2012 Remaster, 40th Anniversary)',
        detail: 'David Bowie · 1972 · 11 tracks · FLAC 24/96 · Imported from /mnt/media/music/lossless',
    },
};
