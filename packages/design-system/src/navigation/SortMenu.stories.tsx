import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';

import { SortMenu } from './SortMenu';

const meta = {
    title: 'Navigation/SortMenu',
    component: SortMenu,
    args: {
        value: 'updated',
        options: [
            { value: 'updated', label: 'Recently updated' },
            { value: 'priority', label: 'Priority' },
            { value: 'created', label: 'Newest' },
        ],
        onChange: fn(),
    },
} satisfies Meta<typeof SortMenu>;

export default meta;

type Story = StoryObj<typeof meta>;

/** A list’s sort, its button naming the current one, its menu the others. */
export const Default: Story = {};
