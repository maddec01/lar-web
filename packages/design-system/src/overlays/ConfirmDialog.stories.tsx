import type { Meta, StoryObj } from '@storybook/react-vite';
import { type ComponentProps, useState } from 'react';
import { fn } from 'storybook/test';

import { Button } from '../actions/Button';
import { ConfirmDialog } from './ConfirmDialog';

/** Opens with the story, and reopens from the button after it is closed. */
function ConfirmDialogDemo(args: ComponentProps<typeof ConfirmDialog>) {
    const [open, setOpen] = useState(true);

    return (
        <>
            <Button variant="secondary" onClick={() => setOpen(true)}>
                {args.confirmLabel}
            </Button>
            {open ? (
                <ConfirmDialog
                    {...args}
                    onCancel={() => {
                        setOpen(false);
                        args.onCancel();
                    }}
                />
            ) : null}
        </>
    );
}

/** Asks before an action that can’t be undone. The title names the thing, the body says what happens, the confirm
 *  button says the action itself. */
const meta = {
    title: 'Overlays/ConfirmDialog',
    component: ConfirmDialog,
    args: {
        title: 'Delete Music?',
        consequence: 'Lar forgets the catalog’s 12 albums and 94 tracks, with their play history and playlist entries.',
        reassurance: 'Your files in /mnt/user/media/music stay on disk. Add the folder again any time.',
        confirmLabel: 'Delete catalog',
        onConfirm: fn(),
        onCancel: fn(),
    },
    render: (args) => <ConfirmDialogDemo {...args} />,
} satisfies Meta<typeof ConfirmDialog>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Danger: Story = {};

/** No reassurance: the consequence alone. */
export const ConsequenceOnly: Story = {
    args: {
        title: 'Remove Tomás?',
        consequence: 'Tomás can no longer sign in, and their devices stop playing. Their listening history is kept.',
        reassurance: undefined,
        confirmLabel: 'Remove user',
    },
};

/** The action is in flight: the confirm button spins and the dialog can’t close. */
export const Busy: Story = { args: { busy: true } };

/** A confirm that destroys nothing takes the `default` intent: its confirm is the primary button. */
export const Primary: Story = {
    args: {
        title: 'Rescan Music?',
        consequence: 'Lar reads every file in the catalog again. Playback keeps working meanwhile.',
        reassurance: undefined,
        confirmLabel: 'Rescan catalog',
        intent: 'default',
    },
};

/** A long name wraps in the title; the path wraps in the note. */
export const LongName: Story = {
    args: {
        title: 'Delete Symphonies for Small Rooms, Unfinished Recordings and Live Takes?',
        reassurance:
            'Your files in /mnt/user/media/music/classical/symphonies_for_small_rooms_unfinished_recordings stay on disk.',
    },
};

/** Waiting for a read keeps Cancel reachable without allowing the destructive action. */
export const AwaitingInspection: Story = { args: { confirmDisabled: true } };
