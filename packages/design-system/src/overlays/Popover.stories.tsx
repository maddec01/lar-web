import type { Meta, StoryObj } from '@storybook/react-vite';
import { InfoIcon } from 'lucide-react';
import { fn } from 'storybook/test';

import { Button } from '../actions/Button';
import { IconButton } from '../actions/IconButton';
import { Field } from '../forms/Field';
import { Input } from '../forms/Input';
import { Text } from '../typography/Typography';
import { Popover } from './Popover';

const meta = {
    title: 'Overlays/Popover',
    component: Popover,
    args: { defaultOpen: true, onOpenChange: fn(), children: null },
    decorators: [
        (Story) => (
            <div className="h-80">
                <Story />
            </div>
        ),
    ],
    render: (args) => (
        <Popover {...args}>
            <Popover.Trigger asChild>
                <IconButton aria-label="About this format" icon={<InfoIcon />} />
            </Popover.Trigger>
            <Popover.Content side="bottom" align="start" sideOffset={8} width="sm">
                <div className="flex flex-col gap-1">
                    <Text variant="label">FLAC · 24-bit / 96 kHz</Text>
                    <Text variant="caption" tone="muted">
                        Lossless. Lar streams the original file to devices that can play it and transcodes for the rest.
                    </Text>
                </div>
            </Popover.Content>
        </Popover>
    ),
} satisfies Meta<typeof Popover>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Closed: Story = { args: { defaultOpen: false } };

/** A small form that matches its trigger's width. */
export const TriggerWidthForm: Story = {
    render: (args) => (
        <div className="w-80">
            <Popover {...args}>
                <Popover.Trigger asChild>
                    <Button variant="secondary" fullWidth>
                        Rename playlist
                    </Button>
                </Popover.Trigger>
                <Popover.Content side="bottom" align="start" sideOffset={8} width="trigger">
                    <div className="flex flex-col gap-3">
                        <Field label="Name">
                            <Input defaultValue="Sunday morning" />
                        </Field>
                        <Button variant="primary">Save</Button>
                    </div>
                </Popover.Content>
            </Popover>
        </div>
    ),
};

/** `presentation="menu"` trims the padding for a list of options. */
export const Menu: Story = {
    render: (args) => (
        <Popover {...args}>
            <Popover.Trigger asChild>
                <Button variant="context">Add to</Button>
            </Popover.Trigger>
            <Popover.Content side="bottom" align="start" sideOffset={8} width="sm" presentation="menu">
                {['Favourites', 'Sunday morning', 'Road trip 2026', 'New playlist…'].map((label) => (
                    <Button key={label} variant="quiet" fullWidth className="justify-start">
                        {label}
                    </Button>
                ))}
            </Popover.Content>
        </Popover>
    ),
};

/** `md`: a 22rem panel, such as a chooser with a search field over its list. */
export const Medium: Story = {
    render: (args) => (
        <Popover {...args}>
            <Popover.Trigger asChild>
                <Button variant="secondary">Choose labels</Button>
            </Popover.Trigger>
            <Popover.Content side="bottom" align="start" sideOffset={8} width="md">
                <div className="flex flex-col gap-2">
                    <Input type="search" aria-label="Search labels" placeholder="Search 12 labels" />
                    <Text variant="caption" tone="muted">
                        Pick the labels that mark a bug.
                    </Text>
                </div>
            </Popover.Content>
        </Popover>
    ),
};
