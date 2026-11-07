import type { Meta, StoryObj } from '@storybook/react-vite';

import { QrCode } from './QrCode';

const meta = {
    title: 'Display/QrCode',
    component: QrCode,
    args: { label: 'Pairing code for Lar Server', value: 'lar://pair?host=192.168.1.20%3A8420&code=4F9A-2C7E' },
    decorators: [
        (Story) => (
            <div className="w-56">
                <Story />
            </div>
        ),
    ],
} satisfies Meta<typeof QrCode>;

export default meta;

type Story = StoryObj<typeof meta>;

/** Shows a skeleton while the encoder loads, then the code. */
export const Pairing: Story = {};

export const Url: Story = { args: { label: 'Open Lar on your phone', value: 'http://lar.local:8420' } };
