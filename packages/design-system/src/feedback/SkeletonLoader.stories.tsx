import type { Meta, StoryObj } from '@storybook/react-vite';

import { SkeletonLoader } from './SkeletonLoader';

const meta = {
    title: 'Feedback/SkeletonLoader',
    component: SkeletonLoader,
    args: { label: 'Loading albums', loading: true, children: null },
} satisfies Meta<typeof SkeletonLoader>;

export default meta;

type Story = StoryObj<typeof meta>;

export const AlbumGrid: Story = {
    render: (args) => (
        <SkeletonLoader {...args}>
            <div className="grid max-w-3xl grid-cols-4 gap-4">
                {Array.from({ length: 8 }, (_, index) => (
                    <div key={index} className="flex flex-col gap-2">
                        <SkeletonLoader.Shape presentation="artwork" />
                        <SkeletonLoader.Shape width="wide" />
                        <SkeletonLoader.Shape width="medium" />
                    </div>
                ))}
            </div>
        </SkeletonLoader>
    ),
};

export const DetailPage: Story = {
    args: { label: 'Loading movie' },
    render: (args) => (
        <SkeletonLoader {...args}>
            <div className="flex max-w-3xl gap-6">
                <div className="w-40 shrink-0">
                    <SkeletonLoader.Shape presentation="poster" />
                </div>
                <div className="flex flex-1 flex-col gap-3">
                    <SkeletonLoader.Shape presentation="heading" width="medium" />
                    <SkeletonLoader.Shape width="short" />
                    <SkeletonLoader.Shape />
                    <SkeletonLoader.Shape />
                    <SkeletonLoader.Shape width="wide" />
                    <SkeletonLoader.Shape presentation="control" width="action" />
                </div>
            </div>
        </SkeletonLoader>
    ),
};

/** Every presentation, labelled, to compare their geometry. */
export const Presentations: Story = {
    args: { label: 'Loading shapes' },
    render: (args) => (
        <SkeletonLoader {...args}>
            <div className="grid max-w-3xl grid-cols-[8rem_1fr] items-center gap-4">
                {(
                    [
                        'artwork',
                        'poster',
                        'video',
                        'card',
                        'chart',
                        'circle',
                        'control',
                        'heading',
                        'line',
                        'metric',
                    ] as const
                ).map((presentation) => (
                    <div key={presentation} className="contents">
                        <span className="text-fg-muted text-sm">{presentation}</span>
                        <div className="w-48">
                            <SkeletonLoader.Shape presentation={presentation} />
                        </div>
                    </div>
                ))}
            </div>
        </SkeletonLoader>
    ),
};

export const Widths: Story = {
    args: { label: 'Loading text' },
    render: (args) => (
        <SkeletonLoader {...args}>
            <div className="flex max-w-md flex-col gap-3">
                {(['full', 'wide', 'medium', 'short', 'action'] as const).map((width) => (
                    <SkeletonLoader.Shape key={width} width={width} />
                ))}
            </div>
        </SkeletonLoader>
    ),
};

export const Loaded: Story = {
    args: { loading: false, children: <p className="text-sm">Kind of Blue · Miles Davis · 1959</p> },
};
