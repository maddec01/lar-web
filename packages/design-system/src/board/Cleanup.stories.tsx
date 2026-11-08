import type { Meta, StoryObj } from '@storybook/react-vite';

import { Alert } from '../feedback/Alert';
import { LossList } from './Cleanup';

const meta = {
    title: 'Board/Cleanup',
    component: LossList,
    decorators: [
        (Story) => (
            <div className="w-full max-w-2xl">
                <Alert size="sm" tone="danger" title="Deleting local work will lose these files and commits">
                    <Story />
                </Alert>
            </div>
        ),
    ],
    args: {
        branches: [
            { name: 'lar/w-41', losses: ['M apps/web/src/index.css', '4f2a9c Draft the sign-in screen'] },
            { name: 'lar/w-41-slice-2', losses: ['?? notes.md'] },
        ],
    },
} satisfies Meta<typeof LossList>;

export default meta;

type Story = StoryObj<typeof meta>;

/** What removing old branches and worktrees would lose, inside its confirmation’s danger alert. */
export const Losses: Story = {};
