import type { Meta, StoryObj } from '@storybook/react-vite';

import { Progress } from './Progress';

const meta = {
    title: 'Feedback/Progress',
    component: Progress,
    args: { value: 2, max: 4, caption: 'Step 2 of 4', 'aria-label': 'Onboarding progress' },
} satisfies Meta<typeof Progress>;

export default meta;

type Story = StoryObj<typeof meta>;

export const WithCaption: Story = {};

export const WithoutCaption: Story = { args: { caption: undefined, value: 40, max: 100 } };

export const Empty: Story = { args: { value: 0, caption: 'Not started' } };

export const Complete: Story = { args: { value: 4, caption: 'Done' } };

/** A value past the maximum fills the track and no further. */
export const Overflowing: Story = { args: { value: 7, caption: '7 of 4' } };
