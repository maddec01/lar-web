import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';

import { SegmentedControl } from './SegmentedControl';
import { SettingsRow } from './SettingsRow';

const meta = {
    title: 'Forms/SegmentedControl',
    component: SegmentedControl,
    args: {
        'aria-label': 'Router forwarding',
        value: 'automatic',
        onValueChange: () => {},
        options: [
            { value: 'automatic', label: 'Set up automatically' },
            { value: 'manual', label: 'Configure manually' },
        ],
    },
    render: function Render(args) {
        const [value, setValue] = useState(args.value);

        return <SegmentedControl {...args} value={value} onValueChange={setValue} />;
    },
} satisfies Meta<typeof SegmentedControl<string>>;

export default meta;

type Story = StoryObj<typeof meta>;

/** Two choices that buttons would otherwise fake: the chosen one raised, in a field's height. */
export const Default: Story = {};

export const ThreeChoices: Story = {
    args: {
        'aria-label': 'Quality',
        value: 'auto',
        options: [
            { value: 'auto', label: 'Automatic' },
            { value: 'original', label: 'Original' },
            { value: 'saver', label: 'Data saver' },
        ],
    },
};

export const WithDisabledChoice: Story = {
    args: {
        options: [
            { value: 'automatic', label: 'Set up automatically' },
            { value: 'manual', label: 'Configure manually' },
            { value: 'off', label: 'Off', disabled: true },
        ],
    },
};

export const Disabled: Story = { args: { disabled: true } };

/** In a settings row, beside the setting it answers, named by the row's title. */
export const InSettingsRow: Story = {
    render: function Render(args) {
        const [value, setValue] = useState(args.value);

        return (
            <div className="max-w-2xl">
                <SettingsRow
                    layout="flow"
                    label="Router forwarding"
                    description="Choose how to open the external port on your router."
                >
                    <SegmentedControl {...args} aria-label="Router forwarding" value={value} onValueChange={setValue} />
                </SettingsRow>
            </div>
        );
    },
};
