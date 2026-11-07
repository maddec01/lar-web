import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';

import { CommandPaletteTrigger } from './CommandPaletteTrigger';

const meta = {
    title: 'Layout/CommandPaletteTrigger',
    component: CommandPaletteTrigger,
    args: { label: 'Go to…', shortcut: 'k', onOpen: fn() },
} satisfies Meta<typeof CommandPaletteTrigger>;

export default meta;

type Story = StoryObj<typeof meta>;

/** In a wide title bar: a quiet field with its label and ⌘K (Ctrl K elsewhere). The shortcut works from anywhere. */
export const Wide: Story = {
    decorators: [
        (Story) => (
            <div className="@container w-full max-w-3xl">
                <Story />
            </div>
        ),
    ],
};

/** In a narrow title bar it folds to its icon. */
export const Folded: Story = {
    decorators: [
        (Story) => (
            <div className="@container w-64">
                <Story />
            </div>
        ),
    ],
};
