import type { Meta, StoryObj } from '@storybook/react-vite';

import { StatusText } from './StatusText';

const meta = {
    title: 'Feedback/StatusText',
    component: StatusText,
    args: { text: 'Installed', tone: 'success' },
} satisfies Meta<typeof StatusText>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Success: Story = {};

export const Warning: Story = { args: { text: 'Logged out', tone: 'warning' } };

export const Danger: Story = { args: { text: 'Not found', tone: 'danger' } };

/** A check that didn't run. */
export const Muted: Story = { args: { text: 'Not checked', tone: 'muted' } };
