import type { Meta, StoryObj } from '@storybook/react-vite';

import { SourceIcon } from './SourceIcon';

const meta = {
    title: 'Board/SourceIcon',
    component: SourceIcon,
    args: { source: 'github', label: 'GitHub issue. Saved on GitHub.' },
} satisfies Meta<typeof SourceIcon>;

export default meta;

type Story = StoryObj<typeof meta>;

export const GitHub: Story = {};

export const Azure: Story = { args: { source: 'azure', label: 'Azure DevOps work item. Saved in Azure DevOps.' } };

export const OnThisMachine: Story = { args: { source: 'local', label: 'Saved only on this machine.' } };

/** A tab in a card's top right corner. */
export const Corner: Story = {
    decorators: [
        (Story) => (
            <div className="relative h-20 w-60 rounded-lg border border-(--border) bg-(--card)">
                <Story />
            </div>
        ),
    ],
    args: { corner: true },
};
