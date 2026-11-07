import type { Meta, StoryObj } from '@storybook/react-vite';

import { Text } from '../typography/Typography';
import { ScrollArea } from './ScrollArea';

const tracks = [
    'So What',
    'Freddie Freeloader',
    'Blue in Green',
    'All Blues',
    'Flamenco Sketches',
    'Footprints',
    'Speak No Evil',
    'Infant Eyes',
    'Wild Flower',
    'Dance Cadaverous',
    'Witch Hunt',
    'Fee-Fi-Fo-Fum',
    'Naima',
    'Giant Steps',
    'Countdown',
    'Mr. P.C.',
];

const meta = {
    title: 'Layout/ScrollArea',
    component: ScrollArea,
    args: {
        'aria-label': 'Tracks',
        tabIndex: 0,
        children: (
            <ol className="flex flex-col">
                {tracks.map((track, index) => (
                    <li key={track} className="border-base-300/70 flex gap-3 border-b py-2 last:border-b-0">
                        <Text as="span" tone="muted" className="w-5 text-right tabular-nums">
                            {index + 1}
                        </Text>
                        <Text as="span">{track}</Text>
                    </li>
                ))}
            </ol>
        ),
    },
    argTypes: { children: { control: false } },
    decorators: [
        (Story) => (
            <div className="border-base-300 max-w-sm rounded-lg border p-3">
                <Story />
            </div>
        ),
    ],
} satisfies Meta<typeof ScrollArea>;

export default meta;

type Story = StoryObj<typeof meta>;

/** A list taller than 16rem scrolls inside the area instead of the page. */
export const Default: Story = {};

/** Content shorter than the cap takes only its own height. */
export const Short: Story = {
    args: {
        children: (
            <ol className="flex flex-col">
                {tracks.slice(0, 3).map((track) => (
                    <li key={track} className="py-2">
                        <Text as="span">{track}</Text>
                    </li>
                ))}
            </ol>
        ),
    },
};
