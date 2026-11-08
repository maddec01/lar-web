import type { Meta, StoryObj } from '@storybook/react-vite';

import { PathList } from './PathList';

const meta = {
    title: 'Display/PathList',
    component: PathList,
    args: {
        label: 'Library folders',
        paths: [
            { key: 'movies', path: '/mnt/media/movies' },
            { key: 'tv', path: '/mnt/media/tv' },
            { key: 'nas', path: '//nas.local/share/video/Movies (4K)' },
        ],
    },
    decorators: [
        (Story) => (
            <div className="max-w-sm">
                <Story />
            </div>
        ),
    ],
} satisfies Meta<typeof PathList>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** Paths longer than their container truncate; the full path is in the title. */
export const LongPaths: Story = {
    args: {
        label: 'Changed files',
        paths: [
            { key: '1', path: 'packages/design-system/src/display/Badge.tsx' },
            {
                key: '2',
                path: '/mnt/media/music/lossless/Pink Floyd/Wish You Were Here (2011 Immersion Box Set)/Disc 2/05 Shine On You Crazy Diamond.flac',
            },
        ],
    },
};
