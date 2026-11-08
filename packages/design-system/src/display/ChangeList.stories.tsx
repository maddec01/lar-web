import type { Meta, StoryObj } from '@storybook/react-vite';

import { ChangeList } from './ChangeList';

const meta = {
    title: 'Display/ChangeList',
    component: ChangeList,
    args: {
        label: 'Metadata changes',
        items: [
            {
                key: 'album',
                title: 'In Rainbows',
                changes: [
                    { key: 'year', label: 'Year', from: '2008', to: '2007' },
                    { key: 'label', label: 'Label', from: 'XL Recordings', to: 'Self-released' },
                ],
            },
            {
                key: 'track-4',
                title: '4. Weird Fishes/Arpeggi',
                changes: [{ key: 'title', label: 'Title', from: 'Weird Fishes / Arpeggi', to: 'Weird Fishes/Arpeggi' }],
            },
        ],
    },
    decorators: [
        (Story) => (
            <div className="max-w-lg">
                <Story />
            </div>
        ),
    ],
} satisfies Meta<typeof ChangeList>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const SingleChange: Story = {
    args: {
        items: [
            {
                key: 'movie',
                title: 'Blade Runner 2049',
                changes: [{ key: 'edition', label: 'Edition', from: 'Theatrical', to: 'IMAX' }],
            },
        ],
    },
};

export const LongValues: Story = {
    args: {
        label: 'Path changes',
        items: [
            {
                key: 'library',
                title: 'Music library on the NAS with an unusually long and descriptive name',
                changes: [
                    {
                        key: 'path',
                        label: 'Path',
                        from: '/mnt/storage/media/music/lossless/archive/2019-and-earlier',
                        to: '/srv/lar/libraries/music/lossless/archive/2019-and-earlier',
                        kind: 'code',
                    },
                ],
            },
        ],
    },
};

/** People's words (names, titles) read in the reading font; a machine's values (paths, ids) sit on code chips. */
export const TextAndCode: Story = {
    args: {
        items: [
            {
                key: 'track-1',
                title: '01 - Station Identification.flac',
                changes: [
                    { key: 'album-artist', label: 'Album artist', from: '(empty)', to: 'Various Artists' },
                    {
                        key: 'mbid',
                        label: 'MusicBrainz release',
                        from: '(empty)',
                        to: '5b11f4ce-a62d-471e-81fc-a69a8278c7da',
                        kind: 'code',
                    },
                ],
            },
        ],
    },
};
