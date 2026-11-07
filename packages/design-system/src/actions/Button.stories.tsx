import type { Meta, StoryObj } from '@storybook/react-vite';
import { ChevronDownIcon, PlusIcon, Trash2Icon } from 'lucide-react';

import { Button } from './Button';

const meta = {
    title: 'Actions/Button',
    component: Button,
    args: { children: 'Save changes', variant: 'primary' },
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {};

export const WithIcon: Story = { args: { leftIcon: <PlusIcon />, children: 'Add library' } };

export const Destructive: Story = { args: { variant: 'destructive', leftIcon: <Trash2Icon />, children: 'Delete' } };

export const Loading: Story = { args: { loading: true } };

export const Disabled: Story = { args: { disabled: true } };

/** Every recipe side by side, for comparing them in light and dark. */
export const Recipes: Story = {
    render: (args) => (
        <div className="flex flex-wrap items-center gap-3">
            {(
                [
                    'primary',
                    'secondary',
                    'quiet',
                    'subtle',
                    'tinted',
                    'destructive',
                    'destructive-quiet',
                    'choice',
                    'summary',
                    'status',
                ] as const
            ).map((variant) => (
                <Button key={variant} {...args} variant={variant}>
                    {variant}
                </Button>
            ))}
            <Button {...args} variant="choice" selected>
                choice, selected
            </Button>
            <Button {...args} variant="context" leftIcon={<PlusIcon />} rightIcon={<ChevronDownIcon />}>
                context
            </Button>
        </div>
    ),
};

/** The dense 28px control with 12px text, as Lar Factory's board draws every button, in each recipe it uses. */
export const Compact: Story = {
    render: (args) => (
        <div className="flex flex-wrap items-center gap-3">
            {(['primary', 'tinted', 'secondary', 'quiet', 'destructive'] as const).map((variant) => (
                <Button key={variant} {...args} compact variant={variant}>
                    {variant}
                </Button>
            ))}
            <Button {...args} compact variant="tinted" leftIcon={<PlusIcon />}>
                Start build
            </Button>
        </div>
    ),
};

/** A long label in a narrow surface wraps instead of clipping. */
export const Wrapping: Story = {
    render: (args) => (
        <div className="w-48">
            <Button {...args} compact wrap variant="secondary">
                Close the ticket and delete the branch with its worktree
            </Button>
        </div>
    ),
};
