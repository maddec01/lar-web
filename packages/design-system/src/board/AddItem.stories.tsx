import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { fn } from 'storybook/test';

import { Button } from '../actions/Button';
import { LabelChip } from '../display/LabelChip';
import { EmptyState } from '../feedback/EmptyState';
import { Checkbox } from '../forms/Checkbox';
import { Input } from '../forms/Input';
import { MarkdownEditor } from '../forms/MarkdownEditor';
import { OptionSelect } from '../forms/OptionSelect';
import { Inline, Stack } from '../layout/Flow';
import { ViewToggle } from '../navigation/CollectionViewToggle';
import { Modal } from '../overlays/Modal';
import { InlineLink } from '../typography/Link';
import { Text } from '../typography/Typography';
import {
    AddItemButton,
    CreateIssueChoice,
    DraftFields,
    DraftTicketPart,
    PanelField,
    TicketSearch,
    type TicketSearchMatch,
    TicketSearchPane,
} from './AddItem';

const meta = {
    title: 'Board/AddItem',
    component: DraftFields,
    args: { id: 'item-fields', disabled: false, detailsLabel: 'Details', main: null, details: null },
} satisfies Meta<typeof DraftFields>;

export default meta;

type Story = StoryObj<typeof meta>;

const projects = [
    { value: 'maddec01/lar-web', label: 'lar-web' },
    { value: 'maddec01/lar-server', label: 'lar-server' },
];

/** The New work pane: the title, editor and notes beside the details panel, its ticket part showing the new
 *  ticket’s labels. Narrower than 40rem the panel stacks under them. */
export const NewWork: Story = {
    render: (args) => (
        <div className="flex h-128 w-full max-w-4xl flex-col">
            <DraftFields
                {...args}
                main={
                    <>
                        <Input presentation="title" aria-label="Title" placeholder="Title" />
                        <MarkdownEditor label="Description" placeholder="Add a description…" value="" onChange={fn()} />
                        <Text variant="caption" tone="muted">
                            Formats as you type · saved as Markdown
                        </Text>
                    </>
                }
                details={
                    <>
                        <PanelField heading="Project" htmlFor="story-repo">
                            <OptionSelect id="story-repo" value="maddec01/lar-web" onChange={fn()} options={projects} />
                        </PanelField>
                        <DraftTicketPart>
                            <PanelField heading="Labels">
                                <Inline as="span" wrap align="center" space="tight">
                                    <LabelChip label="docs" color="#0075ca" />
                                    <LabelChip label="needs-design" note="new" />
                                </Inline>
                            </PanelField>
                        </DraftTicketPart>
                    </>
                }
            />
        </div>
    ),
};

/** A draft without a ticket says what local work keeps. */
export const LocalWork: Story = {
    render: () => (
        <div className="w-64">
            <DraftTicketPart>
                <Text variant="caption" tone="muted">
                    Local work has its kind alone. Saved only on this machine.
                </Text>
            </DraftTicketPart>
        </div>
    ),
};

/** Create issue in the footer, refused with the reason and the action that checks again. */
export const CreateIssueRefused: Story = {
    render: () => (
        <CreateIssueChoice
            checkbox={<Checkbox label="Create issue" disabled />}
            reason={
                <Text variant="caption" tone="muted">
                    GitHub refused creating issues. <InlineLink onClick={fn()}>Recheck access</InlineLink>
                </Text>
            }
        />
    ),
};

/** The title bar’s Add item button; its label folds away on a title bar under 70rem. */
export const TitleBarButton: Story = {
    render: () => <AddItemButton label="Add item" title="Add item (⌘N)" keyShortcuts="Meta+N" onOpen={fn()} />,
};

const found: TicketSearchMatch[] = [
    { number: 8, title: 'Seek stalls on long tracks' },
    { number: 9, title: 'Seek is slow', note: 'Already added' },
    { number: 12, title: 'A ticket whose title is long enough to truncate at the end of the row it sits on' },
];

function Search({
    tickets,
    result = '',
    initialQuery = 'seek',
}: {
    tickets: readonly TicketSearchMatch[];
    result?: string;
    initialQuery?: string;
}) {
    const [query, setQuery] = useState(initialQuery);

    return (
        <TicketSearch
            id="pick"
            query={query}
            onQueryChange={setQuery}
            onSearch={fn()}
            fieldLabel="Search open tickets"
            placeholder="Words from the title, or #12"
            searchLabel="Search"
            tickets={tickets}
            listLabel="Open tickets"
            onPick={fn()}
            result={result}
        />
    );
}

