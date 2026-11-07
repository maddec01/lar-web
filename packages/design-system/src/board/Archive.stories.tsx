import type { Meta, StoryObj } from '@storybook/react-vite';

import { Button } from '../actions/Button';
import { ActionStack, BoardNote, SettingConfirm, SettingLastRun } from './Archive';
import { buttonKind } from './ButtonKinds';

const meta = {
    title: 'Board/Archive',
    component: ActionStack,
    args: {
        children: (
            <>
                <Button {...buttonKind('other')}>Export markdown</Button>
                <Button {...buttonKind('other')}>Restore</Button>
            </>
        ),
    },
} satisfies Meta<typeof ActionStack>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Actions: Story = {};

export const ActionsWithError: Story = {
    args: { below: <BoardNote>Exported to ~/Downloads/61.md</BoardNote>, error: 'Restore failed: the branch is gone.' },
};

export const Confirm: StoryObj<typeof SettingConfirm> = {
    render: () => (
        <SettingConfirm
            label="Turn on timed delete"
            message="Turning on timed delete deletes this work now, with its brief, threads and reviews. Export or restore it below first."
            items={['#41 Old spike', '#38 Abandoned redesign']}
            actions={
                <>
                    <Button {...buttonKind('other')}>Cancel</Button>
                    <Button {...buttonKind('main', 'danger')}>Delete 2 now</Button>
                </>
            }
        />
    ),
};

export const LastRun: StoryObj<typeof SettingLastRun> = {
    render: () => (
        <SettingLastRun
            summary="The last timed delete, 3 Nov at 09:12, deleted 4 records."
            kept={['Kept w-41. Its ticket is still open.']}
        />
    ),
};

export const Notes: StoryObj<typeof BoardNote> = {
    render: () => (
        <div className="grid gap-2">
            <BoardNote role="status">Saved the retention setting on this Mac.</BoardNote>
            <BoardNote tone="error" role="alert">
                Enter whole days from 0.
            </BoardNote>
            <BoardNote numeric title="Cost $1.92 · Agent time 19m · Tokens 1.20M">
                $1.92 · 19m · 1.20M tokens
            </BoardNote>
            <div className="@container">
                <BoardNote only="narrow">Shown only in a container narrower than 40rem.</BoardNote>
                <BoardNote only="wide">Shown, on one line, only in a container 40rem or wider.</BoardNote>
            </div>
            <div className="flex w-80 flex-wrap gap-2">
                <span>Kind</span>
                <BoardNote ownLine role="status">
                    Takes a line of its own in a wrapping row.
                </BoardNote>
            </div>
            <div className="w-60">
                <BoardNote breaks role="status">
                    Exported to /Users/ana/Downloads/lar-work-export-2026-11-07/sign-in-screen.md
                </BoardNote>
            </div>
        </div>
    ),
};
