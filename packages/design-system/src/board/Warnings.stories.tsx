import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';

import { Button } from '../actions/Button';
import { CopyButton } from '../display/CopyButton';
import { buttonKind } from './ButtonKinds';
import { BoardWarning, BoardWarnings, ToolMissing } from './Warnings';

const gh = (
    <BoardWarning
        name="gh"
        title="GitHub CLI is logged out."
        dismissLabel="Dismiss: GitHub CLI is logged out."
        onDismiss={fn()}
        action={<Button {...buttonKind('other')}>Recheck</Button>}
    >
        The board reads GitHub through <code>gh</code>. Run <code>gh auth login</code>{' '}
        <CopyButton
            presentation="text"
            label="Copy gh auth login"
            copyText="Copy"
            copiedLabel="Copied"
            value="gh auth login"
        />{' '}
        in a terminal, then press Recheck.
    </BoardWarning>
);

const meta = {
    title: 'Board/Warnings',
    component: BoardWarnings,
    parameters: { layout: 'fullscreen' },
    args: {
        summary: '2 connections need attention',
        toggleLabel: 'Show connection warnings',
        children: (
            <>
                {gh}
                <BoardWarning name="jq" title="jq not found." dismissLabel="Dismiss: jq not found." onDismiss={fn()}>
                    lar-shape’s scripts read gh’s answers with <code>jq</code>. Install it with{' '}
                    <code>brew install jq</code>, then press Recheck.
                </BoardWarning>
            </>
        ),
        action: <Button {...buttonKind('other')}>Diagnostics</Button>,
    },
} satisfies Meta<typeof BoardWarnings>;

export default meta;

type Story = StoryObj<typeof meta>;

/** Collapsed: only the header shows until it’s opened. */
export const Collapsed: Story = {};

export const Open: Story = {
    play: async ({ canvasElement }) =>
        canvasElement.querySelector<HTMLButtonElement>('[aria-label="Show connection warnings"]')?.click(),
};

/** A lost board server shows open, above the list. */
export const WithLead: Story = {
    args: {
        lead: (
            <BoardWarning
                name="client-error"
                tone="danger"
                title="Board disconnected — showing last received data"
                dismissLabel="Dismiss: board disconnected"
                onDismiss={fn()}
            >
                Failed to fetch
            </BoardWarning>
        ),
        leadTitle: 'Board disconnected',
        summary: undefined,
        children: undefined,
    },
};

export const Missing: StoryObj<typeof ToolMissing> = {
    render: () => (
        <div className="flex h-96 flex-col">
            <ToolMissing title="T3 Code not found" action={<Button {...buttonKind('other')}>Recheck</Button>}>
                The board starts threads through T3 Code’s <code>t3</code> command and didn’t find it on the login
                shell’s PATH. Install T3 Code, then press Recheck. The board also looks again every 10 seconds.
            </ToolMissing>
        </div>
    ),
};
