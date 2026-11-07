import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { fn } from 'storybook/test';

import { OptionSelect } from './OptionSelect';

type Quality = 'original' | 'high' | 'medium' | 'low';

const qualities = [
    { value: 'original', label: 'Original' },
    { value: 'high', label: 'High (320 kbps)' },
    { value: 'medium', label: 'Medium (192 kbps)' },
    { value: 'low', label: 'Low (96 kbps)', disabled: true },
] as const satisfies readonly { value: Quality; label: string; disabled?: boolean }[];

/** The loaded select's props; the loading state is its own story. */
interface OptionSelectArgs {
    disabled?: boolean;
    label: string;
    onChange: (value: Quality) => void;
    options: typeof qualities;
    value: Quality;
}

const meta = {
    title: 'Forms/OptionSelect',
    component: OptionSelect,
    args: { label: 'Streaming quality', value: 'original', options: qualities, onChange: fn() },
    render: (args) => (
        <div className="max-w-xs">
            <OptionSelect {...args} />
        </div>
    ),
} satisfies Meta<OptionSelectArgs>;

export default meta;

type Story = StoryObj<typeof meta>;

/** Controlled from the `value` control; disabled options stay visible but cannot be chosen. */
export const Default: Story = {};

export const Disabled: Story = { args: { disabled: true } };

/** While the options load, a control-shaped skeleton holds the place. */
export const Loading: Story = {
    render: () => (
        <div className="max-w-xs">
            <OptionSelect label="Streaming quality" loading />
        </div>
    ),
};

function InteractiveOptionSelect({ onChange }: { onChange: (value: Quality) => void }) {
    const [value, setValue] = useState<Quality>('high');

    return (
        <OptionSelect
            label="Streaming quality"
            value={value}
            options={qualities}
            onChange={(next) => {
                setValue(next);
                onChange(next);
            }}
        />
    );
}

/** Keeps its own value, so choosing an option updates it. */
export const Interactive: Story = {
    render: (args) => (
        <div className="max-w-xs">
            <InteractiveOptionSelect onChange={args.onChange} />
        </div>
    ),
};
