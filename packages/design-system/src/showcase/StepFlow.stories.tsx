import type { Meta, StoryObj } from '@storybook/react-vite';
import { CheckIcon, GitBranchIcon, GitPullRequestIcon, MessageSquareIcon, PlusIcon } from 'lucide-react';

import { StepFlow } from './StepFlow';

const meta = {
    title: 'Showcase/StepFlow',
    component: StepFlow,
    args: {
        label: 'The Lar Factory workflow',
        steps: [
            {
                label: 'List & queue',
                title: 'Add an idea',
                body: 'Type a title, or bring in a GitHub issue or an Azure DevOps work item.',
                icon: <PlusIcon />,
            },
            {
                label: 'Shape',
                title: 'Shape it',
                body: 'Factory reads the issue and the code, investigates the unknowns and asks you what only you can decide.',
                icon: <MessageSquareIcon />,
            },
            {
                label: 'Ready',
                title: 'Agree the brief',
                body: 'Shaping ends in a Ready brief or a concept map. Nothing is built until you say Start build.',
                icon: <CheckIcon />,
            },
            {
                label: 'Build',
                title: 'Build in isolation',
                body: 'A fresh worktree from your latest default branch: plan, build, run your checks, review.',
                icon: <GitBranchIcon />,
            },
            {
                label: 'Merge',
                title: 'Verify and merge',
                body: 'Risky or visible changes come with steps to check. Every build ends as a PR you merge.',
                icon: <GitPullRequestIcon />,
            },
        ],
    },
    argTypes: { steps: { control: false } },
    decorators: [
        (Story) => (
            <div className="mx-auto max-w-[1200px]">
                <Story />
            </div>
        ),
    ],
} satisfies Meta<typeof StepFlow>;

export default meta;

type Story = StoryObj<typeof meta>;

/** Lar Factory's five steps from idea to merged: joined by a line on wide screens, numbered rows on phones. */
export const Default: Story = {};
