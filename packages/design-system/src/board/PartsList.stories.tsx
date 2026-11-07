import type { Meta, StoryObj } from '@storybook/react-vite';
import { MessageSquareTextIcon } from 'lucide-react';
import { useState } from 'react';
import { fn } from 'storybook/test';

import { Button } from '../actions/Button';
import { PartName } from './Attention';
import { buttonKind } from './ButtonKinds';
import { ItemTitle } from './ItemParts';
import { PartKindLabel, PartRow, PartsList, PartTrack, PartWaits, ShowDoneToggle, ThreadLine } from './PartsList';
import { SourceIcon } from './SourceIcon';
import { RowCount, RowSecondLine, UsageFigures } from './StageRow';
import { StageTrack } from './StageTrack';
import { statusColor } from './StatusColors';
import { StatusGlyph } from './StatusGlyph';

const stages = ['Refining', 'Ready', 'Building', 'Review', 'Verify'];

function Parts() {
    const [done, setDone] = useState(false);

    return (
        <PartsList
            showDone={
                <ShowDoneToggle open={done} onToggle={() => setDone(!done)}>
                    {done ? 'Hide 2 done' : 'Show 2 done'}
                </ShowDoneToggle>
            }
        >
            <PartRow
                id="I_203"
                picked={false}
                title="#203 Relay endpoint"
                onOpen={fn()}
                name={
                    <PartName
                        source={<SourceIcon source="github" label="GitHub issue." />}
                        glyph={<StatusGlyph status="In progress" running />}
                    >
                        <ItemTitle reference="#203" title="Relay endpoint" />
                    </PartName>
                }
                meta={
                    <>
                        <PartKindLabel kind="build">Build</PartKindLabel>
                        <PartTrack>
                            <StageTrack
                                stages={stages}
                                at={2}
                                color={statusColor['In progress']}
                                glyph={<StatusGlyph status="In progress" running />}
                                title="Working"
                            />
                        </PartTrack>
                        <span>Working</span>
                    </>
                }
                action={
                    <Button
                        {...buttonKind('open')}
                        iconOnly
                        leftIcon={<MessageSquareTextIcon />}
                        aria-label="Open thread"
                    />
                }
                second={
                    <RowSecondLine
                        count={<RowCount>1/3 slices</RowCount>}
                        figures={<UsageFigures title="Agent time · tokens · cost" text="45m · 3.12M · $6.40" />}
                    >
                        <ThreadLine
                            title="Build the relay endpoint"
                            glyph={<StatusGlyph status="In progress" running presentation="compact" />}
                            name="T3 · Build the relay endpoint"
                            state="running"
                        />
                    </RowSecondLine>
                }
            />
            <PartRow
                id="I_205"
                picked
                title="#205 Owner accounts"
                onOpen={fn()}
                name={
                    <PartName
                        source={<SourceIcon source="local" label="Saved only on this machine." />}
                        glyph={<StatusGlyph status="Queued" />}
                    >
                        <ItemTitle title="Owner accounts" />
                    </PartName>
                }
                meta={<PartKindLabel kind="grill">Grill</PartKindLabel>}
                action={<PartWaits>waits on #203, #204</PartWaits>}
            />
        </PartsList>
    );
}

const meta = {
    title: 'Board/PartsList',
    component: PartsList,
    args: { children: null },
    render: () => (
        <div className="@container w-[48rem]">
            <Parts />
        </div>
    ),
} satisfies Meta<typeof PartsList>;

export default meta;

type Story = StoryObj<typeof meta>;

/** A part at work and a picked one waiting, and the button that unfolds the done ones. */
export const Parts_: Story = { name: 'Parts' };

/** Each kind's label. */
export const Kinds: Story = {
    render: () => (
        <div className="flex flex-wrap gap-3">
            {(['build', 'decision', 'grill', 'prototype', 'research', 'task'] as const).map((kind) => (
                <PartKindLabel key={kind} kind={kind}>
                    {kind}
                </PartKindLabel>
            ))}
        </div>
    ),
};
