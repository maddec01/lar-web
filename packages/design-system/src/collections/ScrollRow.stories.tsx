import type { Meta, StoryObj } from '@storybook/react-vite';

import { ImageCard } from '../display/ImageCard';
import { Text } from '../typography/Typography';
import { ScrollRow, ScrollRowArrows, ScrollRowItem } from './ScrollRow';
import { useScrollRow } from './useScrollRow';

const episodes = [
    'Pilot',
    'Cat’s in the Bag...',
    '...And the Bag’s in the River',
    'Cancer Man',
    'Gray Matter',
    'Crazy Handful of Nothin’',
    'A No-Rough-Stuff-Type Deal',
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

/** A `ScrollRow` paired with `ScrollRowArrows` in its section header, through `useScrollRow`. */
function EpisodeRow({ count, loading = false }: { count: number; loading?: boolean }) {
    const { setRow, scroll, canScrollBack, canScrollForward } = useScrollRow(count);

    return (
        <section className="flex max-w-3xl flex-col gap-2">
            <div className="flex items-center justify-between">
                <Text variant="label">Season 1</Text>
                <ScrollRowArrows
                    onScroll={scroll}
                    canScrollBack={canScrollBack}
                    canScrollForward={canScrollForward}
                    backLabel="Previous episodes"
                    forwardLabel="Next episodes"
                />
            </div>
            <ScrollRow ref={setRow} label="Season 1 episodes" loading={loading} loadingLabel="Loading episodes">
                {episodes.slice(0, count).map((title, index) => (
                    <ScrollRowItem key={title} value={`s1e${index + 1}`}>
                        <ImageCard
                            title={`${index + 1}. ${title}`}
                            subtitle="Vince Gilligan"
                            meta={`${47 + (index % 3)} min`}
                            artwork={<Still index={index} />}
                            href={`#s1e${index + 1}`}
                        />
                    </ScrollRowItem>
                ))}
            </ScrollRow>
        </section>
    );
}

const meta = {
    title: 'Collections/ScrollRow',
    component: ScrollRow,
    args: { ref: null, label: 'Season 1 episodes', loading: false },
    render: (args) => <EpisodeRow count={episodes.length} loading={args.loading} />,
} satisfies Meta<typeof ScrollRow>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Episodes: Story = {};

export const Loading: Story = { args: { loading: true } };

/** Both arrows are disabled while the row fits. */
export const Fits: Story = { render: () => <EpisodeRow count={2} /> };
