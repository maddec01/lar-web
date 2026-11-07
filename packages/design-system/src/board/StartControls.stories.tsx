import type { Meta, StoryObj } from '@storybook/react-vite';
import { MessageSquareTextIcon, PlayIcon } from 'lucide-react';
import { fn } from 'storybook/test';

import { Button } from '../actions/Button';
import { DismissButton } from '../feedback/DismissButton';
import { buttonKind } from './ButtonKinds';
import { ActionError, StartGroup, StartLine, StartNote, StartTag } from './StartControls';

const meta = {
    title: 'Board/StartControls',
    component: StartGroup,
    decorators: [
        (Story) => (
            <div className="flex w-72 justify-end text-xs">
                <Story />
            </div>
        ),
    ],
    args: {
        children: (
            <Button {...buttonKind('start')} leftIcon={<PlayIcon />}>
                Start ▾
            </Button>
        ),
    },
} satisfies Meta<typeof StartGroup>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Start: Story = {};

/** A finished run says so on a line of its own, with Open thread under it. */
export const RunFinished: Story = {
    args: {
        children: (
            <>
                <StartNote>Run finished.</StartNote>
                <Button {...buttonKind('open')} leftIcon={<MessageSquareTextIcon />}>
                    Open thread
                </Button>
            </>
        ),
    },
};

export const Tags: Story = {
    args: {
        children: (
            <>
                <StartTag title="T3 thread thread-1">Started</StartTag>
                <StartTag unsure title="Check T3 before starting it again">
                    May have started
                </StartTag>
            </>
        ),
    },
};

/** Start's error under it, with its dismiss button, and a note in muted text. */
export const Lines: Story = {
    render: () => (
        <div className="grid w-72 gap-1">
            <StartLine>
                <ActionError>
                    <span role="alert">T3 is down.</span>{' '}
                    <DismissButton label="Dismiss error" placement="inline" onClick={fn()} />
                </ActionError>
            </StartLine>
            <StartLine data-start-result="I_1" tabIndex={-1}>
                <ActionError>
                    <span role="alert">The start may have run. Check T3.</span>
                </ActionError>
            </StartLine>
            <StartLine>Auto-build waits for Refinement</StartLine>
        </div>
    ),
};
