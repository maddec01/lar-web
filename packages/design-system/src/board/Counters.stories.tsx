import type { Meta, StoryObj } from '@storybook/react-vite';
import { CircleDollarSignIcon, CircleDotIcon, FolderGit2Icon, HandIcon, LoaderCircleIcon } from 'lucide-react';
import { fn } from 'storybook/test';

import { Loading } from '../feedback/Loading';
import {
    BoardCounter,
    BoardCounters,
    CounterAge,
    CounterDash,
    CounterDivider,
    CounterEmpty,
    CounterFigure,
    CounterGroup,
    CounterGroups,
    CounterItem,
    CounterList,
    CounterOfLimit,
    CounterPartial,
    LimitBars,
} from './Counters';

const glyph = (Icon: typeof HandIcon, color: string) => <Icon style={{ color }} strokeWidth={2.25} />;

const items = [
    { id: '61', title: '#61 Move the title bar into the design system', age: '2m' },
    { id: '62', title: '#62 A very long ticket title that runs past the panel and truncates at its end', age: '1h' },
];

function Rows({ figure }: { figure?: boolean }) {
    return (
        <CounterList>
            {items.map((item) => (
                <CounterItem
                    key={item.id}
                    item={item.id}
                    label={item.title}
                    leading={glyph(CircleDotIcon, 'var(--you)')}
                    title={item.title}
                    trailing={
                        figure ? (
                            <CounterFigure>$4.20</CounterFigure>
                        ) : (
                            <CounterAge icon={<FolderGit2Icon className="size-3" />} age={item.age} />
                        )
                    }
                    onOpen={fn()}
                />
            ))}
        </CounterList>
    );
}

/** The title bar's five counters, as the status strip shows them; each opens its panel. */
function Strip({ reading = false }: { reading?: boolean }) {
    return (
        <div className="status-strip @container flex w-[72rem] items-center">
            <BoardCounters>
                <BoardCounter
                    label="need you"
                    value={reading ? <CounterDash /> : 2}
                    icon={glyph(HandIcon, 'var(--you)')}
                    title="Needs you"
                    sub={reading ? undefined : 2}
                    hint="2 items waiting on your answer, verification or merge"
                >
                    <CounterGroups>
                        <CounterGroup title="Needs you" count={1}>
                            <Rows />
                        </CounterGroup>
                        <CounterGroup title="Verify" count={1}>
                            <Rows />
                        </CounterGroup>
                    </CounterGroups>
                </BoardCounter>
                <BoardCounter
                    label="shaping"
                    value={0}
                    icon={glyph(CircleDotIcon, 'var(--thread)')}
                    fold="medium"
                    title="Shaping"
                    hint="Nothing shaping right now"
                >
                    <CounterEmpty>
                        {reading ? (
                            <Loading presentation="inline" label="Loading Projects…" />
                        ) : (
                            'Nothing shaping right now.'
                        )}
                    </CounterEmpty>
                </BoardCounter>
                <BoardCounter
                    label="building"
                    icon={glyph(LoaderCircleIcon, 'var(--thread)')}
                    width="limit"
                    title="Building"
                    value={<CounterOfLimit count={2} limit={3} />}
                    sub={<LimitBars used={2} limit={3} />}
                    hint="Room for 1 more build under the build limit of 3"
                    foot="Room for 1 more build under the build limit."
                >
                    <Rows />
                </BoardCounter>
                <CounterDivider />
                <BoardCounter
                    label="spend"
                    value={<CounterPartial figure="$12.40" unavailable />}
                    width="spend"
                    fold="wide"
                    title="Agent spend"
                    sub="$12.40 so far"
                    icon={<CircleDollarSignIcon strokeWidth={2.25} />}
                    hint="Partial figures. Some usage is unavailable."
                    foot="Partial figures. Some usage is unavailable."
                >
                    <Rows figure />
                </BoardCounter>
            </BoardCounters>
        </div>
    );
}

const meta = {
    title: 'Board/Counters',
    component: BoardCounters,
    args: { children: null },
    render: () => <Strip />,
} satisfies Meta<typeof BoardCounters>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Counters: Story = {};

/** Before the first read lands, a zero would be a claim, so counts are dashes. */
export const Reading: Story = { render: () => <Strip reading /> };

/** The build limit's bars: two builds over a limit of one show past it, after a gap. */
export const OverTheLimit: Story = { render: () => <LimitBars used={3} limit={1} /> };

export const OpenPanel: Story = {
    play: async ({ canvasElement }) => {
        canvasElement.querySelector<HTMLButtonElement>('button')?.click();
    },
};
