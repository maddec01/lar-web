import type { Meta, StoryObj } from '@storybook/react-vite';

import { BadgeList } from './BadgeList';

const meta = {
    title: 'Display/BadgeList',
    component: BadgeList,
    args: {
        label: 'Genres',
        items: [
            { id: 'sci-fi', label: 'Science Fiction' },
            { id: 'drama', label: 'Drama' },
            { id: 'mystery', label: 'Mystery' },
            { id: 'thriller', label: 'Thriller' },
        ],
    },
    decorators: [
        (Story) => (
            <div className="max-w-sm">
                <Story />
            </div>
        ),
    ],
} satisfies Meta<typeof BadgeList>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** Struck items read as warnings: here, audio tracks the player can’t decode. */
export const WithStruckItems: Story = {
    args: {
        label: 'Audio tracks',
        items: [
            { id: 'aac', label: 'English · AAC 5.1' },
            { id: 'truehd', label: 'English · Dolby TrueHD Atmos', struck: true },
            { id: 'dts', label: 'Portuguese · DTS-HD MA', struck: true },
            { id: 'ac3', label: 'Commentary · AC3 2.0' },
        ],
    },
};

export const LongLabels: Story = {
    args: {
        label: 'Collections',
        items: [
            { id: 'a', label: 'Criterion Collection: Essential Japanese Cinema of the 1950s and 1960s' },
            { id: 'b', label: 'Family movie night' },
            { id: 'c', label: 'Watched in the cinema and bought on Blu-ray afterwards because it was that good' },
        ],
    },
};

export const Empty: Story = { args: { items: [] } };
