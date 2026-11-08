import type { Meta, StoryObj } from '@storybook/react-vite';
import { HandIcon, InboxIcon, Settings2Icon, SquarePenIcon } from 'lucide-react';
import { fn } from 'storybook/test';

import { Button } from '../actions/Button';
import { IconButton } from '../actions/IconButton';
import { CommandPaletteTrigger } from '../layout/toolbar/CommandPaletteTrigger';
import { BoardBrand, BoardTitleBar, RefreshIndicator, TitleBarDivider } from './BoardTitleBar';
import { buttonKind } from './ButtonKinds';
import { BoardCounter, BoardCounters, CounterEmpty } from './Counters';
import { ListButton } from './List';
import { UpdatePill } from './UpdatePill';

const refreshed = (
    <RefreshIndicator
        health="live"
        landed={0}
        label="12s"
        detail="Updated 12s · 10:42"
        secondaryDetail="Checks GitHub for changes every 5s, reads everything every 60s"
    />
);

const counters = (
    <BoardCounters>
        <BoardCounter
            label="need you"
            value={2}
            icon={<HandIcon style={{ color: 'var(--color-board-you)' }} strokeWidth={2.25} />}
            title="Needs you"
            sub={2}
            hint="2 items waiting on your answer, verification or merge"
        >
            <CounterEmpty>Nothing waits on you.</CounterEmpty>
        </BoardCounter>
    </BoardCounters>
);

const actions = (
    <>
        <ListButton label="List" icon={<InboxIcon />} count={7} loadingLabel="Loading Projects…" onOpen={fn()} />
        <Button {...buttonKind('main')} leftIcon={<SquarePenIcon />}>
            Add item
        </Button>
        <TitleBarDivider />
        <UpdatePill
            status="available"
            label="Update available"
            heading="Lar Factory 1.4.0 is available"
            actionLabel="Download"
            disabled={false}
            onRun={fn()}
        />
        <IconButton variant="title-bar" aria-label="Settings" icon={<Settings2Icon />} />
    </>
);

const meta = {
    title: 'Board/BoardTitleBar',
    component: BoardTitleBar,
    parameters: { layout: 'fullscreen' },
    args: {
        brand: <BoardBrand product="Factory" />,
        heading: 'Lar Factory',
        refreshed,
        counters,
        search: <CommandPaletteTrigger label="Search" shortcut="k" tokens={[]} onOpen={fn()} />,
        actions,
        nativeWindow: false,
        pastLights: true,
    },
} satisfies Meta<typeof BoardTitleBar>;

export default meta;

type Story = StoryObj<typeof meta>;

/** In a browser there are no traffic lights: the bar keeps only its own padding. */
export const InABrowser: Story = {};

/** In the Mac app macOS draws its traffic lights over the bar’s left, so the bar starts past them. */
export const NativeWindow: Story = { args: { nativeWindow: true } };

/** Full screen hides the traffic lights, so the brand moves to the bar’s own padding. */
export const FullScreen: Story = { args: { nativeWindow: true, pastLights: false } };

/** With no board to count or search, only the brand and Settings. */
export const BrandOnly: Story = {
    args: {
        heading: undefined,
        refreshed: undefined,
        counters: undefined,
        search: undefined,
        actions: <IconButton variant="title-bar" aria-label="Settings" icon={<Settings2Icon />} />,
    },
};

export const RefreshStates: StoryObj<typeof RefreshIndicator> = {
    render: () => (
        <div className="@container flex w-240 flex-col items-start gap-2">
            {(['waiting', 'live', 'stale', 'disconnected'] as const).map((health) => (
                <RefreshIndicator
                    key={health}
                    health={health}
                    landed={1}
                    label={health === 'stale' ? 'Stale · 2m' : health === 'disconnected' ? 'Disconnected · 3m' : '12s'}
                    detail="Updated 12s · 10:42"
                    secondaryDetail={
                        health === 'disconnected' ? 'Board disconnected: Failed to fetch' : 'Reads every 60s'
                    }
                />
            ))}
        </div>
    ),
};
