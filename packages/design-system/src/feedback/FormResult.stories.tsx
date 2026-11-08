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

export const Error: Story = {
    args: { tone: 'danger', text: 'GitHub refused the ticket: the label "triage" is gone.' },
};

export const Success: Story = { args: { tone: 'success', text: 'Created #128 in lar-works/lar-web.' } };

/** Several lines keep their breaks. */
export const Lines: Story = {
    args: { tone: 'danger', text: 'Two things went wrong:\n- the branch exists\n- the label is gone' },
};

/** Empty, it takes no room but stays mounted as a live region. */
export const Empty: Story = { args: { text: '' } };

/** A list under the text, such as the paths a call touched. */
export const WithList: Story = {
    args: {
        tone: 'warning',
        text: 'Couldn’t remove the links Lar Factory didn’t make:',
        list: [
            <code key="1">~/.claude-work/skills/lar-work</code>,
            <code key="2">~/.claude-work/skills/lar-shape</code>,
        ],
    },
};
