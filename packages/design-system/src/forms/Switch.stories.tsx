import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';

import { Switch } from './Switch';

const meta = {
    title: 'Forms/Switch',
    component: Switch,
    args: { label: 'Share this library with guests', onCheckedChange: fn() },
} satisfies Meta<typeof Switch>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Off: Story = {};

export const On: Story = { args: { defaultChecked: true, label: 'Automatic library scans' } };

/** While the change is being saved. */
export const Loading: Story = { args: { defaultChecked: true, loading: true, label: 'Hardware transcoding' } };

export const Invalid: Story = { args: { invalid: true, label: 'Expose the server to the internet' } };

export const Disabled: Story = { args: { disabled: true, label: 'Remote access (needs a domain)' } };

export const LabelAtStart: Story = { args: { labelPosition: 'start', label: 'Run pipelines on every push' } };

/** Without a visible label the switch needs an accessible name, as in a settings row. */
export const WithoutLabel: Story = { args: { label: undefined, 'aria-label': 'Deploy on merge' } };

/** Every state side by side, for comparing them in light and dark. */
export const AllStates: Story = {
    render: (args) => (
        <div className="flex flex-col gap-3">
            <Switch {...args} label="Off" />
            <Switch {...args} label="On" defaultChecked />
            <Switch {...args} label="Loading" defaultChecked loading />
            <Switch {...args} label="Invalid" invalid />
            <Switch {...args} label="Disabled" disabled />
            <Switch {...args} label="Disabled, on" disabled defaultChecked />
        </div>
    ),
};
