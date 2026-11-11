import type { Meta, StoryObj } from '@storybook/react-vite';
import { ArchiveIcon, FilmIcon, FolderPlusIcon, ImageOffIcon, PlayIcon, SearchXIcon } from 'lucide-react';
import { fn } from 'storybook/test';

import { Button } from '../actions/Button';
import { BrandMark } from '../display/BrandMark';
import { InsetPanel } from '../display/InsetPanel';
import { StepList } from '../display/StepList';
import { EmptyState } from './EmptyState';

const meta = {
    title: 'Feedback/EmptyState',
    component: EmptyState,
    args: {
        size: 'page',
        icon: <FolderPlusIcon />,
        title: 'No catalogs yet',
        description: 'Add a folder of music, movies, TV shows, photos or books and Lar will organise it for you.',
        primaryAction: { label: 'Add catalog', onAction: fn() },
    },
} satisfies Meta<typeof EmptyState>;

export default meta;

type Story = StoryObj<typeof meta>;

/** An empty page region with the way to fill it. */
export const Page: Story = {};

/** A first run's steps under the message: the list reads left-aligned, and its block is centred under the title and
 *  actions, never at the column's edge. */
export const WithStepsFooter: Story = {
    args: {
        footer: (
            <StepList
                steps={[
                    'Add a catalog for a folder of music, films or books.',
                    'Lar reads the files and matches them online.',
                    'Open Lar on your devices and sign in to this server.',
                ]}
            />
        ),
    },
};

export const WithSecondaryAction: Story = {
    args: {
        icon: <FilmIcon />,
        title: 'No movies yet',
        description: 'Movies appear here once their metadata has been read. Scanning can take a few minutes.',
        primaryAction: { label: 'Scan now', onAction: fn() },
        secondaryAction: { label: 'Catalog settings', href: '#settings' },
    },
};

export const NoResults: Story = {
    args: {
        icon: <SearchXIcon />,
        title: 'No albums match “bossa”',
        description: 'Try another spelling or clear the genre filter.',
        primaryAction: undefined,
        secondaryAction: { label: 'Clear filters', onAction: fn() },
    },
};

export const WithoutAction: Story = {
    args: {
        icon: <ImageOffIcon />,
        title: 'No photos from 2003',
        description: 'Photos appear here once their dates are read.',
        primaryAction: undefined,
    },
};

/** A quiet card among dashboard content, on the same surface. */
export const Panel: Story = {
    args: {
        size: 'panel',
        icon: <PlayIcon />,
        title: 'Nothing playing',
        description: 'Whatever is played on this server shows up here.',
        primaryAction: undefined,
    },
};

export const PanelWithAction: Story = {
    args: { size: 'panel' },
};

/** An empty settings or archive list: centred in the list’s own panel, with the add action where the rows would be. */
export const Compact: Story = {
    args: {
        size: 'compact',
        icon: <FolderPlusIcon />,
        title: 'No catalogs yet',
        description: 'Add a folder of music, movies or shows and Lar reads what is in it.',
        primaryAction: { label: 'Add catalog', onAction: fn() },
    },
    decorators: [
        (Story) => (
            <div className="max-w-xl">
                <InsetPanel presentation="settings">
                    <Story />
                </InsetPanel>
            </div>
        ),
    ],
};

/** An empty archive: nothing to act on, so no action. */
export const CompactWithoutAction: Story = {
    args: {
        size: 'compact',
        icon: <ArchiveIcon />,
        title: 'Nothing archived',
        description: 'Items you archive from the board are kept here.',
        primaryAction: undefined,
    },
    decorators: Compact.decorators,
};

/** Fits inside a panel, popover or drawer. */
export const Inline: Story = {
    args: {
        size: 'inline',
        icon: <SearchXIcon />,
        title: 'No matches',
        description: 'Nothing in Recent matches your search.',
        primaryAction: undefined,
    },
    decorators: [
        (Story) => (
            <div className="border-line bg-surface-raised max-w-xs rounded-lg border">
                <Story />
            </div>
        ),
    ],
};

/** An app's first run owning its page, the hero on the app's scale: the mark on the product's halo, a 22/600 title, a
 *  14/400 sentence, `md` buttons and the steps under them, as lar-server's dashboard before its first catalog. */
export const Start: Story = {
    args: {
        size: 'start',
        product: 'server',
        artwork: <BrandMark label="Lar" size="lg" />,
        icon: undefined,
        title: 'Let’s set up your server',
        description: 'Lar plays what’s in the folders you give it. Three steps and it’s ready.',
        secondaryAction: { label: 'Invite user', onAction: fn() },
        footer: (
            <StepList
                steps={[
                    'Add a catalog: a folder of music, movies, TV shows or books.',
                    'Lar scans it on its own. Its first scan shows here as it goes.',
                    'Invite people and connect the Lar apps to start playing.',
                ]}
            />
        ),
    },
};

/** A website's page owned by one message, such as a missing page. */
export const Hero: Story = {
    args: {
        size: 'hero',
        title: 'Welcome to Lar',
        description: 'Add your first catalog to start building your library. Everything stays on this server.',
        secondaryAction: { label: 'Read the guide', href: '#guide' },
    },
};

/** The same hero on Factory's amber halo, with an action of the caller’s own, as Lar Factory’s empty board. */
export const FactoryFirstRun: Story = {
    args: {
        size: 'start',
        product: 'factory',
        artwork: <BrandMark label="Lar" size="lg" />,
        icon: undefined,
        title: 'Add your first Project',
        description: 'Connect a Project to see its work and start agents from this board.',
        primaryAction: undefined,
        actions: <Button>Add a Project</Button>,
    },
};

export const LongContent: Story = {
    args: {
        title: 'This catalog’s folder moved or was renamed while the server was offline for maintenance',
        description:
            'Lar last saw “Family photos” at /mnt/media/photos/family on 2 November 2026. Point the catalog at its new folder to keep albums, favourites and people you have already tagged; nothing is deleted in the meantime.',
        primaryAction: { label: 'Choose new folder', onAction: fn() },
    },
};

/** One unboxed row inside a section. */
export const SectionRow: Story = {
    args: {
        size: 'inline',
        icon: undefined,
        title: 'No credits left',
        description: undefined,
        primaryAction: undefined,
    },
};
