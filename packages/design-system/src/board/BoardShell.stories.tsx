import type { Meta, StoryObj } from '@storybook/react-vite';

import { Text } from '../typography/Typography';
import { BoardContent, BoardShell, ReadingLine } from './BoardShell';

const meta = {
    title: 'Board/BoardShell',
    component: BoardShell,
    parameters: { layout: 'fullscreen' },
    args: {
        children: (
            <BoardContent>
                <Text>Your desk</Text>
                <Text tone="muted">The stages scroll as one page under the title bar.</Text>
            </BoardContent>
        ),
    },
    decorators: [
        (Story) => (
            <div className="relative h-80 [transform:translateZ(0)]">
                <Story />
            </div>
        ),
    ],
} satisfies Meta<typeof BoardShell>;

export default meta;

type Story = StoryObj<typeof meta>;

export const WithContent: Story = {};

/** While a repository's items haven't landed, a reading line stands in for the board. */
export const Reading: Story = {
    args: {
        children: (
            <BoardContent>
                <ReadingLine label="Loading Projects…" />
            </BoardContent>
        ),
    },
};
