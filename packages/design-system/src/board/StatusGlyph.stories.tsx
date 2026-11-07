import type { Meta, StoryObj } from '@storybook/react-vite';

import { type BoardStatus, statusColor } from './StatusColors';
import { StatusGlyph } from './StatusGlyph';

const statuses = Object.keys(statusColor) as BoardStatus[];

const meta = {
    title: 'Board/StatusGlyph',
    component: StatusGlyph,
    args: { status: 'In progress', running: false },
} satisfies Meta<typeof StatusGlyph>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** Every status's glyph in its colour, still and while its work runs (In progress spins; the others pulse). */
export const Statuses: Story = {
    render: () => (
        <div className="grid grid-cols-[10rem_auto_auto] items-center gap-x-6 gap-y-2 text-xs">
            {statuses.map((status) => (
                <div key={status} className="contents">
                    <span>{status}</span>
                    <StatusGlyph status={status} />
                    <StatusGlyph status={status} running />
                </div>
            ))}
        </div>
    ),
};

/** 12px beside small text, 14px by default and 16px beside a title. */
export const Sizes: Story = {
    render: () => (
        <div className="flex items-center gap-3">
            <StatusGlyph status="Needs you" presentation="compact" />
            <StatusGlyph status="Needs you" />
            <StatusGlyph status="Needs you" presentation="title" />
        </div>
    ),
};
