import type { Meta, StoryObj } from '@storybook/react-vite';
import { CircleDollarSignIcon } from 'lucide-react';
import { fn } from 'storybook/test';

import { StatusIndicator } from '../../feedback/StatusIndicator';
import { StatusPopoverContent } from '../../feedback/StatusPopoverContent';
import { StatusRow } from '../../feedback/StatusRow';
import { ToolbarCounter } from './ToolbarCounter';
import { ToolbarStatusGroup } from './ToolbarStatusGroup';

const meta = {
    title: 'Layout/ToolbarCounter',
    component: ToolbarCounter,
    args: {
        icon: <StatusIndicator state="waiting" />,
        label: 'Need you',
        value: 6,
        hint: '6 items waiting on your answer, verification or merge',
        onOpenChange: fn(),
        children: (
            <StatusPopoverContent title="Needs you" count={6} width="wide">
                <StatusRow label="#23 Faster library sync on large collections" state="waiting" value="2h" />
                <StatusRow label="#202 Sign-in screen" state="waiting" value="2h" />
            </StatusPopoverContent>
        ),
    },
    argTypes: { icon: { control: false }, children: { control: false } },
    decorators: [
        (Story) => (
            <header className="@container flex w-full justify-end">
                <ToolbarStatusGroup aria-label="Board status">
                    <Story />
                </ToolbarStatusGroup>
            </header>
        ),
    ],
} satisfies Meta<typeof ToolbarCounter>;

export default meta;

type Story = StoryObj<typeof meta>;

/** A glyph in its status's colour and a count; hover for what it means, press for everything behind it. */
export const Default: Story = {};

/** A count against a limit: the mini track shows 4 builds where 2 are allowed, the extra two after a gap. */
export const WithTrack: Story = {
    args: {
        icon: <StatusIndicator state="active" />,
        label: 'Building',
        value: 4,
        track: { used: 4, limit: 2 },
        hint: '4 building, automatic limit 2',
        children: (
            <StatusPopoverContent
                title="Building"
                count={4}
                detail="Automatic limit 2"
                width="wide"
                footer="Manual starts and Start after may exceed the automatic build limit."
            >
                <StatusRow label="#130 Show cold bitmap subtitles" state="active" value="19m" />
            </StatusPopoverContent>
        ),
    },
};

/** Nothing read yet: a dash, never a zero that would be a claim. */
export const Unknown: Story = {
    args: { value: <span className="text-fg-muted font-normal">–</span>, hint: 'Still loading projects' },
};

/** A wider figure, such as a spend, which a bar under 72rem folds away. */
export const Figure: Story = {
    args: {
        icon: <CircleDollarSignIcon />,
        label: 'Spend',
        value: '$198.70',
        width: 'figure',
        hint: 'Agent cost on open and recent items, an API estimate',
    },
};
