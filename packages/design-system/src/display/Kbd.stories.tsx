import type { Meta, StoryObj } from '@storybook/react-vite';

import { Kbd } from './Kbd';

const meta = {
    title: 'Display/Kbd',
    component: Kbd,
    args: { children: '⌘K' },
} satisfies Meta<typeof Kbd>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** Beside the search field, as in the app header. */
export const InSearchField: Story = {
    render: (args) => (
        <div className="border-line bg-surface-raised flex w-64 items-center justify-between rounded-md border px-3 py-2">
            <span className="text-fg-muted text-sm">Search movies, music…</span>
            <Kbd {...args} />
        </div>
    ),
};

export const Shortcuts: Story = {
    render: () => (
        <dl className="grid w-56 grid-cols-[1fr_auto] gap-x-4 gap-y-2 text-sm">
            <dt>Play or pause</dt>
            <dd>
                <Kbd>Space</Kbd>
            </dd>
            <dt>Next track</dt>
            <dd>
                <Kbd>⇧N</Kbd>
            </dd>
            <dt>Command palette</dt>
            <dd>
                <Kbd>⌘K</Kbd>
            </dd>
        </dl>
    ),
};
