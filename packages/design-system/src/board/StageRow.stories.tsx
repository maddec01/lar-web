import type { Meta, StoryObj } from '@storybook/react-vite';
import { HammerIcon, MessageSquareTextIcon, PlayIcon, SparklesIcon } from 'lucide-react';
import { useState } from 'react';
import { fn } from 'storybook/test';

import { Button } from '../actions/Button';
import { Badge } from '../display/Badge';
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
    RowSliceNote,
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
    <Badge hue={150}>
        <SparklesIcon aria-hidden="true" />
        Feature
    </Badge>
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
                            <Button {...buttonKind('start')} leftIcon={<PlayIcon />} shrinks mark="▾">
                                Start after
                            </Button>
                        </RowSide>
                    </RowFirst>
                    <RowSecondLine bar={<SliceBar slices={slices} />}>
                        <RowBlocked>Blocked by #202 until it completes</RowBlocked>
                        <RowSliceNote
                            title="active #2 Endpoint"
                            first={{ word: 'active', tone: 'active', title: 'Endpoint' }}
                        />
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

/** A Queue row shows its place in the glyph's column and its age as its state. */
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
                            <Button {...buttonKind('start')} leftIcon={<PlayIcon />}>
                                Shape ▾
                            </Button>
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
