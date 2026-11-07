import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';

import { Button } from '../actions/Button';
import { buttonKind } from './ButtonKinds';
import { DetailsHeading, DetailsSection, MainSection } from './ItemDetails';
import {
    AccessNotice,
    ButtonRow,
    DialogActions,
    ItemDialogAside,
    ItemDialogBody,
    ItemDialogColumns,
    ItemSummary,
    SummaryAge,
    SummaryBlocked,
    SummaryPanel,
    SummaryParent,
    SummaryStatus,
    WarningNote,
} from './ItemDialog';
import { RepoTag } from './ItemParts';
import { SourceIcon } from './SourceIcon';
import { StatusGlyph } from './StatusGlyph';

const meta = {
    title: 'Board/ItemDialog',
    component: ItemSummary,
    decorators: [
        (Story) => (
            <div className="max-w-3xl">
                <Story />
            </div>
        ),
    ],
    args: {
        line: (
            <>
                <SourceIcon source="github" label="GitHub issue" />
                <RepoTag icon={null} name="lar-web" />
                <StatusGlyph status="In progress" running /> <SummaryStatus>Working</SummaryStatus>
                <SummaryAge>· updated 3m ago</SummaryAge>
                <SummaryBlocked>Blocked by #12</SummaryBlocked>
            </>
        ),
        parent: <SummaryParent prefix="Part of" name="#140 Owner accounts" href="#140" />,
        kind: <span>Feature</span>,
        actions: (
            <Button {...buttonKind('other')} onClick={fn()}>
                Attach a ticket
            </Button>
        ),
    },
} satisfies Meta<typeof ItemSummary>;

export default meta;

type Story = StoryObj<typeof meta>;

/** The summary under the title: source, repository, status and age, what blocks it, its parent, kind and ticket. */
export const Summary: Story = {};

/** A control the summary opens in place, under its label. */
export const SummaryWithPanel: Story = {
    args: {
        parent: undefined,
        actions: (
            <SummaryPanel label="Attach a ticket">
                <input aria-label="Ticket" placeholder="Search tickets" />
            </SummaryPanel>
        ),
    },
};

/** The body: notes, then the main column with the sidebar beside it once the dialog is 45rem wide. */
export const Body: StoryObj<typeof ItemDialogBody> = {
    render: () => (
        <ItemDialogBody fill={false} data-item-body>
            <WarningNote icon={<StatusGlyph status="Needs you" presentation="title" />}>Answer in T3</WarningNote>
            <WarningNote data-paused>Paused: the build limit is reached.</WarningNote>
            <AccessNotice
                message="This Mac can't edit tickets in maddec01/lar-web."
                action={
                    <Button {...buttonKind('other')} onClick={fn()}>
                        Recheck access
                    </Button>
                }
            />
            <ItemDialogColumns aside fill={false}>
                <MainSection header={<DetailsHeading presentation="label">Description</DetailsHeading>}>
                    <p className="m-0 text-sm">Owners sign in with a passkey.</p>
                </MainSection>
                <ItemDialogAside>
                    <DetailsSection heading="Waits on">
                        <p className="m-0 text-sm">#12 Sessions table</p>
                    </DetailsSection>
                </ItemDialogAside>
            </ItemDialogColumns>
        </ItemDialogBody>
    ),
};

/** The footer's groups: the moves at its start, in small text, and the rest at its end. */
export const FooterActions: StoryObj<typeof DialogActions> = {
    render: () => (
        <div className="flex items-center justify-between gap-3">
            <DialogActions presentation="leading">
                <Button {...buttonKind('control')} onClick={fn()}>
                    Move to List
                </Button>
            </DialogActions>
            <DialogActions>
                <Button {...buttonKind('other')} onClick={fn()}>
                    GitHub
                </Button>
                <Button {...buttonKind('main')} onClick={fn()}>
                    Start build
                </Button>
            </DialogActions>
        </div>
    ),
};

/** Rows of a section's buttons: on one line, wrapping, or with a status beside them. */
export const ButtonRows: StoryObj<typeof ButtonRow> = {
    render: () => (
        <div className="grid w-72 gap-3">
            {(['row', 'wrap', 'status'] as const).map((layout) => (
                <ButtonRow key={layout} layout={layout}>
                    <Button {...buttonKind('other')} onClick={fn()}>
                        Accept edit
                    </Button>
                    <Button {...buttonKind('other')} onClick={fn()}>
                        Reject edit
                    </Button>
                </ButtonRow>
            ))}
        </div>
    ),
};
