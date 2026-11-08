import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';

import { PasswordField } from './PasswordField';

const meta = {
    title: 'Forms/PasswordField',
    component: PasswordField,
    args: {
        label: 'Password',
        showLabel: 'Show password',
        hideLabel: 'Hide password',
        autoComplete: 'current-password',
    },
    render: (args) => (
        <div className="max-w-sm">
            <PasswordField {...args} />
        </div>
    ),
} satisfies Meta<typeof PasswordField>;

export default meta;

type Story = StoryObj<typeof meta>;

/** Signing in: no requirement, the toggle at the end. */
export const Default: Story = {};

/** Setting a new password: what it needs, under the field, not yet met. */
export const WithRequirement: Story = {
    args: { autoComplete: 'new-password', requirement: 'At least 12 characters', defaultValue: 'lar-2026' },
};

/** The requirement ticks once the value meets it. */
export const RequirementMet: Story = {
    args: {
        autoComplete: 'new-password',
        requirement: 'At least 12 characters',
        requirementMet: true,
        defaultValue: 'correct horse battery',
    },
};

/** Showing the password: the toggle is pressed and offers to hide it again. */
export const Revealed: Story = { args: { defaultRevealed: true, defaultValue: 'correct horse battery' } };

export const Invalid: Story = {
    args: { invalid: true, errorText: 'That password isn’t right. Try again.', defaultValue: 'hunter2' },
};

export const Disabled: Story = { args: { disabled: true, defaultValue: 'correct horse battery' } };

/** First run: the requirement follows what is typed. */
function Live() {
    const [value, setValue] = useState('');

    return (
        <div className="max-w-sm">
            <PasswordField
                label="Choose a password"
                showLabel="Show password"
                hideLabel="Hide password"
                autoComplete="new-password"
                required
                requirement="At least 12 characters"
                requirementMet={value.length >= 12}
                value={value}
                onChange={(event) => setValue(event.target.value)}
            />
        </div>
    );
}

export const LiveRequirement: Story = { render: () => <Live /> };

/** Every state side by side, for comparing them in light and dark. */
export const AllStates: Story = {
    render: (args) => (
        <div className="grid max-w-3xl gap-6 sm:grid-cols-2">
            <PasswordField {...args} />
            <PasswordField {...args} requirement="At least 12 characters" defaultValue="lar-2026" />
            <PasswordField
                {...args}
                requirement="At least 12 characters"
                requirementMet
                defaultValue="correct horse battery"
            />
            <PasswordField {...args} defaultRevealed defaultValue="correct horse battery" />
            <PasswordField {...args} invalid errorText="That password isn’t right. Try again." defaultValue="hunter2" />
            <PasswordField {...args} disabled defaultValue="correct horse battery" />
        </div>
    ),
};