/** Find a ticket: its pane with the search, the matches and one already on the board. */
export const FindATicket: Story = {
    render: () => (
        <div className="w-full max-w-xl">
            <TicketSearchPane id="pick-ticket">
                <Text variant="caption" tone="muted">
                    Find tickets outside your list, or open one you’ve already added.
                </Text>
                <Stack space="related">
                    <Search tickets={found} />
                </Stack>
            </TicketSearchPane>
        </div>
    ),
};

/** Before the first search, explain how to find a ticket in the selected project. */
export const BeforeTicketSearch: Story = {
    render: () => (
        <div className="flex h-128 w-full max-w-xl flex-col">
            <TicketSearchPane id="before-ticket-search">
                <Search tickets={[]} initialQuery="" />
                <EmptyState
                    size="inline"
                    title="Find an open ticket"
                    description="Search lar-server’s tickets by title or #number."
                />
            </TicketSearchPane>
        </div>
    ),
};

/** A search that found nothing says so. */
export const NoMatch: Story = {
    render: () => (
        <div className="w-full max-w-xl">
            <Search tickets={[]} result="Nothing matches" />
        </div>
    ),
};

/** Long descriptions keep the editor bounded and the details and footer reachable, including at short heights. */
function LongDraft() {
    const [open, setOpen] = useState(true);

    return (
        <>
            <Button variant="secondary" onClick={() => setOpen(true)}>
                Open long draft
            </Button>
            {open && (
                <Modal onClose={() => setOpen(false)}>
                    <Modal.Content
                        title="Add item"
                        presentation="paned"
                        description="Record work and add it to the list."
                    >
                        <Modal.Form>
                            <DraftFields
                                id="long-fields"
                                disabled={false}
                                detailsLabel="Details"
                                main={
                                    <>
                                        <Input aria-label="Title" placeholder="Title" />
                                        <MarkdownEditor
                                            label="Description"
                                            placeholder="Add a description…"
                                            value={Array.from(
                                                { length: 120 },
                                                (_, i) =>
                                                    `Paragraph ${i + 1}: Verify direct streaming and automatic port mapping on each supported network.`,
                                            ).join('\n\n')}
                                            onChange={fn()}
                                            fill="wide"
                                        />
                                    </>
                                }
                                details={
                                    <>
                                        <PanelField heading="Project" htmlFor="long-project">
                                            <OptionSelect
                                                id="long-project"
                                                value="maddec01/lar-server"
                                                onChange={fn()}
                                                options={projects}
                                            />
                                        </PanelField>
                                        <PanelField heading="Kind" htmlFor="long-kind">
                                            <OptionSelect
                                                id="long-kind"
                                                value="feature"
                                                onChange={fn()}
                                                options={[
                                                    { value: 'feature', label: 'Feature' },
                                                    { value: 'bug', label: 'Bug' },
                                                ]}
                                            />
                                        </PanelField>
                                    </>
                                }
                            />
                            <Modal.Footer>
                                <Button type="submit">Add item</Button>
                            </Modal.Footer>
                        </Modal.Form>
                    </Modal.Content>
                </Modal>
            )}
        </>
    );
}

export const LongContent: Story = { render: () => <LongDraft /> };

/** Tabs share one frame height, even when the ticket search has only a few matches. */
function TabbedDraft() {
    const [pane, setPane] = useState('new');

    return (
        <Modal onClose={fn()}>
            <Modal.Content
                title="Add item"
                presentation="paned"
                fitsContent={false}
                headerActions={
                    <ViewToggle
                        presentation="text"
                        label="Add"
                        value={pane}
                        onChange={setPane}
                        options={[
                            { value: 'new', label: 'New work' },
                            { value: 'pick', label: 'Find a ticket' },
                        ]}
                    />
                }
            >
                {pane === 'new' ? (
                    <Modal.Form>
                        <DraftFields
                            id="tabbed-fields"
                            disabled={false}
                            detailsLabel="Details"
                            main={<Input presentation="title" aria-label="Title" placeholder="Title" />}
                            details={
                                <PanelField heading="Project" htmlFor="tabbed-project">
                                    <OptionSelect
                                        id="tabbed-project"
                                        value="maddec01/lar-web"
                                        onChange={fn()}
                                        options={projects}
                                    />
                                </PanelField>
                            }
                        />
                        <Modal.Footer>
                            <Button variant="secondary" onClick={fn()}>
                                Cancel
                            </Button>
                            <Button type="submit">Add item</Button>
                        </Modal.Footer>
                    </Modal.Form>
                ) : (
                    <>
                        <TicketSearchPane id="tabbed-search">
                            <Search tickets={found} />
                        </TicketSearchPane>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={fn()}>
                                Cancel
                            </Button>
                        </Modal.Footer>
                    </>
                )}
            </Modal.Content>
        </Modal>
    );
}

export const Tabbed: Story = { render: () => <TabbedDraft /> };
