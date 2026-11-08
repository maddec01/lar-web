import type { Meta, StoryObj } from '@storybook/react-vite';
import { ChevronDownIcon, HammerIcon, MessageSquareTextIcon, PlayIcon, SparklesIcon } from 'lucide-react';
import { useState } from 'react';
import { fn } from 'storybook/test';

import { Button } from '../actions/Button';
import { Badge } from '../display/Badge';
import { KindBadge } from '../display/KindBadge';
import { ActivityLine } from './ActivityLine';
import { buttonKind } from './ButtonKinds';
import { ItemTitle } from './ItemParts';
import { PullRequestRef } from './PullRequests';
import { SliceBar, SliceList, SliceRow } from './Slices';
import { SourceIcon } from './SourceIcon';
import { StageList, StagePane } from './StagePane';
import {
    OnYourDesk,
    QueueAge,
    QueuePlace,
    RowBlocked,
    RowFirst,
    RowFoot,
    RowGlyph,
    RowIdentity,
    RowKindCell,
    RowOpen,
    RowPartOf,
    RowSecondLine,
    RowSide,
    RowSliceToggle,
    RowSlices,
    RowState,
    RowStateCell,
    RowTitle,
    RowTitleCell,
    StageRowItem,
    UsageFigures,
} from './StageRow';
import { ActionError, StartLine } from './StartControls';
import { StatusGlyph } from './StatusGlyph';

const identity = (
    <RowIdentity>
        <SourceIcon source="github" label="GitHub issue. Saved on GitHub." />
        <span className="truncate">lar-server</span>
    </RowIdentity>
);
const feature = (
    <KindBadge hue={150}>
        <SparklesIcon aria-hidden="true" />
        Feature
    </KindBadge>
);
const slices = [
    { name: '#1 Model', progress: 'done' as const },
    { name: '#2 Endpoint', progress: 'active' as const },
    { name: '#3 Screen', progress: 'waiting' as const },
];

function BuildRow({ picked = false }: { picked?: boolean }) {
    const [open, setOpen] = useState(false);

    return (
        <StageRowItem item="I_150" picked={picked}>
            <RowFirst>
                <RowOpen onOpen={fn()}>
                    <RowGlyph>
                        <StatusGlyph status="In progress" running />
                    </RowGlyph>
                    {identity}
                    <RowKindCell>{feature}</RowKindCell>
                    <RowTitleCell>
                        <RowTitle name="#150 Relay for streaming away from home">
                            <ItemTitle reference="#150" title="Relay for streaming away from home" />
                        </RowTitle>
                        <RowPartOf>Concept: lar cloud: website sign-in and relay</RowPartOf>
                    </RowTitleCell>
                    <RowStateCell>
                        <RowState title="Thread running">Working</RowState>
                    </RowStateCell>
                </RowOpen>
                <RowSide>
                    <Button
                        {...buttonKind('open')}
                        iconOnly
                        leftIcon={<MessageSquareTextIcon />}
                        aria-label="Open thread"
                    />
                </RowSide>
            </RowFirst>
            <RowSecondLine
                onClick={fn()}
                bar={<SliceBar slices={slices} />}
                count={
                    <RowSliceToggle
                        open={open}
                        label={open ? 'Hide slices' : 'Show slices'}
                        onToggle={() => setOpen(!open)}
                    >
                        1/3 slices
                    </RowSliceToggle>
                }
                prs={<PullRequestRef label="PR #33 (draft)" title="PR #33 (draft)" />}
                figures={<UsageFigures title="Agent time · tokens · cost" text="5h 30m · 31.4M · $46.90" />}
            >
                <ActivityLine state="working" action="pnpm test" age="9s" agents="3 agents" />
            </RowSecondLine>
            {open && (
                <RowSlices>
                    <SliceList>
                        {slices.map((s, n) => (
                            <SliceRow key={n} source={null} progress={s.progress} number={n + 1} title={s.name} />
                        ))}
                    </SliceList>
                </RowSlices>
            )}
        </StageRowItem>
    );
}

