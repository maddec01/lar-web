import type { Meta, StoryObj } from '@storybook/react-vite';
import { ChevronDownIcon, MessageSquareTextIcon, PlayIcon } from 'lucide-react';
import { fn } from 'storybook/test';

import { Button } from '../actions/Button';
import {
    AttentionEntry,
    BoardAttentionList,
    AttentionMark,
    AttentionNone,
    EntryButton,
    PartLink,
    PartName,
    RefButton,
} from './Attention';
import { buttonKind } from './ButtonKinds';
import { ItemTitle } from './ItemParts';
import { SourceIcon } from './SourceIcon';
import { StatusGlyph } from './StatusGlyph';

const part = (n: number, title: string, status: 'Needs you' | 'Ready' | 'Queued') => (
    <PartLink title={`#${n} ${title}`} onOpen={fn()}>
        <PartName
            source={<SourceIcon source="github" label="GitHub issue. Saved on GitHub." />}
            glyph={<StatusGlyph status={status} />}
        >
            <ItemTitle reference={`#${n}`} title={title} />
        </PartName>
    </PartLink>
);

const meta = {
    title: 'Board/Attention',
    component: BoardAttentionList,
    decorators: [
        (Story) => (
            <div className="w-full max-w-160">
                <Story />
            </div>
        ),
    ],
    args: {
        rows: [
            {
                key: 'you',
                label: 'Needs you',
                tone: 'yours',
                entries: [
                    <AttentionEntry key="p" main={<EntryButton onOpen={fn()}>#200 lar cloud</EntryButton>} />,
                    <AttentionEntry
                        key="a"
                        main={part(204, 'Sign-in screen', 'Needs you')}
                        side={
                            <Button {...buttonKind('open')} leftIcon={<MessageSquareTextIcon />}>
                                Answer in T3
                            </Button>
                        }
                    />,
                ],
            },
            {
                key: 'blocked',
                label: 'Blocked slices',
                tone: 'blocked',
                entries: [
                    <AttentionEntry
                        key="b"
                        main={
                            <AttentionMark mark="blocked" clamp>
                                <ItemTitle reference="#3" title="Screen waits on the endpoint" />
                            </AttentionMark>
                        }
                        side={
                            <>
                                slice of (
                                <RefButton title="Relay endpoint" onOpen={fn()}>
                                    #203
                                </RefButton>
                                ) · waits on a re-slice
                            </>
                        }
                    />,
                ],
            },
            {
                key: 'ready',
                label: 'Ready to start',
                tone: 'ready',
                entries: [
                    <AttentionEntry
                        key="r"
                        main={part(205, 'Owner accounts', 'Ready')}
                        side={
                            <Button {...buttonKind('start')} leftIcon={<PlayIcon />} rightIcon={<ChevronDownIcon />}>
                                Start
                            </Button>
                        }
                    />,
                ],
            },
            {
                key: 'dependencies',
                label: 'Dependencies',
                tone: 'blocked',
                entries: [
                    <AttentionEntry
                        key="m"
                        main={<AttentionMark mark="met">platform: device tokens</AttentionMark>}
                        side="met · holds #205"
                    />,
                ],
            },
            {
                key: 'fog',
                label: 'Open questions',
                tone: 'fog',
                entries: [
                    <AttentionEntry key="f" main={<AttentionMark mark="fog">Who pays for the relay?</AttentionMark>} />,
                    <AttentionEntry
                        key="g"
                        main={<AttentionMark mark="fog">Which networks need a relay?</AttentionMark>}
                    />,
                ],
            },
        ],
    },
} satisfies Meta<typeof BoardAttentionList>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Rows: Story = {};

export const Nothing: Story = { render: () => <AttentionNone>Nothing holds this up.</AttentionNone> };
