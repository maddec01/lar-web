import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';

import { LabelChip } from './LabelChip';

const meta = {
    title: 'Display/LabelChip',
    component: LabelChip,
    args: { label: 'docs', color: '#0075ca' },
} satisfies Meta<typeof LabelChip>;

export default meta;

type Story = StoryObj<typeof meta>;

/** A tracker label in its own colour. */
export const Colored: Story = {};

/** With no colour, the neutral badge. */
export const Neutral: Story = { args: { label: 'needs-review', color: undefined } };

/** A long name truncates, its tooltip giving it whole. */
export const LongName: Story = {
    render: () => (
        <div className="w-60">
            <LabelChip label={`a-label-with-a-${'very-'.repeat(12)}long-name`} color="#1D76DB" />
        </div>
    ),
};

/** A note after the name, such as a label the ticket will create. */
export const Note: Story = { args: { label: 'needs-design', color: undefined, note: 'new' } };

/** A label that can't be edited here, after a lock that says why. */
export const Locked: Story = {
    args: { label: 'lar:building', color: undefined, locked: true, lockedLabel: 'Factory-managed' },
};

/** Its own × button, which removes the label. */
export const Removable: Story = { args: { label: 'bug', color: undefined, onRemove: fn(), removeLabel: 'Remove bug' } };

/** A × only, inside a control that removes it, such as an active filter's chip. */
export const InAControl: Story = { args: { label: 'bug', color: '#D73A4A', removable: true } };
