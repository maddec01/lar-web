import type { Meta, StoryObj } from '@storybook/react-vite';

import { ActivityLabel, ActivityTrack } from './ActivityTrack';
import {
    ItemProgressPanel,
    PartsProgress,
    ProgressActivity,
    ProgressCount,
    SliceChip,
    SliceChips,
    WorkflowSteps,
} from './ItemProgress';
import { SliceBar, type SliceProgress } from './Slices';
import { SourceIcon } from './SourceIcon';
import { statusColor } from './StatusColors';

const STEPS = ['Queued', 'Shaping', 'Needs you', 'Ready', 'In progress', 'Review', 'Verify', 'Ready to merge'] as const;
const steps = STEPS.map((name, i) => ({ title: name, label: `Step ${i + 1} of ${STEPS.length}: ${name}` }));
const slices: { title: string; progress: SliceProgress; number: number }[] = [
    { title: 'Owner table and sign-up', progress: 'done', number: 144 },
    { title: 'Sign-in sessions', progress: 'active', number: 145 },
    { title: 'Owner settings page', progress: 'waiting', number: 146 },
];

const meta = {
    title: 'Board/ItemProgress',
    component: WorkflowSteps,
    decorators: [
        (Story) => (
            <div className="w-[36rem]">
                <ItemProgressPanel data-progress>
                    <Story />
                </ItemProgressPanel>
            </div>
        ),
    ],
    args: { steps, at: 3, name: 'Ready', color: statusColor.Ready },
} satisfies Meta<typeof WorkflowSteps>;

export default meta;

type Story = StoryObj<typeof meta>;

/** The current step widest and named, in its status's gradient; the past darker, the upcoming faint. */
export const Steps: Story = {};

/** While a build runs, its slices take the current step's place. */
export const SplitBySlices: Story = {
    args: {
        at: 4,
        name: 'Working',
        color: statusColor['In progress'],
        bar: <SliceBar slices={slices.map((s) => ({ name: s.title, progress: s.progress }))} />,
    },
};

/** The steps with the activity under them. */
export const WithActivity: Story = {
    render: (args) => (
        <>
            <WorkflowSteps {...args} />
            <ProgressActivity>
                <ActivityTrack label="Shaping in T3" running />
                <ActivityLabel>Shaping in T3</ActivityLabel>
            </ProgressActivity>
        </>
    ),
};

/** A concept's parts done out of its parts. */
export const Parts: Story = {
    render: () => (
        <PartsProgress label="Parts" completed={5} total={9}>
            5/9 done
        </PartsProgress>
    ),
};

/** The slices as chips under their count, with their bar when the steps don't hold it. */
export const Slices: Story = {
    render: () => (
        <SliceChips
            count={<ProgressCount label="Slices">1/3 done</ProgressCount>}
            bar={<SliceBar slices={slices.map((s) => ({ name: s.title, progress: s.progress }))} still />}
        >
            {slices.map((s) => (
                <SliceChip
                    key={s.number}
                    title={`#${s.number} ${s.title} (${s.progress})`}
                    source={<SourceIcon source="github" label="GitHub issue" />}
                    progress={s.progress}
                    number={s.number}
                    name={s.title}
                />
            ))}
        </SliceChips>
    ),
};
