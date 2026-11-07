import type { Meta, StoryObj } from '@storybook/react-vite';
import { type ComponentProps, useState } from 'react';
import { fn } from 'storybook/test';

import { CollectionViewToggle } from './CollectionViewToggle';

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
