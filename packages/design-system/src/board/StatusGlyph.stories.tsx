import type { Meta, StoryObj } from '@storybook/react-vite';

import { StatusIndicator } from '../feedback/StatusIndicator';
import { SourceIcon } from './SourceIcon';
import { type BoardStatus, statusColor } from './StatusColors';
import { StatusGlyph, StatusGlyphSlot } from './StatusGlyph';

const statuses = Object.keys(statusColor) as BoardStatus[];

const meta = {
    title: 'Board/StatusGlyph',
    component: StatusGlyph,
    args: { status: 'In progress', running: false },
} satisfies Meta<typeof StatusGlyph>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** Every status’s glyph in its colour, still and while its work runs (In progress spins; the others pulse). */
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
            <StatusGlyph status="Needs you" size="sm" />
            <StatusGlyph status="Needs you" />
            <StatusGlyph status="Needs you" size="lg" />
        </div>
    ),
};

/** Work whose state differs from its stage’s: blocked work waits (amber), and stopped work takes the Stopped glyph in
 *  grey, never its stage’s own glyph (Review’s eye reads as "in review"). */
export const BlockedAndStopped: Story = {
    render: () => (
        <div className="grid grid-cols-[10rem_auto] items-center gap-x-6 gap-y-2 text-xs">
            <span>Review · stopped</span>
            <StatusGlyph status="Review" state="off" />
            <span>In progress · stopped</span>
            <StatusGlyph status="In progress" state="off" />
            <span>Ready · blocked</span>
            <StatusGlyph status="Ready" state="waiting" />
        </div>
    ),
};

/** Rows' leading slot: status first, then the source icon. A status light that stands in for a glyph (an item’s PR
 *  readiness) sits in the same fixed box, so every title starts at the same x. */
export const AlignedInRows: Story = {
    render: () => (
        <ul className="m-0 grid w-72 list-none gap-1 p-0 text-xs">
            {(
                [
                    ['ring', <StatusGlyph key="g" status="Needs you" />, 'Fix the scan retry'],
                    [
                        'light',
                        <StatusGlyphSlot key="s">
                            <StatusIndicator state="ready" />
                        </StatusGlyphSlot>,
                        'Artwork grid',
                    ],
                    ['eye', <StatusGlyph key="e" status="Review" />, 'Shared metadata notice'],
                ] as const
            ).map(([key, glyph, title]) => (
                <li key={key} className="flex items-center gap-2">
                    {glyph}
                    <SourceIcon source="github" label="GitHub issue" />
                    <span className="truncate">{title}</span>
                </li>
            ))}
        </ul>
    ),
};