const meta = {
    title: 'Board/StageRow',
    component: StageRowItem,
    decorators: [
        (Story) => (
            <div className="w-full">
                <Story />
            </div>
        ),
    ],
    args: { item: 'I_150', picked: false, children: null },
    render: () => (
        <StagePane id="build" title="Build" glyph={<StatusGlyph status="In progress" running />} count={4}>
            <StageList>
                <BuildRow />
                <StageRowItem item="I_140" picked={false}>
                    <RowFirst>
                        <RowOpen onOpen={fn()}>
                            <RowGlyph>
                                <StatusGlyph status="Ready" />
                            </RowGlyph>
                            {identity}
                            <RowKindCell>
                                <Badge>
                                    <HammerIcon aria-hidden="true" />
                                    Build
                                </Badge>
                            </RowKindCell>
                            <RowTitleCell>
                                <RowTitle name="#140 Owner accounts">
                                    <ItemTitle reference="#140" title="Owner accounts" />
                                </RowTitle>
                            </RowTitleCell>
                            <RowStateCell>
                                <RowState>Ready</RowState>
                            </RowStateCell>
                        </RowOpen>
                        <RowSide>
                            <Button
                                {...buttonKind('start')}
                                leftIcon={<PlayIcon />}
                                shrinks
                                rightIcon={<ChevronDownIcon />}
                            >
                                Start after
                            </Button>
                        </RowSide>
                    </RowFirst>
                    <RowSecondLine bar={<SliceBar slices={slices} />}>
                        <RowBlocked>Blocked by #202 until it completes</RowBlocked>
                    </RowSecondLine>
                    <RowFoot>
                        <StartLine>
                            <ActionError role="alert">Auto-build paused: T3 refused the start.</ActionError>
                        </StartLine>
                    </RowFoot>
                </StageRowItem>
                <StageRowItem item="I_31" picked>
                    <RowFirst>
                        <RowOpen onOpen={fn()}>
                            <RowGlyph>
                                <StatusGlyph status="Verify" />
                            </RowGlyph>
                            {identity}
                            <RowKindCell>{feature}</RowKindCell>
                            <RowTitleCell>
                                <RowTitle name="#31 New artwork grid layout">
                                    <ItemTitle reference="#31" title="New artwork grid layout" />
                                </RowTitle>
                            </RowTitleCell>
                            <RowStateCell>
                                <RowState>Verify</RowState>
                            </RowStateCell>
                        </RowOpen>
                        <RowSide>
                            <OnYourDesk>on your desk</OnYourDesk>
                        </RowSide>
                    </RowFirst>
                    <RowSecondLine
                        prs={<PullRequestRef label="PR #32" />}
                        figures={
                            <UsageFigures
                                title="Agent time · tokens · cost. Updating usage"
                                text="47m"
                                updating="Updating usage"
                                partial="partial"
                            />
                        }
                    />
                </StageRowItem>
            </StageList>
        </StagePane>
    ),
} satisfies Meta<typeof StageRowItem>;

export default meta;

type Story = StoryObj<typeof meta>;

/** Rows at work, blocked and on your desk, the middle one picked; the first unfolds its slices. */
export const Rows: Story = {};

/** A Queue row shows its place in the glyph’s column and its age as its state. */
export const QueueRow: Story = {
    render: () => (
        <StagePane id="queue" title="Queue" glyph={<StatusGlyph status="Queued" />} count={1}>
            <StageList>
                <StageRowItem item="I_129" picked={false}>
                    <RowFirst>
                        <RowOpen onOpen={fn()}>
                            <QueuePlace>1</QueuePlace>
                            {identity}
                            <RowKindCell>{feature}</RowKindCell>
                            <RowTitleCell>
                                <RowTitle name="#129 Run more than one 4K HDR stream at a time">
                                    <ItemTitle reference="#129" title="Run more than one 4K HDR stream at a time" />
                                </RowTitle>
                            </RowTitleCell>
                            <RowStateCell>
                                <QueueAge>17d ago</QueueAge>
                            </RowStateCell>
                        </RowOpen>
                        <RowSide>
                            <Button {...buttonKind('start')} leftIcon={<PlayIcon />} rightIcon={<ChevronDownIcon />}>
                                Shape
                            </Button>
                        </RowSide>
                    </RowFirst>
                </StageRowItem>
            </StageList>
        </StagePane>
    ),
};

