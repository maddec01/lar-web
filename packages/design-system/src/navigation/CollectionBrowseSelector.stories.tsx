import type { Meta, StoryObj } from '@storybook/react-vite';
import { ArrowDownUpIcon, DiscIcon, FilterIcon } from 'lucide-react';
import { useState } from 'react';
import { fn } from 'storybook/test';

import { DropdownMenu } from '../overlays/DropdownMenu';
import {
    CollectionBrowseControls,
    CollectionBrowseSelector,
    CollectionBrowseTrigger,
} from './CollectionBrowseSelector';

const sorts = [
    ['title', 'Title'],
    ['artist', 'Artist'],
    ['year', 'Release year'],
    ['added', 'Recently added'],
] as const;

function SortItems({ value, onChange }: { value: string; onChange: (value: string) => void }) {
    return (
        <DropdownMenu.RadioGroup value={value} onValueChange={onChange}>
            {sorts.map(([id, label]) => (
                <DropdownMenu.RadioItem key={id} value={id}>
                    {label}
                </DropdownMenu.RadioItem>
            ))}
        </DropdownMenu.RadioGroup>
    );
}

function SortSelector() {
    const [sort, setSort] = useState('added');

    return (
        <CollectionBrowseSelector label={sorts.find(([id]) => id === sort)![1]} icon={<ArrowDownUpIcon />}>
            <SortItems value={sort} onChange={setSort} />
        </CollectionBrowseSelector>
    );
}

const meta = {
    title: 'Navigation/CollectionBrowseSelector',
    component: CollectionBrowseSelector,
    args: { label: 'All albums', children: null },
    render: (args) => (
        <CollectionBrowseSelector {...args}>
            <DropdownMenu.Item onSelect={fn()}>All albums</DropdownMenu.Item>
            <DropdownMenu.Item onSelect={fn()}>Live albums</DropdownMenu.Item>
            <DropdownMenu.Item onSelect={fn()}>Compilations</DropdownMenu.Item>
            <DropdownMenu.Separator />
            <DropdownMenu.Item onSelect={fn()}>Unmatched</DropdownMenu.Item>
        </CollectionBrowseSelector>
    ),
} satisfies Meta<typeof CollectionBrowseSelector>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** With an icon the label hides on narrow screens; `active` marks a filter that narrows the list. */
export const ActiveWithIcon: Story = { args: { label: 'Live albums', icon: <FilterIcon />, active: true } };

export const Triggers: Story = {
    render: () => (
        <div className="flex flex-wrap items-center gap-2">
            <CollectionBrowseTrigger label="All albums" />
            <CollectionBrowseTrigger label="Jazz" active />
            <CollectionBrowseTrigger label="Release year" icon={<ArrowDownUpIcon />} />
            <CollectionBrowseTrigger label="Blue Note" icon={<DiscIcon />} active />
        </div>
    ),
};

/** The toolbar above a collection: what it shows, how many, then its sort. */
export const Controls: Story = {
    render: () => (
        <div className="flex max-w-3xl">
            <CollectionBrowseControls count="1,284" countLabel="1,284 albums" filters={<SortSelector />}>
                <CollectionBrowseSelector label="All albums">
                    <DropdownMenu.Item>All albums</DropdownMenu.Item>
                    <DropdownMenu.Item>Live albums</DropdownMenu.Item>
                </CollectionBrowseSelector>
            </CollectionBrowseControls>
        </div>
    ),
};

export const ControlsWithLongCount: Story = {
    render: () => (
        <div className="flex max-w-sm">
            <CollectionBrowseControls count="128,904,113" countLabel="128,904,113 photos" filters={<SortSelector />}>
                <CollectionBrowseSelector label="Photos from every connected device and shared library" active>
                    <DropdownMenu.Item>All photos</DropdownMenu.Item>
                </CollectionBrowseSelector>
            </CollectionBrowseControls>
        </div>
    ),
};
