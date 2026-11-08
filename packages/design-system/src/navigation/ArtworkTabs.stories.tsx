import type { Meta, StoryObj } from '@storybook/react-vite';
import { type ComponentProps, useState } from 'react';
import { fn } from 'storybook/test';

import { ArtworkTabs, type ArtworkTabsItem } from './ArtworkTabs';

function Poster({ hue, label }: { hue: number; label: string }) {
    return (
        <div
            aria-hidden="true"
            className="text-3xs flex aspect-[2/3] items-end p-1 leading-tight font-semibold text-white"
            style={{ background: `linear-gradient(160deg, hsl(${hue} 55% 45%), hsl(${hue + 40} 60% 20%))` }}
        >
            {label}
        </div>
    );
}

const seasons: ArtworkTabsItem<string>[] = Array.from({ length: 6 }, (_, index) => ({
    value: `season-${index + 1}`,
    label: `Season ${index + 1}`,
    caption: `${[13, 13, 13, 13, 16, 10][index]} episodes · ${2008 + index}`,
    artwork: <Poster hue={20 + index * 45} label={`S${index + 1}`} />,
}));

function ArtworkTabsDemo(args: ComponentProps<typeof ArtworkTabs<string>>) {
    const [value, setValue] = useState(args.value);

    return (
        <div className="max-w-2xl">
            <ArtworkTabs
                {...args}
                value={value}
                onChange={(next) => {
                    setValue(next);
                    args.onChange(next);
                }}
            />
        </div>
    );
}

const meta = {
    title: 'Navigation/ArtworkTabs',
    component: ArtworkTabs<string>,
    args: { label: 'Seasons', items: seasons, value: 'season-1', onChange: fn() },
    render: (args) => <ArtworkTabsDemo {...args} />,
} satisfies Meta<typeof ArtworkTabs<string>>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Seasons: Story = {};

/** The selected tab scrolls into view, here the last season of a long run. */
export const SelectedOffscreen: Story = { args: { value: 'season-6' } };

export const Loading: Story = { args: { loading: true, loadingLabel: 'Loading seasons' } };

export const LongLabels: Story = {
    args: {
        items: [
            {
                value: 'specials',
                label: 'Specials, behind the scenes and deleted scenes',
                caption: '24 extras from the collector’s edition box set',
                artwork: <Poster hue={280} label="SP" />,
            },
            ...seasons.slice(0, 2),
        ],
        value: 'specials',
    },
};

export const WithoutCaptions: Story = {
    args: { items: seasons.map(({ caption: _caption, ...item }) => item) },
};
