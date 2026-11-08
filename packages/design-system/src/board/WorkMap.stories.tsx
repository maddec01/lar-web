import type { Meta, StoryObj } from '@storybook/react-vite';
import { ChevronDownIcon, MessageSquareTextIcon, PlayIcon } from 'lucide-react';
import { useState } from 'react';
import { fn } from 'storybook/test';

import { Button } from '../actions/Button';
import { buttonKind } from './ButtonKinds';
import { ItemTitle } from './ItemParts';
import { PartKindLabel } from './PartsList';
import { PullRequestRef } from './PullRequests';
import { SliceBar } from './Slices';
import { SourceIcon } from './SourceIcon';
import { StatusGlyph } from './StatusGlyph';
import {
    HistoryRow,
    MapBand,
    MapCanvas,
    MapCheckNode,
    MapEdgeLabel,
    MapEdges,
    MapHistoryGroup,
    MapHistoryList,
    MapLaneName,
    MapNode,
    MapPartNode,
    WorkMapFrame,
} from './WorkMap';

const W = 900;
const H = 330;
const NODE_W = 260;
const NODE_H = 104;

function SampleMap() {
    const [hover, setHover] = useState<string | null>(null);
    const [history, setHistory] = useState(false);
    const dim = (key: string) => !!hover && hover !== key;

    return (
        <WorkMapFrame>
            <MapCanvas width={W} height={H}>
                <MapBand index={0} top={0} height={140} width={W} labelWidth={116}>
                    <MapLaneName lane="decisions">Decisions</MapLaneName>
                </MapBand>
                <MapBand index={1} top={140} height={140} width={W} labelWidth={116}>
                    <MapLaneName lane="builds">Builds</MapLaneName>
                </MapBand>
                <MapEdges
                    width={W}
                    height={H}
                    markerId="story-map"
                    edges={[
                        { key: 'a b', d: 'M396 70 C 430 70, 430 210, 464 210', done: true, lit: false, dim: false },
                        {
                            key: 'b c',
                            d: 'M724 210 L 760 210',
                            done: false,
                            lit: hover === 'b',
                            dim: !!hover && hover !== 'b',
                        },
                    ]}
                />
                <MapEdgeLabel
                    edge="h a"
                    label="2 completed prerequisites"
                    names="#201, #202"
                    left={136}
                    top={3}
                    maxWidth={NODE_W}
                    onOpen={() => setHistory(true)}
                />
                <MapNode left={136} top={18} dim={dim('a')} onHover={(on) => setHover(on ? 'a' : null)}>
                    <MapPartNode
                        id="a"
                        width={NODE_W}
                        height={NODE_H}
                        attention="asks"
                        picked={false}
                        openLabel="Open #204"
                        title="#204 Sign-in screen · Needs you"
                        onOpen={fn()}
                        source={<SourceIcon corner source="github" label="GitHub issue." />}
                        head={<PartKindLabel kind="grill">Grill</PartKindLabel>}
                        action={
                            <Button {...buttonKind('open')} leftIcon={<MessageSquareTextIcon />}>
                                Answer in T3
                            </Button>
                        }
                        name={<ItemTitle reference="#204" title="Sign-in screen" />}
                        glyph={<StatusGlyph status="Needs you" size="sm" />}
                        facts="Needs you"
                    />
                </MapNode>
                <MapNode left={464} top={158} dim={dim('b')} onHover={(on) => setHover(on ? 'b' : null)}>
                    <MapPartNode
                        id="b"
                        width={NODE_W}
                        height={NODE_H}
                        attention="waits"
                        picked
                        openLabel="Open #205"
                        title="#205 Owner accounts · Ready · Waiting on #204"
                        onOpen={fn()}
                        source={<SourceIcon corner source="local" label="Saved only on this machine." />}
                        head={<PartKindLabel kind="build">Build</PartKindLabel>}
                        action={
                            <Button
                                {...buttonKind('start')}
                                leftIcon={<PlayIcon />}
                                shrinks
                                rightIcon={<ChevronDownIcon />}
                            >
                                Start after
                            </Button>
                        }
                        name={<ItemTitle reference="#205" title="Owner accounts" />}
                        glyph={<StatusGlyph status="Ready" size="sm" />}
                        facts="Ready · Waiting on #204"
                        slices={
                            <SliceBar
                                slices={[
                                    { name: '#1', progress: 'done' },
                                    { name: '#2', progress: 'waiting' },
                                ]}
                            />
                        }
                    />
                </MapNode>
                <MapNode left={760} top={158} dim={dim('c')} onHover={(on) => setHover(on ? 'c' : null)}>
                    <MapCheckNode
                        width={120}
                        height={NODE_H}
                        label="end-to-end check"
                        title="Sign in and stream away from home"
                        glyph={<StatusGlyph status="Queued" size="sm" />}
                        steps="4 steps · after #205"
                        stepsTitle="After #205"
                    />
                </MapNode>
                <MapHistoryGroup
                    open={history}
                    top={288}
                    height={36}
                    dim={dim('history')}
                    glyph={<StatusGlyph status="Done" />}
                    text="2 completed parts"
                    showLabel="Show"
                    hideLabel="Hide"
                    onToggle={() => setHistory(!history)}
                    onHover={(on) => setHover(on ? 'history' : null)}
                />
            </MapCanvas>
            {history && (
                <MapHistoryList width={W}>
                    <HistoryRow
                        id="h1"
                        glyph={<StatusGlyph status="Done" size="sm" />}
                        kind={<PartKindLabel kind="research">Research</PartKindLabel>}
                        name="#201 Relay options"
                        onOpen={fn()}
                        title={<ItemTitle reference="#201" title="Relay options" />}
                        side={<PullRequestRef label="PR #41 (merged)" />}
                    />
                    <HistoryRow
                        id="h2"
                        glyph={<StatusGlyph status="Done" size="sm" />}
                        kind={<PartKindLabel kind="build">Build</PartKindLabel>}
                        name="#202 Device tokens"
                        onOpen={fn()}
                        title={<ItemTitle reference="#202" title="Device tokens" />}
                        after="after #201"
                        afterTitle="after #201 Relay options"
                        side={
                            <Button
                                {...buttonKind('open')}
                                iconOnly
                                leftIcon={<MessageSquareTextIcon />}
                                aria-label="Open thread"
                            />
                        }
                    />
                </MapHistoryList>
            )}
        </WorkMapFrame>
    );
}

const meta = {
    title: 'Board/WorkMap',
    component: WorkMapFrame,
    args: { children: null },
    render: () => <SampleMap />,
} satisfies Meta<typeof WorkMapFrame>;

export default meta;

type Story = StoryObj<typeof meta>;

/** Lanes, a part that asks you and one waiting, arrows, the check, and history folded below; hover a part to light its
 *  arrows, and open the history to list it. */
export const Map_: Story = { name: 'Map' };
