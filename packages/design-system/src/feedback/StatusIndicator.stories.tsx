import type { Meta, StoryObj } from '@storybook/react-vite';

import { StatusIndicator } from './StatusIndicator';

const meta = {
    title: 'Feedback/StatusIndicator',
    component: StatusIndicator,
    args: { tone: 'success', size: 'md' },
} satisfies Meta<typeof StatusIndicator>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Small: Story = { args: { size: 'sm' } };

/** Every tone and size side by side, with what each one means in Lar. */
export const Tones: Story = {
    render: (args) => (
        <div className="flex flex-col gap-2 text-sm">
            {(
                [
                    ['success', 'Server online'],
                    ['info', 'Scanning'],
                    ['warning', 'Update available'],
                    ['danger', 'Drive unreachable'],
                    ['neutral', 'Idle'],
                ] as const
            ).map(([tone, label]) => (
                <span key={tone} className="flex items-center gap-2">
                    <StatusIndicator {...args} tone={tone} size="sm" />
                    <StatusIndicator {...args} tone={tone} size="md" />
                    {label}
                </span>
            ))}
        </div>
    ),
};

/** With a `label`: a check's state as a short word after the dot, in the tone's text colour; muted for one that
 *  didn't run. */
export const Labelled: Story = {
    render: () => (
        <div className="flex flex-col gap-2">
            <StatusIndicator tone="success" label="Installed" />
            <StatusIndicator tone="warning" label="Logged out" />
            <StatusIndicator tone="danger" label="Not found" />
            <StatusIndicator tone="neutral" label="Not checked" />
        </div>
    ),
};

/** A colour that comes with data, such as a tracker label's, in place of the tone's. */
export const DataColor: Story = { args: { tone: 'neutral', labelColor: '#D73A4A' } };
