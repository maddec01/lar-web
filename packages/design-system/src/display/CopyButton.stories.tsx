import type { Meta, StoryObj } from '@storybook/react-vite';

import { CopyButton } from './CopyButton';

const meta = {
    title: 'Display/CopyButton',
    component: CopyButton,
    args: { label: 'Copy server address', copiedLabel: 'Copied', value: 'http://lar.local:8420' },
} satisfies Meta<typeof CopyButton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** Beside the value it copies, as in a settings row. */
export const BesideValue: Story = {
    args: { label: 'Copy API key', value: 'lar_sk_4f9a2c7e1b8d' },
    render: (args) => (
        <div className="flex items-center gap-2">
            <code className="bg-fill-muted rounded-xs px-2 py-1 text-xs">{args.value}</code>
            <CopyButton {...args} />
        </div>
    ),
};

/** A compact button that says what it does, then Copied for a moment, as beside a command in a notice. */
export const Text: Story = {
    args: { label: 'Copy gh auth login', copyText: 'Copy', value: 'gh auth login', presentation: 'text' },
    render: (args) => (
        <span className="text-xs">
            Run <code>{args.value}</code> <CopyButton {...args} />, then press Recheck.
        </span>
    ),
};
