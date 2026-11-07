import type { Meta, StoryObj } from '@storybook/react-vite';

import { Spinner, SpinnerIcon } from './Spinner';

const meta = {
    title: 'Feedback/Spinner',
    component: Spinner,
    args: { label: 'Loading Projects…' },
} satisfies Meta<typeof Spinner>;

export default meta;

type Story = StoryObj<typeof meta>;

export const WithLabel: Story = {};

/** With no label, the spinner alone, named by its title for screen readers. */
export const Cue: Story = { args: { label: undefined, title: 'Usage totals are still loading.' } };

export const Still: Story = { args: { still: true } };

/** On its own line, at body size. */
export const Line: Story = { args: { presentation: 'line' } };

export const Icon: Story = { render: () => <SpinnerIcon aria-hidden="true" className="size-4" /> };
