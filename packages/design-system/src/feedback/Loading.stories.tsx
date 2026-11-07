import type { Meta, StoryObj } from '@storybook/react-vite';

import { Loading, SpinnerIcon } from './Loading';

const meta = {
    title: 'Feedback/Loading',
    component: Loading,
    args: { label: 'Loading Projects…' },
} satisfies Meta<typeof Loading>;

export default meta;

type Story = StoryObj<typeof meta>;

/** ninna-ui's announced spinner, its label for screen readers only. */
export const Default: Story = {};

/** `inline`: a small spinner and what loads, in a line of small text. */
export const WithLabel: Story = { args: { presentation: 'inline' } };

/** With no label, the spinner alone, named by its title for screen readers. */
export const Cue: Story = {
    args: { presentation: 'inline', label: undefined, title: 'Usage totals are still loading.' },
};

export const Still: Story = { args: { presentation: 'inline', still: true } };

/** On its own line, at body size. */
export const Line: Story = { args: { presentation: 'line' } };

/** A step's loading line, announced, as Lar Factory's onboarding shows while it reads what a step needs. */
export const Status: Story = { args: { presentation: 'status', label: 'Checking the repository and your access…' } };

export const Icon: Story = { render: () => <SpinnerIcon aria-hidden="true" className="size-4" /> };
