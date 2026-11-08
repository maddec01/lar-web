import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';

import { ReleaseNotes, UpdateDownloading, UpdatePill } from './UpdatePill';

const notes = (
    <ReleaseNotes
        releases={[
            {
                version: '1.4.0',
                title: 'What’s changed',
                items: ['The title bar comes from the design system.', 'Counters fold earlier on narrow windows.'],
                more: '3 more changes in this Release',
            },
            { version: '1.3.2', title: 'Changes in 1.3.2', items: ['Fixes the loading screen on a second display.'] },
        ]}
        older="2 older Releases not shown"
    />
);

const meta = {
    title: 'Board/UpdatePill',
    component: UpdatePill,
    args: {
        status: 'available',
        label: 'Update available',
        heading: 'Lar Factory 1.4.0 is available',
        notes,
        actionLabel: 'Download',
        disabled: false,
        onRun: fn(),
    },
} satisfies Meta<typeof UpdatePill>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Available: Story = {};

export const Downloaded: Story = {
    args: {
        status: 'downloaded',
        label: 'Restart to update',
        heading: 'Lar Factory 1.4.0 is ready',
        actionLabel: 'Restart now',
    },
};

export const Installing: Story = { args: { status: 'downloaded', label: 'Installing…', disabled: true } };

export const WithoutNotes: Story = { args: { notes: undefined } };

/** Hovering the pill opens its changelog. */
export const Open: Story = {
    play: async ({ canvasElement }) => {
        canvasElement.querySelector('button')?.focus();
    },
};

export const Downloading: StoryObj<typeof UpdateDownloading> = {
    render: () => (
        <UpdateDownloading
            percent={42}
            text="Downloading"
            label="Downloading 1.4.0"
            tooltip="Downloading 1.4.0 (42%)"
        />
    ),
};
