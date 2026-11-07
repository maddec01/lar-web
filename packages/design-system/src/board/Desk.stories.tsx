import type { Meta, StoryObj } from '@storybook/react-vite';
import { CircleDotIcon, GitPullRequestIcon, HandIcon, MessageSquareTextIcon } from 'lucide-react';
import { fn } from 'storybook/test';

import { Button } from '../actions/Button';
import { Badge } from '../display/Badge';
import { buttonKind } from './ButtonKinds';
import { DeskCard, DeskHint, DeskMergeState, DeskSection } from './Desk';

const card = (id: string, title: string, next: React.ReactNode, picked = false) => (
    <DeskCard
        key={id}
        item={id}
        picked={picked}
        onOpen={fn()}
        source={<GitPullRequestIcon className="size-3.5" />}
        kind={<Badge hue={25}>Bug</Badge>}
        age="2h"
        title={`#${id} ${title}`}
        name={`#${id} ${title}`}
        statusIcon={<HandIcon style={{ color: 'var(--you)' }} />}
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
                <DeskMergeState state="can merge" checks="12 passed" />,
                true,
            ),
            card(
                '62',
                'A ticket whose title is long enough to truncate in the card',
                <DeskMergeState state="conflicts" checks="3 passed · 1 failed" />,
            ),
            card('63', 'Answer the shaping question', <DeskHint>Waiting on your answer in T3</DeskHint>),
        ],
    },
} satisfies Meta<typeof DeskSection>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Cards: Story = {};

/** An empty desk is one small line. */
export const Empty: Story = { args: { count: 0, children: undefined, empty: 'Nothing waits on you.' } };

export const MergeStates: Story = {
    render: () => (
        <div className="grid gap-2 text-[11px]">
            {(['can merge', 'checking', 'blocked', 'conflicts'] as const).map((state) => (
                <span key={state} className="flex items-center gap-1.5">
                    <CircleDotIcon className="size-3" />
                    <DeskMergeState state={state} checks="4 passed · 1 running" />
                </span>
            ))}
        </div>
    ),
};
