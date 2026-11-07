import type { Meta, StoryObj } from '@storybook/react-vite';

import { FormResult } from './FormResult';

const meta = {
    title: 'Feedback/FormResult',
    component: FormResult,
    args: { id: 'form-result', text: 'A title is required.' },
} satisfies Meta<typeof FormResult>;

export default meta;

type Story = StoryObj<typeof meta>;

/** A validation message, a warning by default. */
export const Warning: Story = {};

export const Error: Story = { args: { tone: 'error', text: 'GitHub refused the ticket: the label "triage" is gone.' } };

export const Success: Story = { args: { tone: 'success', text: 'Created #128 in lar-works/lar-web.' } };

/** Several lines keep their breaks. */
export const Lines: Story = {
    args: { tone: 'error', text: 'Two things went wrong:\n- the branch exists\n- the label is gone' },
};

/** Empty, it takes no room but stays mounted as a live region. */
export const Empty: Story = { args: { text: '' } };
