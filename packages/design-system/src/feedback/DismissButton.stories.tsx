import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';

import { DismissButton } from './DismissButton';

const meta = {
    title: 'Feedback/DismissButton',
    component: DismissButton,
    args: { label: 'Dismiss: GitHub CLI is logged out.', onClick: fn() },
} satisfies Meta<typeof DismissButton>;

export default meta;

type Story = StoryObj<typeof meta>;

/** Floating in the top right corner of the notice it closes. */
export const Corner: Story = {
    render: (args) => (
        <div className="max-w-sm text-xs">
            <DismissButton {...args} />
            <div className="font-medium">GitHub CLI is logged out.</div>
            <div className="text-base-700 mt-1">
                The board reads GitHub through gh. Run gh auth login, then Recheck.
            </div>
        </div>
    ),
};

/** In a line of text, after an error. */
export const Inline: Story = {
    args: { placement: 'inline', label: 'Dismiss error for #61' },
    render: (args) => (
        <p className="text-xs">
            <span role="alert">Couldn't start #61: the branch is checked out elsewhere.</span>{' '}
            <DismissButton {...args} />
        </p>
    ),
};
