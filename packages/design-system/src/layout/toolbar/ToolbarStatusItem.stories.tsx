import type { Meta, StoryObj } from '@storybook/react-vite';
import { ServerIcon } from 'lucide-react';

import type { StatusTone } from '../../feedback/StatusIndicator';
import { Inline } from '../Flow';
import { ToolbarStatusItem } from './ToolbarStatusItem';

const tones: readonly StatusTone[] = ['neutral', 'success', 'info', 'warning', 'danger'];

const meta = {
    title: 'Layout/ToolbarStatusItem',
    component: ToolbarStatusItem,
    args: { icon: <ServerIcon />, tone: 'success' },
    argTypes: { icon: { control: false }, tone: { control: 'select', options: tones } },
} satisfies Meta<typeof ToolbarStatusItem>;

export default meta;

type Story = StoryObj<typeof meta>;

/** An icon with its status light in the corner. It is decorative: the button around it carries the label. */
export const Default: Story = {};

/** Nothing to report: no `state` or `tone`, so no light, and the icon keeps its 16px box beside lit ones. */
export const Quiet: Story = { args: { tone: undefined } };

/** The quiet icon first, then each tone. */
export const Tones: Story = {
    render: (args) => (
        <Inline space="section" align="center">
            <ToolbarStatusItem icon={args.icon} />
            {tones.map((tone) => (
                <ToolbarStatusItem key={tone} {...args} tone={tone} />
            ))}
        </Inline>
    ),
};
