import type { Meta, StoryObj } from '@storybook/react-vite';

import { Loading } from '../feedback/Loading';
import { Switch } from '../forms/Switch';
import { BuildLimit, HeaderSwitch, StageList, StagePane, StagePaneEmpty, StageSections } from './StagePane';
import { StatusGlyph } from './StatusGlyph';

const meta = {
    title: 'Board/StagePane',
    component: StagePane,
    args: {
        id: 'build',
        title: 'Build',
        glyph: <StatusGlyph status="In progress" running />,
        count: 0,
        right: (
            <BuildLimit building={3} limit={4} title="Builds at work against the build limit">
                3 running · limit 4
            </BuildLimit>
        ),
        children: <StagePaneEmpty>Nothing in build.</StagePaneEmpty>,
    },
} satisfies Meta<typeof StagePane>;

export default meta;

type Story = StoryObj<typeof meta>;

/** A section with no rows says so in one small line. */
export const Empty: Story = {};

export const StillLoading: Story = {
    args: {
        id: 'queue',
        title: 'Queue',
        glyph: <StatusGlyph status="Queued" />,
        right: undefined,
        children: (
            <StagePaneEmpty>
                <Loading presentation="inline" label="Loading Projects…" />
            </StagePaneEmpty>
        ),
    },
};

/** Ready to build’s header holds the Auto-build switch, and anything that holds it. */
export const WithSwitch: Story = {
    args: {
        id: 'ready',
        title: 'Ready to build',
        glyph: <StatusGlyph status="Ready" />,
        right: (
            <HeaderSwitch
                label="Auto-build"
                title="1 build would start now."
                hold="Paused: the build limit is reached"
                control={<Switch checked aria-label="Auto-build" />}
            />
        ),
    },
};

/** Over the limit, the bar shows a bar per build at work. */
export const OverTheLimit: Story = {
    args: {
        right: (
            <BuildLimit building={5} limit={3} title="Builds at work against the build limit">
                5 running · limit 3
            </BuildLimit>
        ),
    },
};

/** The sections, one under another, as the board stacks them. */
export const Sections: Story = {
    render: (args) => (
        <StageSections label="Work by stage">
            <StagePane {...args} />
            <StagePane id="shaping" title="Shaping" glyph={<StatusGlyph status="Shaping" />} count={0}>
                <StageList>{null}</StageList>
                <StagePaneEmpty>Nothing in shaping.</StagePaneEmpty>
            </StagePane>
        </StageSections>
    ),
};
