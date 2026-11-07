import type { Meta, StoryObj } from '@storybook/react-vite';
import { CircleDotIcon, GitBranchIcon } from 'lucide-react';
import { useState } from 'react';
import { fn } from 'storybook/test';

import { FormSelect } from './FormSelect';

const choices = [
    { value: 'main', name: 'main', icon: <GitBranchIcon /> },
    { value: 'release', name: 'release', icon: <GitBranchIcon /> },
    { value: 'legacy', name: 'legacy (archived)', icon: <CircleDotIcon />, disabled: true },
];

const meta = {
    title: 'Forms/FormSelect',
    component: FormSelect,
    args: { 'aria-label': 'Base branch', value: '', onChange: fn(), choices, placeholder: 'Choose a branch' },
    render: function Render(args) {
        const [value, setValue] = useState(args.value);

        return (
            <div className="w-72">
                <FormSelect
                    {...args}
                    value={value}
                    onChange={(next) => {
                        setValue(next);
                        args.onChange(next);
                    }}
                />
            </div>
        );
    },
} satisfies Meta<typeof FormSelect>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Placeholder: Story = {};

export const Picked: Story = { args: { value: 'main' } };

/** A "none" choice empties the value, which the form reads as an empty string. */
export const WithNone: Story = { args: { none: 'No default' } };

export const Disabled: Story = { args: { value: 'main', disabled: true } };

/** A settings row's 11rem dropdown, which writes at once on a pick. */
export const Setting: Story = { args: { value: 'release', presentation: 'setting', writesOnPick: true } };
