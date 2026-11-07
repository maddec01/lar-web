import type { Meta, StoryObj } from '@storybook/react-vite';

import { HelpTip } from './HelpTip';

const meta = {
    title: 'Overlays/HelpTip',
    component: HelpTip,
    args: {
        label: 'Build limit',
        children: 'How many builds run at once. Start build and Start after still go ahead at the limit.',
    },
} satisfies Meta<typeof HelpTip>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Closed: Story = {};

export const Open: Story = {
    play: async ({ canvasElement }) => canvasElement.querySelector<HTMLButtonElement>('button')?.click(),
};
