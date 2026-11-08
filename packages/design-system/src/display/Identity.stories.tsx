import type { Meta, StoryObj } from '@storybook/react-vite';
import { FolderGitIcon } from 'lucide-react';

import { Identity } from './Identity';

/** A picture filling the artwork's frame. */
const picture = (seed: string, height = 200) => (
    <img alt="" src={`https://picsum.photos/seed/${seed}/200/${height}`} className="size-full object-cover" />
);

const meta = {
    title: 'Display/Identity',
    component: Identity,
    args: {
        artwork: picture('lar-ok'),
        title: 'Quarterly report',
        detail: 'Finance · 2026 · 12 pages',
        tag: 'PDF',
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

export const Default: Story = {};

export const Poster: Story = {
    args: {
        presentation: 'poster',
        artwork: picture('lar-sev', 300),
        title: 'Field guide',
        detail: 'Second edition · 10 chapters',
        tag: 'Draft',
    },
};

/** Heads its page: a larger poster, an overline and the title as the page’s h1. */
export const PageHeading: Story = {
    args: {
        presentation: 'poster',
        overline: 'Edit details',
        artwork: picture('lar-arrival', 300),
        title: 'Field guide',
        detail: '2026 · Ana Silva',
        tag: undefined,
    },
};

export const IconArtwork: Story = {
    args: {
        artwork: (
            <span className="bg-fill-muted text-fg-muted flex size-full items-center justify-center [&>svg]:size-6">
                <FolderGitIcon />
            </span>
        ),
        title: 'lar-web',
        detail: 'github.com/lar-works/lar-web · main',
        tag: 'Repository',
    },
};
