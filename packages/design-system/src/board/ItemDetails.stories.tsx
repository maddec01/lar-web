import type { Meta, StoryObj } from '@storybook/react-vite';
import { PencilIcon } from 'lucide-react';
import { fn } from 'storybook/test';

import { Button } from '../actions/Button';
import { IconButton } from '../actions/IconButton';
import { Comment, CommentList } from '../display/Comment';
import { LabelChip } from '../display/LabelChip';
import { Person } from '../display/Person';
import { SkeletonLoader } from '../feedback/SkeletonLoader';
import { Disclosure } from '../forms/FormSection';
import { Inline } from '../layout/Flow';
import { Text } from '../typography/Typography';
import { PartName } from './Attention';
import { buttonKind } from './ButtonKinds';
import {
    AttachmentLink,
    ChangeFailed,
    CheckRun,
    ChipGroup,
    DetailFact,
    DetailsSection,
    DetailsText,
    EditActions,
    FactList,
    HeaderStatus,
    InlineList,
    KindQuestion,
    MainSection,
    MetaArea,
    OutgoingTicket,
    SectionHeader,
    SpecSync,
    SprintCount,
    TextSection,
    TicketLink,
    TicketLinkList,
    WaitsOnList,
} from './ItemDetails';
import { PartRow, PartsList } from './PartsList';
import { SourceIcon } from './SourceIcon';
import { StatusGlyph } from './StatusGlyph';

const meta = {
    title: 'Board/ItemDetails',
    component: MetaArea,
    decorators: [
        (Story) => (
            <div className="max-w-2xl">
                <Story />
            </div>
        ),
    ],
    args: {
        children: (
            <>
                <DetailFact label="Author">
                    <Person name="Ana Silva" />
                </DetailFact>
                <DetailFact label="Assignees">
                    <Inline as="span" wrap space="related">
                        <Person name="Rui Costa" />
                        <Person name="claude-bot" />
                    </Inline>
                </DetailFact>
                <DetailFact label="Labels">
                    <Inline as="span" wrap align="center" space="tight">
                        <ChipGroup data-labels>
                            <LabelChip label="urgent" color="#d73a4a" />
                            <LabelChip
                                label="linked-work"
                                locked
                                lockedLabel="The factory manages this for saved links, so it can't be edited."
                            />
                        </ChipGroup>
                        <IconButton variant="inline" aria-label="Edit labels" icon={<PencilIcon />} />
                    </Inline>
                </DetailFact>
                <DetailFact label="Milestone">
                    <SkeletonLoader.Shape width="action" />
                </DetailFact>
                <DetailFact label="Updated">3h ago</DetailFact>
                <Text variant="caption" tone="muted" ownLine role="status">
                    Changed the ticket's labels: bug → feature.
                </Text>
            </>
        ),
    },
} satisfies Meta<typeof MetaArea>;

export default meta;

type Story = StoryObj<typeof meta>;

/** The meta area's facts, people and labels, wrapping, with a placeholder while the details load. */
export const Meta_: Story = { name: 'Meta area' };

/** A kind change that failed, with what it changed so far and Retry. */
export const KindChangeFailed: Story = {
    args: {
        children: (
            <ChangeFailed
                lines={['GitHub refused the label change.', 'Nothing changed on the ticket.']}
                action={
                    <Button {...buttonKind('other')} onClick={fn()}>
                        Retry
                    </Button>
                }
            />
        ),
    },
};

/** Where the item's kind and its ticket's disagree, with the two answers. */
export const KindDisagreement: Story = {
    args: {
        children: (
            <KindQuestion
                message="Shaping decided this is a Feature. The ticket still says Bug."
                actions={
                    <>
                        <Button {...buttonKind('other')} onClick={fn()}>
                            Update ticket to Feature
                        </Button>
                        <Button {...buttonKind('other')} onClick={fn()}>
                            Keep ticket as Bug
                        </Button>
                    </>
                }
            >
                <Text variant="caption" tone="muted">
                    Update changes #12: labels bug → feature.
                </Text>
            </KindQuestion>
        ),
    },
};

/** The description: its header with Edit, a Spec's sync notice, its text and a folded original. */
export const Description: StoryObj<typeof MainSection> = {
    render: () => (
        <MainSection
            header={
                <SectionHeader heading="Spec">
                    <HeaderStatus>Saved; could not reload the details</HeaderStatus>
                    <Button {...buttonKind('other')} onClick={fn()}>
                        Edit
                    </Button>
                </SectionHeader>
            }
        >
            <SpecSync status="The Spec is waiting to save to the tracker." error="GitHub timed out.">
                <Button {...buttonKind('other')} onClick={fn()}>
                    Retry Spec sync
                </Button>
            </SpecSync>
            <Text>Owners sign in with a passkey.</Text>
            <Disclosure label="Original" presentation="section">
                <Text>Let owners sign in.</Text>
            </Disclosure>
            <TextSection heading="Acceptance Criteria">
                <Text>A passkey signs in.</Text>
            </TextSection>
        </MainSection>
    ),
};

