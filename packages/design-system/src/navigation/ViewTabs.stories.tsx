import type { Meta, StoryObj } from '@storybook/react-vite';
import { type ComponentProps, useState } from 'react';
import { fn } from 'storybook/test';

import { Input } from '../forms/Input';
import { ViewTabs } from './ViewTabs';

function ViewTabsDemo(args: ComponentProps<typeof ViewTabs<string>>) {
    const [value, setValue] = useState(args.value);

    return (
        <ViewTabs
            {...args}
            value={value}
            onChange={(next) => {
                setValue(next);
                args.onChange(next);
            }}
        />
    );
}

const meta = {
    title: 'Navigation/ViewTabs',
    component: ViewTabs<string>,
    args: {
        label: 'Music',
        value: 'albums',
        items: [
            { value: 'albums', label: 'Albums', count: '1,284' },
            { value: 'artists', label: 'Artists', count: '412' },
            { value: 'tracks', label: 'Tracks', count: '18,903' },
            { value: 'playlists', label: 'Playlists', count: '27' },
        ],
        onChange: fn(),
    },
    render: (args) => <ViewTabsDemo {...args} />,
} satisfies Meta<typeof ViewTabs<string>>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithoutCounts: Story = {
    args: {
        label: 'Job history',
        value: 'running',
        items: [
            { value: 'running', label: 'Running' },
            { value: 'queued', label: 'Queued' },
            { value: 'finished', label: 'Finished' },
            { value: 'failed', label: 'Failed' },
        ],
    },
};

/** A search beside the tabs on wide screens, below them on narrow ones. */
export const WithSearch: Story = {
    args: { end: <Input aria-label="Search music" placeholder="Search music" type="search" size="sm" /> },
};

/** Many tabs scroll sideways. */
export const Overflowing: Story = {
    args: {
        label: 'Libraries',
        value: 'music',
        items: [
            'Music',
            'Movies',
            'TV shows',
            'Photos',
            'Books',
            'Audiobooks',
            'Podcasts',
            'Home videos',
            'Comics',
        ].map((label, index) => ({
            value: label.toLowerCase().replace(/\W+/g, '-'),
            label,
            count: String((index + 3) * 137),
        })),
    },
    decorators: [
        (Story) => (
            <div className="max-w-md">
                <Story />
            </div>
        ),
    ],
};
