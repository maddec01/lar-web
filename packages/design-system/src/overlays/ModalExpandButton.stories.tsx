import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { fn } from 'storybook/test';

import { ModalExpandButton } from './ModalExpandButton';

/** The dialog header’s grow-to-window toggle. Overlays/Modal → Expandable shows it in a dialog’s header. */
const meta = {
    title: 'Overlays/ModalExpandButton',
    component: ModalExpandButton,
    args: { expanded: false, onToggle: fn(), shortcut: { label: '⌘⇧E', keys: 'Meta+Shift+E' } },
} satisfies Meta<typeof ModalExpandButton>;

export default meta;

type Story = StoryObj<typeof meta>;

/** At the dialog’s own size: Expand. */
export const Collapsed: Story = {};

/** Grown to the window: Restore size, pressed. */
export const Expanded: Story = { args: { expanded: true } };

/** Without a shortcut, its tooltip names the action alone. */
export const WithoutShortcut: Story = { args: { shortcut: undefined } };

/** Toggles between the two as it is pressed. */
export const Interactive: Story = {
    render: function Render(args) {
        const [expanded, setExpanded] = useState(false);

        return <ModalExpandButton {...args} expanded={expanded} onToggle={() => setExpanded((on) => !on)} />;
    },
};
