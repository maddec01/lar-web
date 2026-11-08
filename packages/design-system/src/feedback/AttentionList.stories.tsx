import type { Meta, StoryObj } from '@storybook/react-vite';

import { Button } from '../actions/Button';
import { AttentionList } from './AttentionList';

/** Stacked problems in one "Needs attention" surface, one row per problem, each with its own action. */
const meta = {
    title: 'Feedback/AttentionList',
    component: AttentionList,
    args: { title: 'Needs attention', children: null },
    render: (args) => (
        <div className="max-w-2xl">
            <AttentionList {...args} />
        </div>
    ),
} satisfies Meta<typeof AttentionList>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Warnings: Story = {
    args: {
        count: 2,
        children: (
            <>
                <AttentionList.Item
                    tone="warning"
                    title="2 catalogs failed their last check"
                    description="Documentaries and TV Shows couldn’t be read. Their media stays available."
                    action={
                        <Button variant="secondary" size="sm">
                            Review catalogs
                        </Button>
                    }
                />
                <AttentionList.Item
                    tone="warning"
                    title="1 device is waiting for approval"
                    description="Marta’s iPhone asked to sign in 5 minutes ago."
                    action={
                        <Button variant="secondary" size="sm">
                            Review device
                        </Button>
                    }
                />
            </>
        ),
    },
};

/** Once one problem stops something working, the surface takes the danger tone; each row keeps its own. */
export const Mixed: Story = {
    args: {
        tone: 'danger',
        count: 3,
        children: (
            <>
                <AttentionList.Item
                    tone="danger"
                    title="Storage is full"
                    description="Lar can’t write new artwork or transcodes until /var/lib/lar has room."
                    action={
                        <Button variant="secondary" size="sm">
                            Open storage
                        </Button>
                    }
                />
                <AttentionList.Item
                    tone="warning"
                    title="TheMovieDB isn’t answering"
                    description="New movies wait for their metadata; Lar retries every 10 minutes."
                    action={
                        <Button variant="secondary" size="sm">
                            Try again now
                        </Button>
                    }
                />
                <AttentionList.Item tone="warning" title="Remote access is waiting for the router" />
            </>
        ),
    },
};

/** One control for the whole list in the header, such as Lar Factory's Diagnostics, and rows the reader can close. */
export const WithActionAndDismiss: Story = {
    args: {
        count: 2,
        action: (
            <Button variant="secondary" size="sm">
                Diagnostics
            </Button>
        ),
        children: (
            <>
                <AttentionList.Item
                    tone="warning"
                    title="GitHub CLI is logged out."
                    description={
                        <>
                            The board reads GitHub through <code>gh</code>. Run <code>gh auth login</code> in a
                            terminal, then press Recheck.
                        </>
                    }
                    action={
                        <Button variant="secondary" size="sm">
                            Recheck
                        </Button>
                    }
                    dismissLabel="Dismiss: GitHub CLI is logged out."
                    onDismiss={() => {}}
                />
                <AttentionList.Item
                    tone="warning"
                    title="jq not found."
                    description={
                        <>
                            lar-shape’s scripts read gh’s answers with <code>jq</code>. Install it with{' '}
                            <code>brew install jq</code>.
                        </>
                    }
                    dismissLabel="Dismiss: jq not found."
                    onDismiss={() => {}}
                />
            </>
        ),
    },
};

/** Folded under its header until the reader opens it, as Lar Factory keeps its connection warnings. */
export const Collapsible: Story = {
    args: {
        ...WithActionAndDismiss.args,
        title: '2 connections need attention',
        count: undefined,
        collapsible: { defaultOpen: false, toggleLabel: 'Show connection warnings' },
    },
};

/** On a phone's width every action moves under its row's text, at the text's start. */
export const Narrow: Story = {
    args: Mixed.args,
    render: (args) => (
        <div className="max-w-90">
            <AttentionList {...args} />
        </div>
    ),
};

const review = (
    <Button variant="secondary" size="sm">
        Review
    </Button>
);

/** lar-server's dashboard: each failure in one sentence and one "Task · Reason" line, cut to a line because Review
 *  opens the whole story; the same Review as every status row. */
export const FailedWork: Story = {
    args: {
        count: 3,
        tone: 'danger',
        children: (
            <>
                <AttentionList.Item
                    tone="danger"
                    singleLine
                    title="Documentaries failed its last scan"
                    description="File scan · Folder not found"
                    action={review}
                />
                <AttentionList.Item
                    tone="danger"
                    singleLine
                    title="TV Shows failed its last scan"
                    description="Metadata · Lar couldn’t read “The Quiet Harbour/Season 01/The Quiet Harbour - S01E04 - Low Tide.mkv”."
                    action={review}
                />
                <AttentionList.Item
                    tone="danger"
                    singleLine
                    title="Video calibration failed"
                    description="Lar couldn’t complete video calibration because of an internal database conflict."
                    action={review}
                />
            </>
        ),
    },
};

/** The same failures at a phone's width: one line each, Review still beside the text. */
export const FailedWorkNarrow: Story = {
    args: FailedWork.args,
    render: Narrow.render,
};