/** The editor's actions: whether it changed, or the save's error in its place, then Cancel and Save. */
export const Editing: StoryObj<typeof EditActions> = {
    render: () => (
        <div className="grid gap-3">
            <EditActions status="Unsaved changes">
                <Button {...buttonKind('other')} onClick={fn()}>
                    Cancel
                </Button>
                <Button {...buttonKind('main')} onClick={fn()}>
                    Save
                </Button>
            </EditActions>
            <EditActions status="Unsaved changes" error="GitHub refused the edit: the issue is locked.">
                <Button {...buttonKind('other')} onClick={fn()}>
                    Cancel
                </Button>
            </EditActions>
        </div>
    ),
};

/** A work record's facts: its build phase and review rounds. */
export const RecordFacts: StoryObj<typeof DetailFact> = {
    render: () => (
        <MainSection as="section" header={<SectionHeader heading="Brief" />}>
            <DetailsText>No brief written yet.</DetailsText>
            <DetailFact label="Build phase" presentation="record">
                Review
            </DetailFact>
            <FactList>
                <DetailFact label="Review round 1" presentation="record">
                    <InlineList items={['correctness: changes', 'tests: pass, 1 of 3 findings open']} />
                </DetailFact>
            </FactList>
        </MainSection>
    ),
};

/** The comments, newest first, then Load older comments. */
export const Comments: StoryObj<typeof CommentList> = {
    render: () => (
        <MainSection header={<SectionHeader heading="Comments · 2" />}>
            <CommentList>
                <Comment author="maddec01" time="2h">
                    <Text>Looks right; ship it.</Text>
                </Comment>
                <Comment author="claude-bot" time="1d">
                    <Text>Opened #145 for the sessions table.</Text>
                </Comment>
            </CommentList>
        </MainSection>
    ),
};

/** The sidebar's lists: what the item waits on, a sprint's children, attachments, and an error. */
export const Sidebar: StoryObj<typeof DetailsSection> = {
    render: () => (
        <div className="grid w-64 gap-4">
            <DetailsSection heading="Waits on">
                <WaitsOnList
                    items={[
                        { key: 'a', title: 'Sessions table', closed: true },
                        { key: 'b', title: 'Passkey support', closed: false },
                    ]}
                />
            </DetailsSection>
            <DetailsSection heading="Children">
                <SprintCount count="This sprint: 1 of 2 done" name="Sprint 14" />
                <TicketLinkList>
                    <TicketLink closed stateLabel="Done" href="#144" reference="#144" title="Owner table" />
                    <TicketLink closed={false} stateLabel="Open" href="#145" reference="#145" title="Sign-in" />
                </TicketLinkList>
            </DetailsSection>
            <DetailsSection heading="Attachments">
                <TicketLinkList>
                    <AttachmentLink href="#flow" name="sign-up-flow.png" />
                </TicketLinkList>
            </DetailsSection>
            <DetailsText tone="error">Could not load linked work items: Timed out</DetailsText>
        </div>
    ),
};

/** A concept's parts, each opening its item: the dossier's PartRow, its state in its meta line and its figures as its
 *  action. */
export const ConceptParts: StoryObj<typeof PartRow> = {
    render: () => (
        <DetailsSection heading="Parts">
            <PartsList>
                <PartRow
                    id="p1"
                    picked={false}
                    title="Pick the session store"
                    onOpen={fn()}
                    name={
                        <PartName
                            source={<SourceIcon source="local" label="Local work" />}
                            glyph={<StatusGlyph status="Done" />}
                        >
                            Pick the session store
                        </PartName>
                    }
                    meta="Complete"
                    action={
                        <Text variant="caption" tone="muted">
                            $0.42 · 6m
                        </Text>
                    }
                />
                <PartRow
                    id="p2"
                    picked={false}
                    title="Build sign-in"
                    onOpen={fn()}
                    name={
                        <PartName
                            source={<SourceIcon source="github" label="GitHub issue" />}
                            glyph={<StatusGlyph status="In progress" running />}
                        >
                            Build sign-in
                        </PartName>
                    }
                    meta="Working"
                    action={null}
                />
            </PartsList>
        </DetailsSection>
    ),
};

/** Create issue's outgoing title and text. */
export const Outgoing: StoryObj<typeof OutgoingTicket> = {
    render: () => (
        <div className="grid w-96 gap-3">
            <OutgoingTicket
                title="Sign in with a passkey"
                text={'## Why\nOwners forget passwords.\n\n## What\nA passkey signs in.'}
                titleLabel="Outgoing title"
                textLabel="Outgoing text"
            />
        </div>
    ),
};

/** A build's checks, folded until opened. */
export const Checks: StoryObj<typeof CheckRun> = {
    render: () => (
        <Disclosure presentation="section" label="Checks" lazy onOpenChange={fn()}>
            <CheckRun command={'"pnpm" "test"'}>
                <Text variant="inherit">apps/web · passed · Run by builder</Text>
            </CheckRun>
        </Disclosure>
    ),
};
