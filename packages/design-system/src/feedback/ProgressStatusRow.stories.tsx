import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ComponentProps } from 'react';
import { fn } from 'storybook/test';

import { Button } from '../actions/Button';
import { ProgressStatusRow } from './ProgressStatusRow';

const meta = {
    title: 'Feedback/ProgressStatusRow',
    component: ProgressStatusRow,
    args: {
        status: 'running',
        label: 'Vinyl Rips',
        operation: 'Scanning files',
        count: '1,204 of 3,890 files',
        eta: '12 min left',
        progress: { value: 1204, max: 3890 },
    },
    // One row at a popover’s width; the side-by-side stories lay out their own columns.
    render: (args) => (
        <div className="max-w-sm">
            <ProgressStatusRow {...args} />
        </div>
    ),
} satisfies Meta<typeof ProgressStatusRow>;

export default meta;

type Story = StoryObj<typeof meta>;
type Row = ComponentProps<typeof ProgressStatusRow>;

const cancel = (
    <Button variant="subtle" size="sm" onClick={fn()}>
        Cancel
    </Button>
);

/** Every state of the grammar, as a background-task list shows them: identity, then phase and numbers, the bar while
 *  running or held, the reason when held or failed, the action at the end. */
const states: Row[] = [
    {
        status: 'running',
        label: 'Vinyl Rips',
        operation: 'Re-read file metadata · Scanning files',
        count: '1,204 of 3,890 files',
        eta: '12 min left',
        progress: { value: 1204, max: 3890 },
        trailing: cancel,
    },
    {
        status: 'running',
        label: 'Music',
        operation: 'Comparing with Lidarr',
        count: '7 albums',
        detail: '12 known',
        trailing: cancel,
    },
    {
        status: 'paused',
        label: 'Music',
        operation: 'Reading release details',
        statusLabel: 'Waiting',
        count: '9 of 12 releases',
        progress: { value: 9, max: 12 },
        reason: 'MusicBrainz is busy; trying again at 8:21 PM',
        trailing: cancel,
    },
    {
        status: 'queued',
        label: 'Server',
        operation: 'Artwork cleanup',
        statusLabel: 'Queued',
        detail: 'after 2 tasks',
        trailing: cancel,
    },
    {
        status: 'failed',
        label: 'Documentaries',
        operation: 'File scan',
        statusLabel: 'Failed',
        reason: 'Folder not found: /mnt/media/documentaries',
        secondaryDetail: 'Scanned Nov 8, 10:20 AM',
        trailing: (
            <Button variant="secondary" size="sm" onClick={fn()}>
                Review
            </Button>
        ),
    },
    {
        status: 'done',
        label: 'Books',
        operation: 'File scan',
        statusLabel: 'Done',
        count: '412 books',
        secondaryDetail: 'Finished 8:19 PM · Took 2m',
    },
];

/** Each state side by side, compact (a popover, a card) beside regular (a page, a dialog). */
export const AllStates: Story = {
    render: () => (
        <div className="grid max-w-3xl gap-8 sm:grid-cols-2">
            {[true, false].map((compact) => (
                <div key={String(compact)} className="flex min-w-0 flex-col gap-4">
                    <p className="text-fg-muted text-xs font-medium">{compact ? 'Compact' : 'Regular'}</p>
                    {states.map((row, index) => (
                        <ProgressStatusRow key={index} {...row} size={compact ? 'sm' : 'md'} />
                    ))}
                </div>
            ))}
        </div>
    ),
};

/** Determinate: the amount is known, so the bar fills and the percent follows the count. */
export const Running: Story = { args: { trailing: cancel } };

/** Indeterminate: the size isn’t known yet, so the bar sweeps and only the count so far shows. */
export const Sweeping: Story = {
    args: { operation: 'Comparing with Lidarr', count: '7 albums', eta: undefined, progress: undefined },
};

/** Held: paused or backing off. The bar stays at its place in amber; the reason says until when. */
export const Paused: Story = {
    args: {
        status: 'paused',
        statusLabel: 'Waiting',
        eta: undefined,
        reason: 'MusicBrainz is busy; trying again at 8:21 PM',
    },
};

export const Queued: Story = {
    args: { status: 'queued', statusLabel: 'Queued', count: undefined, eta: undefined, progress: undefined },
};

