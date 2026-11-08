import type { Meta, StoryObj } from '@storybook/react-vite';
import { Disc3Icon, FilmIcon, TvIcon } from 'lucide-react';

import { Artwork } from './Artwork';
import { darkTitleLogo, lightTitleLogo } from './titleLogoFixtures';

const meta = {
    title: 'Media/Artwork',
    component: Artwork,
    args: {
        alt: 'Cover of Random Access Memories',
        aspect: 'square',
        src: 'https://picsum.photos/seed/lar-album/400/400',
        fallback: <Disc3Icon />,
    },
    render: (args) => (
        <div className={args.aspect === 'video' ? 'w-80' : 'w-48'}>
            <Artwork {...args} />
        </div>
    ),
} satisfies Meta<typeof Artwork>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Square: Story = {};

export const Poster: Story = {
    args: {
        alt: 'Poster for Arrival',
        aspect: 'poster',
        src: 'https://picsum.photos/seed/lar-poster/400/600',
        fallback: <FilmIcon />,
    },
};

export const Video: Story = {
    args: {
        alt: 'Still from Severance, season 2 episode 1',
        aspect: 'video',
        src: 'https://picsum.photos/seed/lar-still/640/360',
        fallback: <TvIcon />,
    },
};

export const Placeholder: Story = { args: { src: undefined } };

export const Failed: Story = { args: { src: undefined, error: true, errorLabel: 'Cover couldn’t be loaded' } };

export const Pending: Story = { args: { src: undefined, pendingLabel: 'Fetching cover…' } };

export const LoadingWithIndicator: Story = { args: { src: undefined, loadingLabel: 'Saving cover…' } };

export const Editable: Story = {
    args: { src: undefined, editAction: { label: 'Change cover', onClick: () => undefined } },
};

export const Viewable: Story = { args: { viewAction: { label: 'Enlarge cover', onClick: () => undefined } } };

/** Every aspect, each in its placeholder state, side by side. */
export const Aspects: Story = {
    render: (args) => (
        <div className="flex flex-wrap items-start gap-4">
            {(['square', 'poster', 'video', 'logo'] as const).map((aspect) => (
                <div key={aspect} className="w-40">
                    <Artwork {...args} aspect={aspect} src={undefined} />
                    <p className="text-fg-muted mt-2 text-xs">{aspect}</p>
                </div>
            ))}
        </div>
    ),
};

/** Real transparent light and dark Lar logos on the same theme-independent transparency stage. */
export const TransparentLogos: Story = {
    render: () => (
        <div className="flex max-w-2xl flex-wrap gap-4">
            {[lightTitleLogo, darkTitleLogo].map((src, index) => (
                <div key={src} className="w-64">
                    <Artwork alt={index ? 'Lar, dark ink' : 'Lar, light ink'} aspect="logo" src={src} />
                </div>
            ))}
        </div>
    ),
};
