import type { Meta, StoryObj } from '@storybook/react-vite';

import { SliceBar, SliceList, SliceMark, type SliceProgress, SliceRow } from './Slices';
import { SourceIcon } from './SourceIcon';

const progress: SliceProgress[] = ['done', 'done', 'active', 'blocked', 'unknown', 'waiting', 'waiting'];
const slices = progress.map((p, n) => ({ name: `#${n + 1} Slice ${n + 1}`, progress: p }));

const meta = {
    title: 'Board/Slices',
    component: SliceBar,
    decorators: [
        (Story) => (
            <div className="w-60">
                <Story />
            </div>
        ),
    ],
    args: { slices },
} satisfies Meta<typeof SliceBar>;

export default meta;

type Story = StoryObj<typeof meta>;

/** One segment per slice, the active one pulsing. */
export const Bar: Story = {};

/** A row that stops animating keeps its active slice still. */
export const Still: Story = { args: { still: true } };

export const Marks: Story = {
    render: () => (
        <div className="flex gap-3">
            {(['done', 'active', 'blocked', 'unknown', 'waiting'] as const).map((p) => (
                <SliceMark key={p} progress={p} />
            ))}
        </div>
    ),
};

export const List: Story = {
    decorators: [
        (Story) => (
            <div className="w-96">
                <Story />
            </div>
        ),
    ],
    render: () => (
        <SliceList>
            {progress.map((p, n) => (
                <SliceRow
                    key={n}
                    source={<SourceIcon source="github" label="GitHub issue. Saved on GitHub." />}
                    progress={p}
                    number={n ? 300 + n : undefined}
                    title={`Slice ${n + 1}: move the ${p} work along`}
                />
            ))}
        </SliceList>
    ),
};
