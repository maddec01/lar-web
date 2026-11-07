import type { Meta, StoryObj } from '@storybook/react-vite';
import { BugIcon, FolderGit2Icon, TagIcon } from 'lucide-react';
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

const tokens = [
    { id: 'repo', label: 'lar-factory', leading: <FolderGit2Icon /> },
    { id: 'kind:bug', label: 'Bug', leading: <BugIcon />, hue: 25 },
    { id: 'label:triage', label: 'needs triage', leading: <TagIcon /> },
];

/** With tokens, it says what narrows the palette and measures its own room: chips go into a count from the last. */
export const WithTokens: Story = {
    args: { label: 'Search', tokens, filterLabel: (labels) => `filtered by ${labels.join(', ')}` },
    decorators: [
        (Story) => (
            <header className="flex w-full max-w-3xl justify-end">
                <Story />
            </header>
        ),
    ],
};

/** Too little room for one chip: a count stands for them all. */
export const TokensCounted: Story = {
    args: { label: 'Search', tokens },
    decorators: [
        (Story) => (
            <header className="flex w-44 justify-end">
                <Story />
            </header>
        ),
    ],
};

/** No room for the word: it folds to its icon, with the count on it. */
export const TokensFolded: Story = {
    args: { label: 'Search', tokens },
    decorators: [
        (Story) => (
            <header className="flex w-20 justify-end">
                <Story />
            </header>
        ),
    ],
};
