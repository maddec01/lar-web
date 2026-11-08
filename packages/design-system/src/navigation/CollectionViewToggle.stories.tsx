import type { Meta, StoryObj } from '@storybook/react-vite';
import { ListChecksIcon, MapIcon } from 'lucide-react';
import { type ComponentProps, useState } from 'react';
import { fn } from 'storybook/test';

import { CollectionViewToggle, ViewToggle } from './CollectionViewToggle';

function CollectionViewToggleDemo(args: ComponentProps<typeof CollectionViewToggle>) {
    const [value, setValue] = useState(args.value);

    return (
        <CollectionViewToggle
            {...args}
            value={value}
            onChange={(view) => {
                setValue(view);
                args.onChange(view);
            }}
        />
    );
}

const meta = {
    title: 'Navigation/CollectionViewToggle',
    component: CollectionViewToggle,
    args: { label: 'View', gridLabel: 'Grid', tableLabel: 'Table', value: 'grid', onChange: fn() },
    render: (args) => <CollectionViewToggleDemo {...args} />,
} satisfies Meta<typeof CollectionViewToggle>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Grid: Story = {};

export const Table: Story = { args: { value: 'table' } };

/** Photos only make sense as a grid. */
export const TableDisabled: Story = { args: { disabledViews: ['table'] } };

function MapOrList({ size }: { size?: 'sm' | 'md' }) {
    const [value, setValue] = useState<'map' | 'list'>('map');

    return (
        <ViewToggle
            size={size}
            value={value}
            onChange={setValue}
            options={[
                { value: 'map', label: 'Work map', icon: <MapIcon /> },
                { value: 'list', label: 'Parts list', icon: <ListChecksIcon /> },
            ]}
        />
    );
}

/** Any views, as Lar Factory’s board draws a dossier as a Work map or a parts list; compact in a row’s line. */
export const OtherViews: Story = {
    render: () => (
        <div className="flex items-center gap-4">
            <MapOrList />
            <MapOrList size="sm" />
        </div>
    ),
};

function Panes() {
    const [value, setValue] = useState<'new' | 'pick'>('new');

    return (
        <ViewToggle
            presentation="text"
            label="Add"
            value={value}
            onChange={setValue}
            options={[
                { value: 'new', label: 'New work', attributes: { 'data-pane': 'new' } },
                { value: 'pick', label: 'Find a ticket', attributes: { 'data-pane': 'pick' } },
            ]}
        />
    );
}

/** Text options, as Lar Factory’s Add item dialog switches between its panes in its header. */
export const TextOptions: Story = { render: () => <Panes /> };

/** Text segments keep full labels and reveal the chosen segment within the row. */
export const NarrowTextOptions: Story = {
    render: () => (
        <div className="w-64">
            <ViewToggle
                label="Metadata"
                presentation="text"
                value="background"
                onChange={() => {}}
                options={[
                    { value: 'details', label: 'Details' },
                    { value: 'match', label: 'Match' },
                    { value: 'poster', label: 'Poster' },
                    { value: 'background', label: 'Background' },
                ]}
            />
        </div>
    ),
};
