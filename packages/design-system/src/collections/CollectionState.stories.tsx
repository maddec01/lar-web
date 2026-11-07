import type { Meta, StoryObj } from '@storybook/react-vite';
import { FolderPlusIcon, ImageOffIcon, SearchXIcon, ServerCrashIcon } from 'lucide-react';
import { fn } from 'storybook/test';

import { CollectionState } from './CollectionState';

const meta = {
    title: 'Collections/CollectionState',
    component: CollectionState,
    args: {
        variant: 'page',
        icon: <FolderPlusIcon />,
        title: 'No libraries yet',
        description: 'Add a folder of music, movies, TV shows, photos or books and Lar will organise it for you.',
        actionLabel: 'Add library',
        onAction: fn(),
    },
} satisfies Meta<typeof CollectionState>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Empty: Story = {};

export const NoResults: Story = {
    args: {
        icon: <SearchXIcon />,
        title: 'No albums match “bossa”',
        description: 'Try another spelling or clear the genre filter.',
        actionLabel: 'Clear filters',
    },
};

export const LoadFailed: Story = {
    args: {
        icon: <ServerCrashIcon />,
        title: 'Could not load movies',
        description: 'The server did not respond. Check that Lar Server is running, then try again.',
        actionLabel: 'Retry',
    },
};

export const WithoutAction: Story = {
    args: {
        icon: <ImageOffIcon />,
        title: 'No photos from 2003',
        description: 'Photos appear here once their dates are read.',
        actionLabel: undefined,
    },
};

/** A dashed frame outlining the content that will fill the region. */
export const Framed: Story = { args: { variant: 'framed' } };

/** Fits inside a panel or popover. */
export const Compact: Story = {
    args: {
        variant: 'compact',
        icon: <SearchXIcon />,
        title: 'No matches',
        description: 'Nothing in Recent matches your search.',
        actionLabel: undefined,
    },
};

/** Sits among dashboard content with the same surface. */
export const Panel: Story = {
    args: {
        variant: 'panel',
        title: 'No jobs running',
        description: 'Scans, matching and transcodes appear here while they run.',
        icon: undefined,
        actionLabel: undefined,
    },
    decorators: [
        (Story) => (
            <div className="max-w-md">
                <Story />
            </div>
        ),
    ],
};

export const LongContent: Story = {
    args: {
        variant: 'framed',
        title: 'This catalog’s folder moved or was renamed while the server was offline for maintenance',
        description:
            'Lar last saw “Family photos” at /mnt/media/photos/family on 2 November 2026. Point the catalog at its new folder to keep albums, favourites and people you have already tagged; nothing is deleted in the meantime.',
        actionLabel: 'Choose new folder',
    },
};
