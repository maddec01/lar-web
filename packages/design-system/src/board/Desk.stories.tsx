import type { Meta, StoryObj } from '@storybook/react-vite';
import { CircleDotIcon, GitPullRequestIcon, HandIcon, MessageSquareTextIcon } from 'lucide-react';
import { cloneElement } from 'react';
import { fn } from 'storybook/test';

import { Button } from '../actions/Button';
import { KindBadge } from '../display/KindBadge';
import { buttonKind } from './ButtonKinds';
import { DeskCard, DeskHint, DeskMergeState, DeskSection } from './Desk';

const card = (id: string, title: string, next: React.ReactNode, picked = false) => (
    <DeskCard
        key={id}
        item={id}
        picked={picked}
        onOpen={fn()}
        source={<GitPullRequestIcon className="size-3.5" />}
        kind={<KindBadge hue={25}>Bug</KindBadge>}
        age="2h"
        title={`#${id} ${title}`}
        name={`#${id} ${title}`}
        statusIcon={<HandIcon style={{ color: 'var(--color-board-you)' }} />}
        status="Verify"
        next={next}
        actions={
            <>
                <Button {...buttonKind('open')} leftIcon={<GitPullRequestIcon />}>
                    Open PR
                </Button>
                <Button
                    {...buttonKind('open')}
                    iconOnly
                    leftIcon={<MessageSquareTextIcon />}
                    aria-label="Open thread"
                />
            </>
        }
    />
);

const meta = {
    title: 'Board/Desk',
    component: DeskSection,
    args: {
        title: 'Your desk',
        count: 3,
        children: [
            card(
                '61',
                'Move the title bar into the design system',
                <DeskMergeState state="can merge" checks={{ passed: 12, failed: 0, running: 0 }} />,
                true,
            ),
            card(
                '62',
                'A ticket whose title is long enough to truncate in the card',
                <DeskMergeState state="can merge" checks={{ passed: 3, failed: 1, running: 0 }} />,
            ),
            card('63', 'Answer the shaping question', <DeskHint>Waiting on your answer in T3</DeskHint>),
        ],
    },
} satisfies Meta<typeof DeskSection>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Cards: Story = {};

/** More cards than fit: the row fades at the edge with more beyond it, and arrows beside the title scroll it. */
export const Overflowing: Story = {
    args: {
        count: 7,
        children: ['71', '72', '73', '74', '75', '76', '77'].map((id, index) =>
            card(
                id,
                ['Fix the sync race', 'Add the export dialog', 'Answer the shaping question', 'Bump the toolchain'][
                    index % 4
                ]!,
                <DeskHint>Waiting on your review</DeskHint>,
            ),
        ),
    },
    decorators: [
        (Story) => (
            <div className="w-full max-w-3xl overflow-hidden px-6">
                <Story />
            </div>
        ),
    ],
};

/** An empty desk is one small line. */
export const Empty: Story = { args: { count: 0, children: undefined, empty: 'Nothing waits on you.' } };

export const MergeStates: Story = {
    render: () => (
        <div className="text-2xs grid gap-2">
            {(['can merge', 'checking', 'blocked', 'conflicts'] as const).map((state) => (
                <span key={state} className="flex items-center gap-1.5">
                    <CircleDotIcon className="size-3" />
                    <DeskMergeState state={state} checks={{ passed: 4, failed: 0, running: 1 }} />
                </span>
            ))}
        </div>
    ),
};

/** Current PR evidence takes precedence over the recorded stage, using the shared status tones. */
export const CurrentPrEvidence: Story = {
    args: {
        count: 2,
        children: [
            cloneElement(card('142', 'Cache probe results between restarts', null), {
                statusState: 'failed',
                status: 'Checks failed',
                actions: <Button {...buttonKind('open')}>Review failed checks</Button>,
            }),
            cloneElement(card('143', 'Update the streaming pipeline', null), {
                statusState: 'active',
                status: 'Checks running',
                actions: <Button {...buttonKind('open')}>Review PR</Button>,
            }),
        ],
    },
};

/** A first read keeps its title and loader, with no provisional zero count. */
export const LoadingDesk: Story = {
    render: () => <DeskSection title="Your desk" count={0} loading empty="Loading projects…" />,
};
