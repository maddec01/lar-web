import type { Meta, StoryObj } from '@storybook/react-vite';

import { Button } from '../actions/Button';
import { buttonKind } from './ButtonKinds';
import { NeedsYouNotice, NeedsYouResult } from './NeedsYou';

const meta = {
    title: 'Board/NeedsYou',
    component: NeedsYouNotice,
    decorators: [
        (Story) => (
            <div className="w-96 text-sm">
                <Story />
            </div>
        ),
    ],
    args: {
        reason: 'Needs you: the build stopped before it opened a pull request.',
        actions: (
            <>
                <Button {...buttonKind('other')}>Start again</Button>
                <Button {...buttonKind('other')}>Back to Queue</Button>
                <Button {...buttonKind('other')}>Abandon</Button>
            </>
        ),
    },
} satisfies Meta<typeof NeedsYouNotice>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Notice: Story = {};

/** What the last choice's cleanup left to say, under the choices. */
export const WithResult: Story = {
    args: { children: <NeedsYouResult>Branches remain for you to remove: lar/w-41</NeedsYouResult> },
};
