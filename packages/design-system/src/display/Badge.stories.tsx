import type { Meta, StoryObj } from '@storybook/react-vite';
import { CheckIcon, CircleAlertIcon, Clock3Icon } from 'lucide-react';

import { Badge } from './Badge';

const meta = {
    title: 'Display/Badge',
    component: Badge,
    args: { children: 'Direct play', tone: 'neutral' },
} satisfies Meta<typeof Badge>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Neutral: Story = {};

export const Success: Story = {
    args: {
        tone: 'success',
        children: (
            <>
                <CheckIcon />
                Healthy
            </>
        ),
    },
};

export const Warning: Story = {
    args: {
        tone: 'warning',
        children: (
            <>
                <Clock3Icon />
                Scan pending
            </>
        ),
    },
};

export const Danger: Story = {
    args: {
        tone: 'danger',
        children: (
            <>
                <CircleAlertIcon />
                Failed
            </>
        ),
    },
};

/** Every tone side by side, for comparing them in light and dark (a kind’s hue is KindBadge’s). */
export const Tones: Story = {
    render: (args) => (
        <div className="flex flex-col gap-3">
            <div className="flex flex-wrap items-center gap-2">
                {(['neutral', 'accent', 'success', 'warning', 'danger', 'info'] as const).map((tone) => (
                    <Badge key={tone} {...args} tone={tone}>
                        {tone}
                    </Badge>
                ))}
            </div>
        </div>
    ),
};

/** A tracker’s labels in their own colours, tinted so each name stays readable in light and dark. */
export const LabelColors: Story = {
    render: (args) => (
        <div className="flex flex-wrap items-center gap-2">
            {[
                { color: '#D73A4A', label: 'bug' },
                { color: '#C2E0C6', label: 'good first issue' },
                { color: '#FBCA04', label: 'needs triage' },
                { color: '#5319E7', label: 'design' },
                { color: '#EDEDED', label: 'wontfix' },
                { color: undefined, label: 'no colour' },
            ].map(({ color, label }) => (
                <Badge key={label} {...args} labelColor={color}>
                    {label}
                </Badge>
            ))}
        </div>
    ),
};

/** `muted` dims an entry that is listed but switched off. */
export const Muted: Story = {
    render: () => (
        <div className="flex gap-1">
            <Badge tone="accent">Codex personal</Badge>
            <Badge muted>Cursor · Disabled</Badge>
        </div>
    ),
};

/** sm (20px) for rows, cards and fields; md (24px) for a heading’s or hero’s status, as the website’s readiness pills. */
export const Sizes: Story = {
    render: (args) => (
        <div className="flex flex-wrap items-center gap-2">
            <Badge {...args} size="sm" tone="success">
                <CheckIcon />
                Small
            </Badge>
            <Badge {...args} size="md" tone="success">
                <CheckIcon />
                Medium
            </Badge>
            <Badge {...args} size="sm">
                12
            </Badge>
            <Badge {...args} size="md" tone="accent">
                In development
            </Badge>
        </div>
    ),
};
