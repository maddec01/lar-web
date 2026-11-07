import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { fn } from 'storybook/test';

import { Checkbox } from '../forms/Checkbox';
import { FormSelect } from '../forms/FormSelect';
import { Input } from '../forms/Input';
import { MarkdownEditor } from '../forms/MarkdownEditor';
import { Stack } from '../layout/Flow';
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
import { LabelsValue } from './ItemDetails';
import { LabelChip } from './ItemParts';

const meta = {
    title: 'Board/AddItem',
    component: DraftFields,
    args: { id: 'item-fields', disabled: false, detailsLabel: 'Details', main: null, details: null },
} satisfies Meta<typeof DraftFields>;

export default meta;

type Story = StoryObj<typeof meta>;

const projects = [
    { value: 'maddec01/lar-web', name: 'lar-web' },
    { value: 'maddec01/lar-server', name: 'lar-server' },
];

/** The New work pane: the title, editor and notes beside the details panel, its ticket part showing the new
 *  ticket's labels. Narrower than 40rem the panel stacks under them. */
export const NewWork: Story = {
    render: (args) => (
        <div className="flex h-[32rem] max-w-4xl flex-col">
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
                            <FormSelect id="story-repo" value="maddec01/lar-web" onChange={fn()} choices={projects} />
                        </PanelField>
                        <DraftTicketPart>
                            <PanelField heading="Labels">
                                <LabelsValue>
                                    <LabelChip label="docs" color="#0075ca" />
                                    <LabelChip label="needs-design" note="new" />
                                </LabelsValue>
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

/** The title bar's Add item button; its label folds away on a title bar under 70rem. */
export const TitleBarButton: Story = {
    render: () => <AddItemButton label="Add item" title="Add item (⌘N)" keyShortcuts="Meta+N" onOpen={fn()} />,
};

const found: TicketSearchMatch[] = [
    { number: 8, title: 'Seek stalls on long tracks' },
    { number: 9, title: 'Seek is slow', note: 'Already added' },
    { number: 12, title: 'A ticket whose title is long enough to truncate at the end of the row it sits on' },
];

function Search({ tickets, result = '' }: { tickets: readonly TicketSearchMatch[]; result?: string }) {
    const [query, setQuery] = useState('seek');

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
        <div className="max-w-xl">
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

/** A search that found nothing says so. */
export const NoMatch: Story = {
    render: () => (
        <div className="max-w-xl">
            <Search tickets={[]} result="No open ticket matches." />
        </div>
    ),
};
