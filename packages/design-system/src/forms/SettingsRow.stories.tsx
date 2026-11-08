import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';

import { Button } from '../actions/Button';
import { InsetPanel } from '../display/InsetPanel';
import { SettingsRow } from './FormSection';
import { OptionSelect } from './OptionSelect';
import { Switch } from './Switch';

const meta = {
    title: 'Forms/SettingsRow',
    component: SettingsRow,
    args: {
        label: 'Appearance',
        description: 'Choose how Lar looks on this device.',
        children: (
            <OptionSelect
                label="Appearance"
                value="system"
                options={[
                    { value: 'system', label: 'Follow system' },
                    { value: 'dark', label: 'Dark' },
                ]}
                onChange={fn()}
            />
        ),
    },
    decorators: [
        (Story) => (
            <InsetPanel presentation="settings">
                <Story />
            </InsetPanel>
        ),
    ],
} satisfies Meta<typeof SettingsRow>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Picker: Story = {};
export const Toggle: Story = {
    args: {
        label: 'Open list expanded',
        children: <Switch checked aria-label="Open list expanded" onCheckedChange={fn()} />,
    },
};
export const LongContent: Story = {
    args: {
        label: 'Use the preferred model for builds started automatically on this Mac',
        description: 'A longer explanation wraps while the picker stays the same width.',
    },
};
export const Error: Story = { args: { error: 'Couldn’t save. Try again.' } };
export const Action: Story = {
    args: {
        variant: 'action',
        label: <Button variant="destructive-quiet">Clear generated music</Button>,
        description: 'Remove generated audio. Original files stay on disk.',
        children: undefined,
    },
};
export const TrailingAction: Story = {
    args: {
        label: 'Logs',
        description: 'Read the latest server events.',
        children: <Button variant="quiet">Refresh</Button>,
    },
};
export const Loading: Story = { args: { loading: true, loadingLabel: 'Loading appearance' } };
