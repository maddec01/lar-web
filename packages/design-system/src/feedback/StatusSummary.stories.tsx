import type { Meta, StoryObj } from '@storybook/react-vite';

import { StatusSummary } from './StatusSummary';

const meta = {
    title: 'Feedback/StatusSummary',
    component: StatusSummary,
    args: {
        parts: [
            { state: 'active', label: '5 active' },
            { state: 'failed', label: '3 failed' },
        ],
    },
} satisfies Meta<typeof StatusSummary>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Mixed: Story = {};
export const Single: Story = { args: { parts: [{ state: 'ready', label: '12 done' }] } };
export const Empty: Story = { args: { parts: [] } };
export const Narrow: Story = {
    render: () => (
        <div className="w-48">
            <StatusSummary
                parts={[
                    { state: 'active', label: '5 building' },
                    { state: 'waiting', label: '3 waiting for you' },
                    { state: 'failed', label: '2 failed' },
                    { state: 'off', label: '8 queued' },
                ]}
            />
        </div>
    ),
};
