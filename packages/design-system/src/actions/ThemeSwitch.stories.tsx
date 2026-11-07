import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { fn } from 'storybook/test';

import { DesignSystemProvider } from '../foundations/DesignSystemProvider';
import type { ThemePreference } from '../foundations/Theme';
import { ThemeSwitch } from './ThemeSwitch';

const meta = {
    title: 'Actions/ThemeSwitch',
    component: ThemeSwitch,
    args: { value: 'system', onChange: fn() },
    argTypes: { value: { control: 'inline-radio', options: ['system', 'light', 'dark'] } },
} satisfies Meta<typeof ThemeSwitch>;

export default meta;

type Story = StoryObj<typeof meta>;

/** Controlled from the `value` control; clicks are logged in the Actions panel. */
export const Default: Story = {};

export const Dark: Story = { args: { value: 'dark' } };

function InteractiveThemeSwitch({ onChange }: { onChange: (value: ThemePreference) => void }) {
    const [value, setValue] = useState<ThemePreference>('light');

    return (
        <ThemeSwitch
            value={value}
            onChange={(next) => {
                setValue(next);
                onChange(next);
            }}
        />
    );
}

/** Keeps its own choice, so the segments respond to clicks. */
export const Interactive: Story = { render: (args) => <InteractiveThemeSwitch onChange={args.onChange} /> };

/** The labels come from DesignSystemProvider, so apps translate them there. */
export const Translated: Story = {
    render: (args) => (
        <DesignSystemProvider
            labels={{ theme: { label: 'Aparência', system: 'Seguir o sistema', light: 'Claro', dark: 'Escuro' } }}
        >
            <ThemeSwitch {...args} />
        </DesignSystemProvider>
    ),
};
