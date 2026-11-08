import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { fn } from 'storybook/test';

import { DesignSystemProvider } from '../foundations/DesignSystemProvider';
import type { ThemePreference } from '../foundations/Theme';
import { DropdownMenu } from '../overlays/DropdownMenu';
import { Button } from './Button';
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

/** Visible names for touch navigation, where hover titles aren’t available. */
export const Labelled: Story = { args: { labelsVisible: true } };

function MenuThemeSwitch({ onChange }: { onChange: (value: ThemePreference) => void }) {
    const [value, setValue] = useState<ThemePreference>('dark');

    return (
        <DropdownMenu defaultOpen>
            <DropdownMenu.Trigger asChild>
                <Button variant="secondary">Account</Button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content align="start" width="md">
                <DropdownMenu.Label presentation="identity">pedro@lar.local</DropdownMenu.Label>
                <DropdownMenu.Separator />
                <ThemeSwitch
                    placement="menu"
                    label="Appearance"
                    value={value}
                    onChange={(next) => {
                        setValue(next);
                        onChange(next);
                    }}
                />
                <DropdownMenu.Separator />
                <DropdownMenu.Item>Sign out</DropdownMenu.Item>
            </DropdownMenu.Content>
        </DropdownMenu>
    );
}

/** The same control in an account menu (`placement="menu"`): the menu's labelled row, the same pill and segments; the
 *  arrow keys move between them and choosing keeps the menu open. */
export const InMenu: Story = {
    render: (args) => <MenuThemeSwitch onChange={args.onChange} />,
    parameters: { layout: 'padded' },
};
