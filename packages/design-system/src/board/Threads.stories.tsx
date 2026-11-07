import type { Meta, StoryObj } from '@storybook/react-vite';

import { EarlierThread, EarlierThreadList } from './Threads';

const meta = {
    title: 'Board/Threads',
    component: EarlierThreadList,
    decorators: [
        (Story) => (
            <div className="w-80">
                <Story />
            </div>
        ),
    ],
    args: {
        children: (
            <>
                <EarlierThread
                    name="T3 · Shape the sign-in screen"
                    title="Shape the sign-in screen"
                    href="#t1"
                    state="shaping"
                />
                <EarlierThread name="T3 · First build attempt" title="First build attempt" state="archived" />
                <EarlierThread
                    name="T3 · An earlier thread with a title long enough to truncate in the list"
                    title="An earlier thread with a title long enough to truncate in the list"
                    href="#t3"
                    state="earlier"
                />
            </>
        ),
    },
} satisfies Meta<typeof EarlierThreadList>;

export default meta;

type Story = StoryObj<typeof meta>;

/** Earlier threads, linked unless archived. */
export const Earlier: Story = {};
