import type { Meta, StoryObj } from '@storybook/react-vite';

import { Count } from './Count';

const meta = {
    title: 'Display/Count',
    component: Count,
    args: { count: 12, label: '12 albums' },
    render: (args) => (
        <div className="flex items-baseline gap-2">
            <span>Albums</span>
            <Count {...args} />
        </div>
    ),
} satisfies Meta<typeof Count>;

export default meta;

type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Zero: Story = { args: { count: 0, label: '0 albums' } };
export const Loading: Story = { args: { loading: true } };
export const Localized: Story = { args: { count: '1.234', label: '1.234 albums' } };
