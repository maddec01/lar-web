import type { Meta, StoryObj } from '@storybook/react-vite';
import { type ComponentProps, useState } from 'react';
import { fn } from 'storybook/test';

import { FolderSelector, type FolderSelectorOption } from './FolderSelector';

const tree: Record<string, string[]> = {
    '/': ['home', 'mnt', 'srv', 'var'],
    '/mnt': ['media', 'backup'],
    '/mnt/media': ['music', 'movies', 'tv', 'photos', 'books'],
    '/mnt/media/music': ['Miles Davis', 'Nina Simone', 'Radiohead', 'Caetano Veloso'],
    '/mnt/media/movies': [],
    '/mnt/media/photos': ['2019 - Summer holidays in Lisbon and Porto with the whole family', '2020', '2021'],
};

function childrenOf(path: string): FolderSelectorOption[] {
    return (tree[path] ?? []).map((name) => ({ name, path: path === '/' ? `/${name}` : `${path}/${name}` }));
}

function parentOf(path: string): string | null {
    if (path === '/') return null;

    return path.slice(0, path.lastIndexOf('/')) || '/';
}

function FolderSelectorDemo(args: ComponentProps<typeof FolderSelector>) {
    const [open, setOpen] = useState(args.open);
    const [browsePath, setBrowsePath] = useState(args.browsePath);
    const [value, setValue] = useState(args.value);

    return (
        <div className="h-[28rem] max-w-md">
            <FolderSelector
                {...args}
                open={open}
                onOpenChange={(next) => {
                    setOpen(next);
                    args.onOpenChange(next);
                }}
                browsePath={browsePath}
                onBrowsePathChange={(path) => {
                    setBrowsePath(path);
                    args.onBrowsePathChange(path);
                }}
                options={args.loading || args.error ? [] : childrenOf(browsePath)}
                parentPath={parentOf(browsePath)}
                value={value}
                onChange={(path) => {
                    setValue(path);
                    setOpen(false);
                    args.onChange(path);
                }}
            />
        </div>
    );
}

const meta = {
    title: 'Navigation/FolderSelector',
    component: FolderSelector,
    args: {
        open: true,
        browsePath: '/mnt/media',
        value: '',
        options: [],
        onBrowsePathChange: fn(),
        onChange: fn(),
        onLoadMore: fn(),
        onOpenChange: fn(),
        onRetry: fn(),
    },
    render: (args) => <FolderSelectorDemo {...args} />,
} satisfies Meta<typeof FolderSelector>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Browsing: Story = {};

export const Closed: Story = { args: { open: false } };

export const ClosedWithValue: Story = { args: { open: false, value: '/mnt/media/music' } };

export const Loading: Story = { args: { loading: true } };

export const LoadFailed: Story = {
    args: { error: 'Permission denied: /mnt/media. The server user cannot list this folder.' },
};

export const Empty: Story = { args: { browsePath: '/mnt/media/movies' } };

export const HasMore: Story = { args: { browsePath: '/mnt/media/music', hasMore: true } };

export const LoadingMore: Story = { args: { browsePath: '/mnt/media/music', hasMore: true, loadingMore: true } };

export const LongNames: Story = { args: { browsePath: '/mnt/media/photos' } };

export const Disabled: Story = { args: { open: false, disabled: true, value: '/mnt/media/music' } };
