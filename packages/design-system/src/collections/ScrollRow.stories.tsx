import type { Meta, StoryObj } from '@storybook/react-vite';

import { SkeletonLoader } from '../feedback/SkeletonLoader';
import { Stack } from '../layout/Flow';
import { Text } from '../typography/Typography';
import { ScrollRow, ScrollRowArrows, ScrollRowItem } from './ScrollRow';
import { useScrollRow } from './useScrollRow';

const slides = [
    'Getting started',
    'Inviting your team',
    'Organising your work',
    'Keyboard shortcuts',
    'Working offline',
    'Sharing a link',
    'What’s new this month',
];

function Still({ index }: { index: number }) {
    return (
        <div
            aria-hidden="true"
            className="aspect-video w-full rounded-lg"
            style={{
                background: `linear-gradient(135deg, hsl(${90 + index * 20} 45% 50%), hsl(${150 + index * 20} 50% 20%))`,
            }}
        />
    );
}

/** A card the row holds: a still over its title and a fact. */
function SlideCard({ title, index }: { title: string; index: number }) {
    return (
        <Stack space="related">
            <Still index={index} />
            <Text variant="label">{`${index + 1}. ${title}`}</Text>
            <Text tone="muted">{`${2 + (index % 3)} min`}</Text>
        </Stack>
    );
}

/** A `ScrollRow` paired with `ScrollRowArrows` in its section header, through `useScrollRow`. */
function SlideRow({ count, loading = false }: { count: number; loading?: boolean }) {
    const { setRow, scroll, canScrollBack, canScrollForward } = useScrollRow(count);

    return (
        <section className="flex max-w-3xl flex-col gap-2">
            <div className="flex items-center justify-between">
                <Text variant="label">Guides</Text>
                <ScrollRowArrows
                    onScroll={scroll}
                    canScrollBack={canScrollBack}
                    canScrollForward={canScrollForward}
                    backLabel="Previous guides"
                    forwardLabel="Next guides"
                />
            </div>
            <ScrollRow
                ref={setRow}
                label="Guides"
                loading={loading}
                loadingLabel="Loading guides"
                placeholder={<SkeletonLoader.Shape presentation="video" />}
            >
                {slides.slice(0, count).map((title, index) => (
                    <ScrollRowItem key={title} value={`guide-${index + 1}`}>
                        <SlideCard title={title} index={index} />
                    </ScrollRowItem>
                ))}
            </ScrollRow>
        </section>
    );
}

const meta = {
    title: 'Collections/ScrollRow',
    component: ScrollRow,
    args: { ref: null, label: 'Guides', loading: false },
    render: (args) => <SlideRow count={slides.length} loading={args.loading} />,
} satisfies Meta<typeof ScrollRow>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Loading: Story = { args: { loading: true } };

/** Both arrows are disabled while the row fits. */
export const Fits: Story = { render: () => <SlideRow count={2} /> };
