import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';

import { StatTile } from './StatTile';

const meta = {
    title: 'Display/StatTile',
    component: StatTile,
    args: { label: 'Running', value: 3, tone: 'info', selected: false, onClick: () => undefined },
    decorators: [
        (Story) => (
            <div className="w-48">
                <Story />
            </div>
        ),
    ],
} satisfies Meta<typeof StatTile>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Selected: Story = { args: { selected: true } };

const filters = [
    { id: 'running', label: 'Running', value: 3, tone: 'info' },
    { id: 'queued', label: 'Queued', value: 18, tone: 'neutral' },
    { id: 'failed', label: 'Failed', value: 2, tone: 'danger' },
    { id: 'warnings', label: 'Warnings', value: 7, tone: 'warning' },
    { id: 'done', label: 'Done today', value: '1,204', tone: 'success' },
] as const;

function JobFilters() {
    const [selected, setSelected] = useState<string | null>('failed');

    return (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
            {filters.map((filter) => (
                <StatTile
                    key={filter.id}
                    label={filter.label}
                    value={filter.value}
                    tone={filter.tone}
                    selected={selected === filter.id}
                    onClick={() => setSelected(selected === filter.id ? null : filter.id)}
                />
            ))}
        </div>
    );
}

/** A row of job counts that filter the list below them; every tone side by side. */
export const JobCounts: Story = {
    render: () => <JobFilters />,
    decorators: [
        (Story) => (
            <div className="w-192 max-w-full">
                <Story />
            </div>
        ),
    ],
};