/** Rows with nothing but figures under them hold the figures beside their action instead, so they keep the height of
 *  a Queue row: a Shaping row with its thread’s button, and one on your desk. */
export const FiguresBesideAction: Story = {
    render: () => (
        <StagePane id="shaping" title="Shaping" glyph={<StatusGlyph status="Shaping" />} count={2}>
            <StageList>
                <StageRowItem item="I_130" picked={false}>
                    <RowFirst>
                        <RowOpen onOpen={fn()}>
                            <RowGlyph>
                                <StatusGlyph status="Shaping" />
                            </RowGlyph>
                            {identity}
                            <RowKindCell>{feature}</RowKindCell>
                            <RowTitleCell>
                                <RowTitle name="#130 Show cold bitmap subtitles">
                                    <ItemTitle reference="#130" title="Show cold bitmap subtitles" />
                                </RowTitle>
                            </RowTitleCell>
                            <RowStateCell>
                                <RowState>Shaping</RowState>
                            </RowStateCell>
                        </RowOpen>
                        <RowSide
                            figures={<UsageFigures title="Agent time · tokens · cost" text="19m · 1.20M · $1.92" />}
                        >
                            <Button
                                {...buttonKind('other')}
                                leftIcon={<MessageSquareTextIcon />}
                                iconOnly
                                aria-label="Open thread"
                            />
                        </RowSide>
                    </RowFirst>
                </StageRowItem>
                <StageRowItem item="I_23" picked={false}>
                    <RowFirst>
                        <RowOpen onOpen={fn()}>
                            <RowGlyph>
                                <StatusGlyph status="Needs you" />
                            </RowGlyph>
                            {identity}
                            <RowKindCell>{feature}</RowKindCell>
                            <RowTitleCell>
                                <RowTitle name="#23 Faster library sync on large collections">
                                    <ItemTitle reference="#23" title="Faster library sync on large collections" />
                                </RowTitle>
                            </RowTitleCell>
                            <RowStateCell>
                                <RowState>Needs you</RowState>
                            </RowStateCell>
                        </RowOpen>
                        <RowSide
                            figures={<UsageFigures title="Agent time · tokens · cost" text="52m · 3.15M · $0.62" />}
                        >
                            <OnYourDesk>on your desk</OnYourDesk>
                        </RowSide>
                    </RowFirst>
                </StageRowItem>
            </StageList>
        </StagePane>
    ),
};

/** The figures: loading with none known yet, partial, and an incomplete total with none to show. */
export const Figures: Story = {
    render: () => (
        <div className="grid w-60 gap-2 text-xs">
            <UsageFigures title="Updating usage" updating="Updating usage" />
            <UsageFigures title="Agent time · tokens · cost" text="19m · 1.20M · $1.92" partial="partial" />
            <UsageFigures title="This total is incomplete" incomplete="Usage incomplete" />
        </div>
    ),
};

/** Current evidence occupies the status column; recorded workflow stays in secondary detail. */
export const EvidenceStatuses: Story = {
    render: () => (
        <StagePane id="evidence" title="Build" count={3}>
            <StageList>
                {['Checks failed', 'Checks running', 'Checking mergeability'].map((status) => (
                    <StageRowItem key={status} item={status} picked={false}>
                        <RowFirst>
                            <RowOpen onOpen={fn()}>
                                <RowGlyph>
                                    <StatusGlyph status="Review" />
                                </RowGlyph>
                                {identity}
                                <RowKindCell>{feature}</RowKindCell>
                                <RowTitleCell>
                                    <RowTitle name="#142 Verify current PR evidence">
                                        #142 Verify current PR evidence
                                    </RowTitle>
                                </RowTitleCell>
                                <RowStateCell>
                                    <RowState title={status}>{status}</RowState>
                                </RowStateCell>
                            </RowOpen>
                            <RowSide>{null}</RowSide>
                        </RowFirst>
                        <RowSecondLine>
                            <span>Recorded stage: Ready to merge</span>
                        </RowSecondLine>
                    </StageRowItem>
                ))}
            </StageList>
        </StagePane>
    ),
};
