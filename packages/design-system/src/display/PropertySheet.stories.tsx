import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ComponentProps } from 'react';

import { Badge } from './Badge';
import { PropertySheet } from './PropertySheet';

// The loaded variant of the props, so stories' args and controls match it; the loading state has its own story.
type PropertySheetProps = Extract<ComponentProps<typeof PropertySheet>, { loading?: false }>;

const meta = {
    title: 'Display/PropertySheet',
    component: PropertySheet,
    args: {
        title: 'File',
        children: (
            <PropertySheet.Rows
                items={[
                    { label: 'Size', value: '62.4 GB' },
                    { label: 'Duration', value: '2:46:12' },
                    { label: 'Video', value: 'HEVC Main 10 · 2160p · HDR10' },
                    { label: 'Audio', value: 'Dolby TrueHD Atmos 7.1' },
                    { label: 'Added', value: '12 March 2024' },
                ]}
            />
        ),
    },
    decorators: [
        (Story) => (
            <div className="max-w-lg">
                <Story />
            </div>
        ),
    ],
} satisfies Meta<PropertySheetProps>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Rows: Story = {};

export const Tags: Story = {
    args: {
        title: 'Genres',
        children: (
            <PropertySheet.Tags
                items={[
                    { id: 'sci-fi', label: 'Science Fiction' },
                    { id: 'adventure', label: 'Adventure' },
                    { id: 'drama', label: 'Drama' },
                ]}
            />
        ),
    },
};

export const Note: Story = {
    args: {
        title: 'Summary',
        children: (
            <PropertySheet.Note>
                Lar has not found a summary for this movie yet. It will try again during the next metadata refresh.
            </PropertySheet.Note>
        ),
    },
};

export const Table: Story = {
    args: {
        title: 'Streams',
        children: (
            <PropertySheet.Table
                label="Streams"
                columns={['Type', 'Codec', 'Language', 'Default']}
                rows={[
                    { key: 'v', cells: ['Video', 'HEVC 10-bit', '—', <Badge key="d">Default</Badge>] },
                    { key: 'a1', cells: ['Audio', 'TrueHD Atmos 7.1', 'English', <Badge key="d">Default</Badge>] },
                    { key: 'a2', cells: ['Audio', 'AC3 5.1', 'Portuguese', ''] },
                    { key: 's1', cells: ['Subtitles', 'PGS', 'Portuguese', ''] },
                ]}
            />
        ),
    },
};

/** A sheet that starts collapsed behind a summary. */
export const Collapsible: Story = {
    render: () => (
        <PropertySheet.Collapsible title="Advanced" summary="Hardware decoding, tone mapping and subtitle burn-in">
            <PropertySheet.Rows
                items={[
                    { label: 'Hardware decoding', value: 'NVDEC' },
                    { label: 'Tone mapping', value: 'Hable' },
                    { label: 'Burn in subtitles', value: 'Image-based only' },
                ]}
            />
        </PropertySheet.Collapsible>
    ),
};

/** Sheets stacked as on a detail page. */
export const Composed: Story = {
    render: () => (
        <div className="flex flex-col gap-6">
            <PropertySheet title="Library">
                <PropertySheet.Rows
                    items={[
                        { label: 'Movies', value: '1,284' },
                        { label: 'Total size', value: '18.2 TB' },
                    ]}
                />
            </PropertySheet>
            <PropertySheet title="Folders">
                <PropertySheet.Tags
                    items={[
                        { id: '1', label: '/mnt/media/movies' },
                        { id: '2', label: '//nas.local/video/Movies (4K)' },
                    ]}
                />
            </PropertySheet>
            <PropertySheet title="Notes">
                <PropertySheet.Note>Scans run every night at 02:00.</PropertySheet.Note>
            </PropertySheet>
        </div>
    ),
};

export const Loading: Story = {
    render: () => <PropertySheet title="File" loading loadingLabel="Loading file details" />,
};
