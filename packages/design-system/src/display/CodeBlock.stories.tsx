import type { Meta, StoryObj } from '@storybook/react-vite';

import { CodeBlock } from './CodeBlock';

const compose = `services:
  lar:
    image: ghcr.io/lar-works/lar-server:latest
    ports:
      - "8420:8420"
    volumes:
      - /srv/lar/config:/config
      - /mnt/media:/media:ro
    restart: unless-stopped`;

const meta = {
    title: 'Display/CodeBlock',
    component: CodeBlock,
    args: { value: compose, preserveLines: false },
    decorators: [
        (Story) => (
            <div className="max-w-lg">
                <Story />
            </div>
        ),
    ],
} satisfies Meta<typeof CodeBlock>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** Keeps long lines intact and scrolls sideways instead of wrapping. */
export const PreserveLines: Story = {
    args: {
        preserveLines: true,
        value: 'curl -fsSL https://get.lar.works/server | sh -s -- --data-dir /srv/lar --media /mnt/media --port 8420 --no-telemetry',
    },
};

/** Long unbroken values wrap anywhere so they stay inside narrow drawers. */
export const LongToken: Story = {
    args: {
        value: 'LAR_PAIRING_TOKEN=lar_pt_8f3c2a9d71e64b0c9a5f2e8d4b6a1c3f7e9d2b5a8c1f4e7d0a3b6c9e2f5a8d1b4c7e0',
    },
    decorators: [
        (Story) => (
            <div className="max-w-xs">
                <Story />
            </div>
        ),
    ],
};
