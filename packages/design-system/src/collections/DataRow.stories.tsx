import type { Meta, StoryObj } from '@storybook/react-vite';
import type { CSSProperties, ReactNode } from 'react';

import { columnWidths } from './CollectionTokens';
import { DataRow } from './DataRow';

function Cover({ hue }: { hue: number }) {
    return (
        <span
            aria-hidden="true"
            className="block size-full rounded-md"
            style={{ background: `linear-gradient(135deg, hsl(${hue} 60% 55%), hsl(${hue + 50} 60% 25%))` }}
        />
    );
}

/** The table a row sits in, with the column template its grid reads from `--lar-list-columns`. */
function Table({ children }: { children: ReactNode }) {
    return (
        <div
            role="table"
            aria-label="Tracks"
            className="border-base-300 bg-base-100 max-w-3xl overflow-hidden rounded-xl border"
            style={
                {
                    '--lar-list-columns': [columnWidths.primary, columnWidths.secondary, columnWidths.numeric].join(
                        ' ',
                    ),
                } as CSSProperties
            }
        >
            <div role="rowgroup">{children}</div>
        </div>
    );
}

function Cell({ children, align }: { children?: ReactNode; align?: 'right' }) {
    return (
        <div
            role="cell"
            className={`text-base-content/55 min-w-0 truncate text-sm ${align === 'right' ? 'text-right tabular-nums' : ''}`}
        >
            {children}
        </div>
    );
}

const tracks = [
    { title: 'So What', artist: 'Miles Davis', album: 'Kind of Blue', duration: '9:22', hue: 210 },
    { title: 'Feeling Good', artist: 'Nina Simone', album: 'I Put a Spell on You', duration: '2:53', hue: 20 },
    { title: 'Everything In Its Right Place', artist: 'Radiohead', album: 'Kid A', duration: '4:11', hue: 0 },
    { title: 'Leãozinho', artist: 'Caetano Veloso', album: 'Bicho', duration: '3:05', hue: 45 },
];

/** One row of a collection table. `DataRow.Primary` is the first cell: artwork, title and subtitle. */
const meta = {
    title: 'Collections/DataRow',
    component: DataRow,
    args: { rowIndex: 2, interactive: true, children: null },
    render: (args) => (
        <Table>
            {tracks.map((track, index) => (
                <div key={track.title} role="presentation" className="h-16">
                    <DataRow {...args} rowIndex={args.rowIndex + index}>
                        <div role="cell" className="min-w-0">
                            <DataRow.Primary
                                title={track.title}
                                subtitle={track.artist}
                                artwork={<Cover hue={track.hue} />}
                            />
                        </div>
                        <Cell>{track.album}</Cell>
                        <Cell align="right">{track.duration}</Cell>
                    </DataRow>
                </div>
            ))}
        </Table>
    ),
} satisfies Meta<typeof DataRow>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Tracks: Story = {};

export const NotInteractive: Story = { args: { interactive: false } };

export const Loading: Story = {
    render: (args) => (
        <Table>
            {Array.from({ length: 4 }, (_, index) => (
                <div key={index} role="presentation" className="h-16">
                    <DataRow {...args} rowIndex={args.rowIndex + index}>
                        <div role="cell" className="min-w-0">
                            <DataRow.Primary loading />
                        </div>
                        <Cell />
                        <Cell />
                    </DataRow>
                </div>
            ))}
        </Table>
    ),
};

export const WithDetailAndNoArtwork: Story = {
    render: (args) => (
        <Table>
            <div role="presentation" className="h-16">
                <DataRow {...args}>
                    <div role="cell" className="min-w-0">
                        <DataRow.Primary
                            title="Chapter 1: The Boy Who Lived"
                            subtitle="Harry Potter and the Philosopher’s Stone"
                            detail="Read"
                        />
                    </div>
                    <Cell>J. K. Rowling</Cell>
                    <Cell align="right">24 p.</Cell>
                </DataRow>
            </div>
            <div role="presentation" className="h-16">
                <DataRow {...args} rowIndex={3}>
                    <div role="cell" className="min-w-0">
                        <DataRow.Primary loading artwork={false} subtitle={false} />
                    </div>
                    <Cell />
                    <Cell />
                </DataRow>
            </div>
        </Table>
    ),
};

export const LongContent: Story = {
    render: (args) => (
        <Table>
            <div role="presentation" className="h-16">
                <DataRow {...args}>
                    <div role="cell" className="min-w-0">
                        <DataRow.Primary
                            title="The Lord of the Rings: The Return of the King (Extended Edition, Remastered 4K HDR)"
                            subtitle="Peter Jackson · New Line Cinema · WingNut Films · The Saul Zaentz Company"
                            artwork={<Cover hue={30} />}
                        />
                    </div>
                    <Cell>/mnt/media/movies/The Lord of the Rings/Return of the King (2003)/Extended</Cell>
                    <Cell align="right">4:23:18</Cell>
                </DataRow>
            </div>
        </Table>
    ),
};
