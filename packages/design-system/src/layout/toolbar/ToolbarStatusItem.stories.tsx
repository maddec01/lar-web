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

export const Tones: Story = {
    render: (args) => (
        <Inline space="section" align="center">
            {tones.map((tone) => (
                <ToolbarStatusItem key={tone} {...args} tone={tone} />
            ))}
        </Inline>
    ),
};
