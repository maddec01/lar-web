import type { Meta, StoryObj } from '@storybook/react-vite';

import { CollectionSectionHeader } from './CollectionSectionHeader';

/** Starts a run of rows in a collection, such as the albums under one letter. */
const meta = {
    title: 'Collections/CollectionSectionHeader',
    component: CollectionSectionHeader,
    args: { children: 'M' },
    decorators: [
        (Story) => (
            <div className="border-line max-w-2xl overflow-hidden rounded-xl border">
                <Story />
            </div>
        ),
    ],
} satisfies Meta<typeof CollectionSectionHeader>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Letter: Story = {};

export const Year: Story = { args: { children: '2019' } };

export const LongLabel: Story = { args: { children: 'Recently added from /mnt/media/music/incoming' } };
