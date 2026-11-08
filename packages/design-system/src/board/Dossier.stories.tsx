import type { Meta, StoryObj } from '@storybook/react-vite';
import { CircleHelpIcon, LightbulbIcon, ListChecksIcon, MapIcon, MessagesSquareIcon } from 'lucide-react';
import { useState } from 'react';
import { fn } from 'storybook/test';

import { KindBadge } from '../display/KindBadge';
import { ViewToggle } from '../navigation/CollectionViewToggle';
import { Text } from '../typography/Typography';
import {
    DossierBody,
    DossierChips,
    DossierFields,
    DossierLine,
    DossierList,
    DossierNext,
    DossierNote,
    DossierRepos,
    DossierRow,
    DossierTitle,
    DossierTitleCell,
    DossierToggle,
    DossierTools,
    PartsBar,
    PlanningNote,
} from './Dossier';
import { ItemFields, ItemTitle } from './ItemParts';
import { SourceIcon } from './SourceIcon';
import { StagePane } from './StagePane';
import {
    RowCells,
    RowCount,
    RowFirst,
    RowIdentity,
    RowKindCell,
    RowSecondLine,
    RowSide,
    RowStateCell,
    UsageFigures,
} from './StageRow';
import { statusColor } from './StatusColors';
import { StatusGlyph } from './StatusGlyph';

function Concept({ startOpen = false }: { startOpen?: boolean }) {
    const [open, setOpen] = useState(startOpen);
    const [view, setView] = useState<'map' | 'list'>('map');

    return (
        <DossierRow id="I_200" label="#200 lar cloud: website sign-in and relay">
            <DossierLine
                item="I_200"
                picked={false}
                title="2 need you · 1 decision · 4 T3 threads"
                onClick={() => setOpen(!open)}
            >
                <RowFirst>
                    <RowCells>
                        <DossierToggle
                            open={open}
                            label={`${open ? 'Collapse' : 'Expand'} #200`}
                            onToggle={() => setOpen(!open)}
                        />
                        <RowIdentity>
                            <SourceIcon source="github" label="GitHub issue. Saved on GitHub." />
                            <span className="truncate">lar-server</span>
                        </RowIdentity>
                        <RowKindCell>
                            <KindBadge hue={300}>
                                <LightbulbIcon aria-hidden="true" />
                                Concept
                            </KindBadge>
                        </RowKindCell>
                        <DossierTitleCell>
                            <DossierTitle name="lar cloud: website sign-in and relay" onOpen={fn()}>
                                <ItemTitle reference="#200" title="lar cloud: website sign-in and relay" />
                            </DossierTitle>
                            <DossierFields>
                                <ItemFields text="Epic · Active" />
                            </DossierFields>
                            <DossierNote>
                                {open && (
                                    <PlanningNote
                                        note="Planning is saved on this Mac. GitHub refused the write."
                                        role="status"
                                    >
                                        On this Mac
                                    </PlanningNote>
                                )}
                            </DossierNote>
                            <DossierRepos>+ lar-apple</DossierRepos>
                        </DossierTitleCell>
                        <RowStateCell clips={false}>
                            <DossierChips
                                first={{
                                    words: '2 need you',
                                    tone: 'warning',
                                    icon: <StatusGlyph status="Needs you" size="sm" />,
                                }}
                                more={['1 decision', '2 open questions']}
                            />
                        </RowStateCell>
                    </RowCells>
                    <RowSide passEmpty>
                        {open && (
                            <DossierTools>
                                <ViewToggle
                                    size="sm"
                                    value={view}
                                    onChange={setView}
                                    options={[
                                        { value: 'map', label: 'Work map', icon: <MapIcon /> },
                                        { value: 'list', label: 'Parts list', icon: <ListChecksIcon /> },
                                    ]}
                                />
                            </DossierTools>
                        )}
                    </RowSide>
                </RowFirst>
                <RowSecondLine
                    bar={
                        <PartsBar
                            title="2/6 parts done"
                            unread={1}
                            parts={[
                                { key: 'a', title: '#201: Complete', color: 'var(--color-board-done)' },
                                { key: 'b', title: '#202: Complete', color: 'var(--color-board-done)' },
                                { key: 'c', title: '#203: Working', color: statusColor['In progress'], pulse: true },
                                { key: 'd', title: '#204: Needs you', color: statusColor['Needs you'] },
                                { key: 'e', title: '#205: Queued', color: 'var(--color-track)' },
                            ]}
                        />
                    }
                    count={<RowCount title="2/6 parts done">2/6 parts</RowCount>}
                    figures={
                        <UsageFigures
                            title="Agent time · tokens · cost"
                            text="2h 14m · 16.6M · $24.18"
                            partial="partial"
                        />
                    }
                >
                    <DossierNext word="Needs you" yours unseen text="#204 Sign-in screen" />
                </RowSecondLine>
            </DossierLine>
            {open && (
                <DossierBody>
                    <Text variant="caption" tone="muted">
                        No delivery planned.
                    </Text>
                    <Text variant="caption" tone="muted">
                        1 part the board doesn’t read. A Project may no longer be on the board.
                    </Text>
                </DossierBody>
            )}
        </DossierRow>
    );
}

const meta = {
    title: 'Board/Dossier',
    component: DossierRow,
    args: { id: 'I_200', label: '#200', children: null },
    render: () => (
        <StagePane id="dock" title="Concepts and linked work" count={2}>
            <DossierList>
                <Concept startOpen />
                <Concept />
            </DossierList>
        </StagePane>
    ),
} satisfies Meta<typeof DossierRow>;

export default meta;

type Story = StoryObj<typeof meta>;

/** An expanded dossier with its planning note and view toggle, and a folded one. */
export const Dock: Story = {};

/** What’s next in each tone, and chips of each kind. */
export const NextAndChips: Story = {
    render: () => (
        <div className="grid w-96 gap-2 text-xs">
            <DossierNext word="Needs you" yours text="#204 Sign-in screen" />
            <DossierNext word="Moving" text="#203 Relay endpoint" />
            <DossierNext text="Nothing waits on you" />
            <DossierChips first={{ words: '1 decision', tone: 'accent', icon: <MessagesSquareIcon /> }} more={[]} />
            <DossierChips
                first={{ words: 'Refined', tone: 'success', refined: true }}
                more={['1 decision', '2 open questions']}
            />
            <DossierChips first={{ words: '2 open questions', tone: 'neutral', icon: <CircleHelpIcon /> }} more={[]} />
        </div>
    ),
};
