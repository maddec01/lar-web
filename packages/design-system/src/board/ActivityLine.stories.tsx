import type { Meta, StoryObj } from '@storybook/react-vite';

import { ActivityLine, AgentAge, AgentList, AgentRow, WorkingAgents } from './ActivityLine';

const agents = (
    <AgentList>
        <AgentRow title="Build" model="gpt-5.5" age={<AgentAge>9s</AgentAge>} action="pnpm test" />
        <AgentRow title="Review the endpoint" action="Reading apps/server/src/relay.ts" />
    </AgentList>
);

const meta = {
    title: 'Board/ActivityLine',
    component: ActivityLine,
    decorators: [
        (Story) => (
            <div className="w-96 text-xs text-(--muted-foreground)">
                <Story />
            </div>
        ),
    ],
    args: { state: 'working', action: 'pnpm test', age: '9s', agents: '2 agents', agentList: agents },
} satisfies Meta<typeof ActivityLine>;

export default meta;

type Story = StoryObj<typeof meta>;

/** At work, its agents listed in its tooltip. */
export const Working: Story = {};

/** Every state's mark and words. */
export const States: Story = {
    render: () => (
        <div className="grid gap-2">
            <ActivityLine state="working" action="Edit scrubber.tsx" age="1m" />
            <ActivityLine state="quiet" action="Quiet for 6m" />
            <ActivityLine state="waiting" action="Needs you" age="3m" />
            <ActivityLine state="stopped" action="Stopped" age="20m" />
            <ActivityLine state="unavailable" action="Activity unavailable" />
        </div>
    ),
};

/** The agents at work in the item dialog, or why they can't be listed. */
export const Agents: Story = {
    render: () => (
        <div className="grid gap-4">
            <WorkingAgents heading="Working agents">{agents}</WorkingAgents>
            <WorkingAgents heading="Working agents" unavailable="Activity unavailable" />
        </div>
    ),
};
