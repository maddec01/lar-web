import type { Meta, StoryObj } from '@storybook/react-vite';

import { Text } from '../typography/Typography';
import { InsetPanel } from './InsetPanel';
import { RadioChoice } from './RadioChoice';

const meta = {
    title: 'Display/InsetPanel',
    component: InsetPanel,
    args: {
        presentation: 'default',
        children: (
            <>
                <Text variant="label">Backups</Text>
                <Text tone="muted">
                    Lar copies its database and your edits to /srv/lar/backups every night at 03:00. The last 7 are
                    kept.
                </Text>
            </>
        ),
    },
    decorators: [
        (Story) => (
            <div className="max-w-md">
                <Story />
            </div>
        ),
    ],
} satisfies Meta<typeof InsetPanel>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** The whole panel is a button. */
export const Clickable: Story = { args: { onClick: () => undefined } };

/** Ruled rows, as a group of settings. */
export const Settings: Story = {
    args: {
        presentation: 'settings',
        children: (
            <>
                <RadioChoice name="quality" checked onChange={() => undefined}>
                    <Text variant="label">Original</Text>
                    <Text variant="caption" tone="muted">
                        Direct play when the device supports it
                    </Text>
                </RadioChoice>
                <RadioChoice name="quality" checked={false} onChange={() => undefined}>
                    <Text variant="label">1080p · 8 Mbps</Text>
                    <Text variant="caption" tone="muted">
                        For streaming away from home
                    </Text>
                </RadioChoice>
                <RadioChoice name="quality" checked={false} onChange={() => undefined}>
                    <Text variant="label">720p · 4 Mbps</Text>
                    <Text variant="caption" tone="muted">
                        For mobile data
                    </Text>
                </RadioChoice>
            </>
        ),
    },
};
