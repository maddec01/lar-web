import type { Meta, StoryObj } from '@storybook/react-vite';
import { CloudOffIcon, DownloadIcon, RefreshCwIcon } from 'lucide-react';

import { IconButton } from '../actions/IconButton';
import { Tooltip, TooltipPopup, TooltipTrigger } from './Tooltip';

const meta = {
    title: 'Overlays/Tooltip',
    component: Tooltip,
    args: { defaultOpen: true, children: null },
    decorators: [
        (Story) => (
            <div className="flex h-32 items-end justify-center">
                <Story />
            </div>
        ),
    ],
    render: (args) => (
        <Tooltip {...args}>
            <TooltipTrigger asChild>
                <IconButton aria-label="Check for updates" icon={<RefreshCwIcon />} />
            </TooltipTrigger>
            <TooltipPopup>Check for updates</TooltipPopup>
        </Tooltip>
    ),
} satisfies Meta<typeof Tooltip>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Open: Story = {};

/** Opens on hover or keyboard focus. */
export const OnHover: Story = { args: { defaultOpen: false } };

/** A disabled control still explains itself: the trigger wraps it in a focusable span. */
export const DisabledTrigger: Story = {
    render: (args) => (
        <Tooltip {...args}>
            <TooltipTrigger asChild>
                <IconButton disabled aria-label="Download for offline" icon={<DownloadIcon />} />
            </TooltipTrigger>
            <TooltipPopup>Downloads are unavailable while the server is offline</TooltipPopup>
        </Tooltip>
    ),
};

/** `disabled` suppresses the tooltip, such as when the label is already visible. */
export const Suppressed: Story = { args: { disabled: true } };

export const LongText: Story = {
    render: (args) => (
        <Tooltip {...args}>
            <TooltipTrigger asChild>
                <IconButton aria-label="Offline" icon={<CloudOffIcon />} />
            </TooltipTrigger>
            <TooltipPopup>
                Lar can’t reach the server at nas.local:32400. Recently played albums are still available from the
                cache.
            </TooltipPopup>
        </Tooltip>
    ),
};
