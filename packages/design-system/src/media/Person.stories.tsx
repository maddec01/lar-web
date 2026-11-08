import type { Meta, StoryObj } from '@storybook/react-vite';

import { Person } from './Person';

const meta = {
    title: 'Media/Person',
    component: Person,
    args: { name: 'Ana Silva' },
} satisfies Meta<typeof Person>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** A long name wraps beside its avatar. */
export const LongName: Story = {
    render: () => (
        <div className="w-40">
            <Person name="Maria da Conceição Albuquerque" />
        </div>
    ),
};
