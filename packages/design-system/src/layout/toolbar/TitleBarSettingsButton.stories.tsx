import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';

import { TitleBarSettingsButton } from './TitleBarSettingsButton';

const meta = {
    title: 'Layout/TitleBarSettingsButton',
    component: TitleBarSettingsButton,
    args: { label: 'Settings', onOpen: fn() },
} satisfies Meta<typeof TitleBarSettingsButton>;

export default meta;

type Story = StoryObj<typeof meta>;

/** The title bar's Settings, as lar-server and Lar Factory both draw it. */
export const Default: Story = {};

/** Something waits in Settings: screen readers hear it as the button's description. */
export const WithDescription: Story = { args: { description: '2 sign-in requests' } };
