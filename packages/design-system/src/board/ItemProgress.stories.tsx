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
            <div className="w-144">
                <ItemProgressPanel data-progress>
                    <Story />
                </ItemProgressPanel>
            </div>
        ),
    ],
    args: { steps, at: 3, name: 'Ready', ordinal: 'Stage 4 of 8', color: statusColor.Ready },
} satisfies Meta<typeof WorkflowSteps>;

export default meta;

type Story = StoryObj<typeof meta>;

/** The current stage is named with an explicit ordinal (Stage 4 of 8), distinct from the slice count. */
export const Steps: Story = {};

/** While a build runs, its slices take the current step’s place. */
export const SplitBySlices: Story = {
    args: {
        at: 4,
        name: 'Working',
        ordinal: 'Stage 5 of 8',
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

/** A concept’s parts done out of its parts. */
export const Parts: Story = {
    render: () => (
        <PartsProgress label="Parts" completed={5} total={9}>
            5/9 done
        </PartsProgress>
    ),
};

/** The slices as chips under their count, with their bar when the steps don’t hold it. */
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

/** Slices whose chips open their tickets, as the item dialog shows them instead of a separate sub-ticket list. */
export const LinkedSlices: Story = {
    render: () => (
        <SliceChips count={<ProgressCount label="Slices">1/3 done</ProgressCount>}>
            {slices.map((s) => (
                <SliceChip
                    key={s.number}
                    title={`#${s.number} ${s.title} (${s.progress})`}
                    source={<SourceIcon source="github" label="GitHub issue" />}
                    progress={s.progress}
                    number={s.number}
                    name={s.title}
                    href={`https://github.com/lar-works/lar-server/issues/${s.number}`}
                />
            ))}
        </SliceChips>
    ),
};

/** Waiting work takes one equal-width step, outlined until it starts. */
export const Queued: Story = { args: { at: 0, name: 'Queue', ordinal: 'Stage 1 of 7', waiting: true } };
export const FailedChecks: Story = {
    args: { at: 5, name: 'Verify', color: 'var(--color-danger)', ordinal: 'Stage 6 of 7' },
};
