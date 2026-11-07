import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';

import { MarkdownEditor } from './MarkdownEditor';

const meta = {
    title: 'Forms/MarkdownEditor',
    component: MarkdownEditor,
    args: {
        value: "## Goal\n\nMove the board's **title bar** into the design system.\n\n- Counters\n- Loading screen",
        onChange: fn(),
        label: 'Description',
        placeholder: 'Add a description…',
    },
    render: (args) => (
        <div className="max-w-2xl">
            <MarkdownEditor {...args} />
        </div>
    ),
} satisfies Meta<typeof MarkdownEditor>;

export default meta;

type Story = StoryObj<typeof meta>;

export const WithText: Story = {};

export const Empty: Story = { args: { value: '' } };

/** An older Azure DevOps description holds HTML; the editor opens it as the nodes it stands for. */
export const FromHtml: Story = {
    args: { format: 'html', value: '<h2>Goal</h2><p>Keep <b>every</b> look.</p><ul><li>One</li><li>Two</li></ul>' },
};

export const Disabled: Story = { args: { disabled: true } };

/** Filling a parent's height, as in a dialog's body. */
export const Fill: Story = {
    args: { fill: true },
    render: (args) => (
        <div className="flex h-96 max-w-2xl flex-col">
            <MarkdownEditor {...args} />
        </div>
    ),
};
