import type { Meta, StoryObj } from '@storybook/react-vite';

import { StatusIndicator } from './StatusIndicator';
import { StatusSummary } from './StatusSummary';

const meta = {
    title: 'Feedback/StatusIndicator',
    component: StatusIndicator,
    args: { tone: 'success', size: 'md' },
} satisfies Meta<typeof StatusIndicator>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Small: Story = { args: { size: 'sm' } };

/** The one tone map: apps give a light what it means (`state`), and the state fixes its colour in every app. */
export const States: Story = {
    render: () => (
        <div className="flex flex-col gap-2">
            <StatusIndicator state="ready" label="Connected" />
            <StatusIndicator state="active" label="Scanning" />
            <StatusIndicator state="waiting" label="On, waiting" />
            <StatusIndicator state="failed" label="Failed" />
            <StatusIndicator state="off" label="Not checked" />
        </div>
    ),
};

/** A mixed state (StatusSummary): each part keeps its own light and colour. */
export const MixedSummary: Story = {
    render: () => (
        <div className="flex flex-col gap-3">
            <StatusSummary
                parts={[
                    { state: 'active', label: '5 active' },
                    { state: 'failed', label: '3 failed' },
                ]}
            />
            <StatusSummary
                parts={[
                    { state: 'ready', label: '12 up to date' },
                    { state: 'waiting', label: '2 waiting' },
                    { state: 'off', label: '1 not checked' },
                ]}
            />
        </div>
    ),
};

/** Every tone and size side by side, with what each one means in Lar. */
export const Tones: Story = {
    render: (args) => (
        <div className="flex flex-col gap-2 text-sm">
            {(
                [
                    ['success', 'Server online'],
                    ['accent', 'In development'],
                    ['info', 'Scanning'],
                    ['warning', 'Update available'],
                    ['danger', 'Drive unreachable'],
                    ['neutral', 'Idle'],
                ] as const
            ).map(([tone, label]) => (
                <span key={tone} className="flex items-center gap-2">
                    <StatusIndicator {...args} tone={tone} size="sm" />
                    <StatusIndicator {...args} tone={tone} size="md" />
                    {label}
                </span>
            ))}
        </div>
    ),
};

/** With a `label`: a check’s state as a short word after the dot, in the tone’s text colour; muted for one that
 *  didn’t run. */
export const Labelled: Story = {
    render: () => (
        <div className="flex flex-col gap-2">
            <StatusIndicator tone="success" label="Installed" />
            <StatusIndicator tone="warning" label="Logged out" />
            <StatusIndicator tone="danger" label="Not found" />
            <StatusIndicator tone="neutral" label="Not checked" />
        </div>
    ),
};

/** A colour that comes with data, such as a tracker label’s, in place of the tone’s. */
export const DataColor: Story = { args: { tone: 'neutral', labelColor: '#D73A4A' } };

/** Live: the light breathes slowly; still when the reader prefers reduced motion. */
export const Pulse: Story = { args: { tone: 'success', size: 'sm', pulse: true } };

/** With no words beside it, `srLabel` says what the light means to screen readers: colour is never the only signal. */
export const ScreenReaderLabel: Story = { args: { tone: 'danger', srLabel: 'Drive unreachable' } };

/** Over an icon’s corner, as the server’s title bar shows its health: cut out of the bar, glowing without a halo. */
export const Overlay: Story = {
    render: () => (
        <div className="flex gap-6">
            {(['success', 'info', 'warning', 'danger', 'neutral'] as const).map((tone) => (
                <span key={tone} className="text-fg-muted relative size-4">
                    <svg viewBox="0 0 16 16" className="size-full" aria-hidden="true">
                        <rect x="1.5" y="2.5" width="13" height="11" rx="2" fill="none" stroke="currentColor" />
                    </svg>
                    <span className="absolute -right-0.5 -bottom-0.5 flex">
                        <StatusIndicator tone={tone} size="sm" overlay />
                    </span>
                </span>
            ))}
        </div>
    ),
};
