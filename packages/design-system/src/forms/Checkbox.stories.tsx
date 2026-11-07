import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';

import { Checkbox } from './Checkbox';

const meta = {
    title: 'Forms/Checkbox',
    component: Checkbox,
    args: { label: 'Include hidden files', onChange: fn() },
} satisfies Meta<typeof Checkbox>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Checked: Story = { args: { defaultChecked: true, label: 'Fetch album artwork' } };

/** Some, not all, of a group: the parent of a partial selection. */
export const Indeterminate: Story = { args: { indeterminate: true, label: 'Select all 24 tracks' } };

export const Disabled: Story = { args: { disabled: true, label: 'Transcode to Opus (needs ffmpeg)' } };

export const DisabledChecked: Story = { args: { disabled: true, defaultChecked: true, label: 'Read tags from files' } };

/** Without a label the checkbox needs an accessible name, as in a table row. */
export const WithoutLabel: Story = { args: { label: undefined, 'aria-label': 'Select Blackstar' } };

export const LongLabel: Story = {
    args: {
        label: 'Rescan every library when the server starts, including network shares that may take several minutes to mount',
    },
    render: (args) => (
        <div className="max-w-xs">
            <Checkbox {...args} />
        </div>
    ),
};

/** Every state side by side, for comparing them in light and dark. */
export const AllStates: Story = {
    render: (args) => (
        <div className="flex flex-col gap-3">
            <Checkbox {...args} label="Unchecked" />
            <Checkbox {...args} label="Checked" defaultChecked />
            <Checkbox {...args} label="Indeterminate" indeterminate />
            <Checkbox {...args} label="Disabled" disabled />
            <Checkbox {...args} label="Disabled, checked" disabled defaultChecked />
        </div>
    ),
};