export const Failed: Story = {
    args: {
        status: 'failed',
        count: undefined,
        eta: undefined,
        progress: undefined,
        statusLabel: 'Failed',
        reason: 'Permission denied: /mnt/media/tv/The Wire/Season 3',
        onDetails: fn(),
        detailsLabel: 'Show scan details',
    },
};

export const Done: Story = {
    args: {
        status: 'done',
        statusLabel: 'Done',
        count: '3,890 files',
        eta: undefined,
        secondaryDetail: 'Finished 8:19 PM · Took 6m',
    },
};

/** A card’s summary (`layout="line"`): the card already names the catalog, so the label is the work itself; light,
 *  label and meta share one line, the percent at its end and the bar’s room under it whether or not it runs, so every
 *  card in a grid has the same footer. The whole line opens the details. */
export const InCards: Story = {
    render: () => (
        <div className="grid max-w-3xl gap-4 sm:grid-cols-2">
            {(
                [
                    {
                        status: 'running',
                        label: 'Comparing with Lidarr',
                        count: '7 albums',
                        detail: '12 known',
                        reason: undefined,
                    },
                    {
                        status: 'running',
                        label: 'Movie metadata',
                        count: '6 of 9 files',
                        progress: { value: 6, max: 9 },
                        eta: '2 min left',
                    },
                    { status: 'failed', label: 'File scan', statusLabel: 'Failed', reason: 'Folder not found' },
                    { status: 'done', label: 'Up to date', secondaryDetail: 'Scanned Nov 6, 8:19 PM' },
                    { status: 'queued', label: 'File scan', statusLabel: 'Queued' },
                    {
                        state: 'off',
                        label: 'Turned off',
                        secondaryDetail: 'Last scanned Sep 29, 1:20 PM',
                    },
                ] satisfies Row[]
            ).map((row) => (
                <div key={row.label + row.status} className="border-line bg-surface-raised rounded-xl border px-4 py-3">
                    <ProgressStatusRow {...row} layout="line" onDetails={fn()} detailsLabel="Show scan details" />
                </div>
            ))}
        </div>
    ),
};

/** Identity first: a long catalog name wraps onto a second line rather than losing its end; the meta and the reason
 *  stay one line each, their full words in a hover title and the accessible name. */
export const IdentityFirstLongName: Story = {
    args: {
        size: 'sm',
        status: 'failed',
        label: 'Field Recordings from the 2019 Lisbon trip (lossless masters)',
        operation: 'Reading release details',
        count: '214 of 980 albums',
        eta: undefined,
        progress: undefined,
        reason: 'MusicBrainz didn’t answer after 3 tries.',
        onDetails: fn(),
        detailsLabel: 'Show scan details',
    },
    render: (args) => (
        <div className="w-80">
            <ProgressStatusRow {...args} />
        </div>
    ),
};

/** Existing callers' props (`active`, `tone`, `detail`, `issue`) still draw the same grammar. */
export const LegacyProps: Story = {
    args: {
        status: undefined,
        active: true,
        tone: 'info',
        label: 'Scanning Music',
        operation: undefined,
        count: undefined,
        eta: undefined,
        detail: '1,204 of 3,890 files',
        issue: '1 failed',
    },
};

/** At a phone's width (390px less the popover's insets): every line under the label is one line, cut with an ellipsis;
 *  the action stays on the label's line. */
export const Narrow: Story = {
    render: () => (
        <div className="flex w-72 flex-col gap-5">
            {states.map((row, index) => (
                <ProgressStatusRow key={index} {...row} size="sm" />
            ))}
        </div>
    ),
};

/** A card's summary short of room: the stage gives way first, down to a few letters; the count and the percent stay
 *  whole at the line's end, and the hover title holds the full line. */
export const LineKeepsItsNumbers: Story = {
    render: () => (
        <div className="flex w-72 flex-col gap-4">
            <ProgressStatusRow
                layout="line"
                status="running"
                label="Metadata"
                operation="Comparing with Lidarr"
                count="7 of 12 albums"
                progress={{ value: 7, max: 12 }}
                onDetails={fn()}
                detailsLabel="Show scan details"
            />
            <ProgressStatusRow
                layout="line"
                status="running"
                label="Re-read file metadata"
                operation="Finding files"
                count="286 files found · 41 new"
                onDetails={fn()}
                detailsLabel="Show scan details"
            />
        </div>
    ),
};
