import type { Meta, StoryObj } from '@storybook/react-vite';

import { ColorDot } from './ColorDot';

const meta = {
    title: 'Display/ColorDot',
    component: ColorDot,
    args: { color: '#D73A4A' },
} satisfies Meta<typeof ColorDot>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Colored: Story = {};

/** With no colour, a neutral grey. */
export const NoColor: Story = { args: { color: undefined } };
