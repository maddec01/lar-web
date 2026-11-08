import type { Meta, StoryObj } from '@storybook/react-vite';

import { CopyButton } from './CopyButton';
import { DetailList } from './DetailList';

const meta = {
    title: 'Display/DetailList',
    component: DetailList,
    args: {
        title: 'Technical details',
        items: [
            { label: 'Container', value: 'Matroska (MKV)' },
            { label: 'Video', value: 'HEVC Main 10 · 3840×1606' },
            { label: 'Audio', value: 'English · Dolby TrueHD Atmos 7.1' },
            {
                label: 'File',
                value: '/mnt/media/movies/Dune Part Two (2024)/Dune.Part.Two.2024.2160p.UHD.BluRay.REMUX.mkv',
                actions: (
                    <CopyButton
                        label="Copy path"
                        copiedLabel="Copied"
                        value="/mnt/media/movies/Dune Part Two (2024)/Dune.Part.Two.2024.2160p.UHD.BluRay.REMUX.mkv"
                    />
                ),
            },
        ],
    },
    decorators: [
        (Story) => (
            <div className="max-w-sm">
                <Story />
            </div>
        ),
    ],
} satisfies Meta<typeof DetailList>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Compact: Story = { args: { variant: 'inline' } };

export const Repository: Story = {
    args: {
        title: 'Repository',
        items: [
            { label: 'Remote', value: 'git@github.com:lar-works/lar-web.git' },
            { label: 'Branch', value: 'main' },
            { label: 'Commit', value: '4f9a2c7e1b8d3a6f0c5e9b2d7a4f1c8e3b6d0a9f' },
        ],
    },
};

export const WrappedAddresses: Story = {
    args: {
        variant: 'inline',
        wrapValues: true,
        title: 'Connection addresses',
        items: [
            {
                label: 'lar.example.very-long-hostname.net',
                value: 'https://lar.example.very-long-hostname.net:36900',
                actions: (
                    <CopyButton
                        label="Copy address"
                        copiedLabel="Copied"
                        value="https://lar.example.very-long-hostname.net:36900"
                    />
                ),
            },
        ],
    },
};
