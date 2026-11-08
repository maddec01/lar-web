import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';

import { Button } from '../actions/Button';
import { ConfirmDialog } from '../overlays/ConfirmDialog';
import { buttonKind } from './ButtonKinds';
import { NeedsYouNotice, NeedsYouResult } from './NeedsYou';

/** The board's choices for a stopped build, Abandon last in the quiet-destructive ghost, asking in its confirmation
 *  first, as the board does. */
function Choices({ asking: initial = false }: { asking?: boolean }) {
    const [asking, setAsking] = useState(initial);

    return (
        <>
            <Button {...buttonKind('other')}>Start again</Button>
            <Button {...buttonKind('other')}>Back to Queue</Button>
            <Button {...buttonKind('other', 'danger')} onClick={() => setAsking(true)}>
                Abandon
            </Button>
            {asking ? (
                <ConfirmDialog
                    title="Abandon Fix the login redirect?"
                    consequence="Abandon sets the work aside on this Mac and leaves its ticket open."
                    reassurance="Its branch and pull request stay as they are."
                    confirmLabel="Abandon"
                    onCancel={() => setAsking(false)}
                    onConfirm={() => setAsking(false)}
                />
            ) : null}
        </>
    );
}

const meta = {
    title: 'Board/NeedsYou',
    component: NeedsYouNotice,
    decorators: [
        (Story) => (
            <div className="w-full max-w-2xl text-sm">
                <Story />
            </div>
        ),
    ],
    args: {
        reason: 'Needs you: the build stopped before it opened a pull request.',
        actions: <Choices />,
    },
} satisfies Meta<typeof NeedsYouNotice>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Notice: Story = {};

/** Abandon asks first: the board's confirmation, its consequence and the one destructive confirm. */
export const AbandonConfirmation: Story = {
    args: { actions: <Choices asking /> },
};

/** A reason only the reader can answer elsewhere, such as a question in T3: no actions, so no empty action row. */
export const WithoutActions: Story = {
    args: {
        reason: 'This work is waiting for your answer or decision. Open the thread in T3 to continue.',
        actions: undefined,
    },
};

/** What the last choice’s cleanup left to say, under the choices. */
export const WithResult: Story = {
    args: { children: <NeedsYouResult>Branches remain for you to remove: lar/w-41</NeedsYouResult> },
};
