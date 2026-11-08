import type { Meta, StoryObj } from '@storybook/react-vite';

import { DataTable } from './DataTable';

const meta = {
    title: 'Display/DataTable',
    component: DataTable,
    args: {
        label: 'Transcoding support by device',
        rowHeader: 'Format',
        columns: [
            { id: 'tv', label: 'Living Room TV' },
            { id: 'phone', label: 'Ana’s iPhone' },
            { id: 'browser', label: 'Web browser' },
        ],
        rows: [
            {
                id: 'hevc',
                label: 'HEVC 4K HDR',
                cells: [
                    { id: 'tv', text: 'Direct play' },
                    { id: 'phone', text: 'Direct play', detail: 'Tone-mapped to SDR' },
                    {
                        id: 'browser',
                        text: 'Transcode',
                        detail: 'To H.264 1080p',
                        tone: 'warning',
                        title: 'The browser can’t decode HEVC',
                    },
                ],
            },
            {
                id: 'av1',
                label: 'AV1 1080p',
                cells: [
                    { id: 'tv', text: 'Transcode', tone: 'warning' },
                    { id: 'phone', text: 'Direct play' },
                    { id: 'browser', text: 'Direct play' },
                ],
            },
            {
                id: 'flac',
                label: 'FLAC 24/96',
                cells: [
                    { id: 'tv', text: 'Direct play' },
                    { id: 'phone', text: 'Not used', tone: 'muted' },
                    { id: 'browser', text: 'Direct play' },
                ],
            },
        ],
    },
} satisfies Meta<typeof DataTable>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** Tighter rows for a long table read line by line. */
export const Compact: Story = { args: { density: 'compact' } };

export const Empty: Story = { args: { rows: [] } };

/** Many columns scroll sideways inside their own container. */
export const Narrow: Story = {
    decorators: [
        (Story) => (
            <div className="max-w-xs">
                <Story />
            </div>
        ),
    ],
};
