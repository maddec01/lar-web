import type { Meta, StoryObj } from '@storybook/react-vite';

import { ItemAction } from './ItemAction';

const meta = {
    title: 'Display/ItemAction',
    component: ItemAction,
    args: { action: { label: 'Edit cover', onClick: () => undefined } },
    // The action stays hidden until its media item is hovered or focused, so the stories show it inside one.
    render: (args) => (
        <div className="group/media-item bg-track relative flex size-32 items-end justify-end rounded-lg p-2">
            <ItemAction {...args} />
        </div>
    ),
} satisfies Meta<typeof ItemAction>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Loading: Story = { args: { loading: true, loadingLabel: 'Saving cover…' } };

/** Art still on its way, with no action: a plain spinner, not a button, so a card or tab around it can be one. */
export const LoadingWithoutAction: Story = {
    args: { action: undefined, loading: true, loadingLabel: 'Loading the poster' },
};

/** Without a handler the action reads as disabled. */
export const Disabled: Story = { args: { action: { label: 'Edit cover' } } };
