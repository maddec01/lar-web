import type { Meta, StoryObj } from '@storybook/react-vite';

import { CommandPaletteTrigger } from '../layout/toolbar/CommandPaletteTrigger';
import { Text } from '../typography/Typography';
import { BoardContent, BoardShell, ReadingLine } from './BoardShell';
import { BoardBrand, BoardTitleBar } from './BoardTitleBar';

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

/** The title bar is glass: the board scrolls under it, blurred, and its hairline shows once scrolled. */
export const UnderTheTitleBar: Story = {
    args: {
        children: (
            <>
                <BoardTitleBar
                    brand={<BoardBrand product="Factory" />}
                    search={<CommandPaletteTrigger label="Search" shortcut="k" tokens={[]} onOpen={() => {}} />}
                    actions={null}
                    nativeWindow={false}
                    pastLights={false}
                />
                <BoardContent>
                    {Array.from({ length: 24 }, (_, index) => (
                        <div key={index} className="border-line bg-surface-raised rounded-lg border p-3">
                            <Text>Item {index + 1}</Text>
                        </div>
                    ))}
                </BoardContent>
            </>
        ),
    },
};

/** While a repository’s items haven’t landed, a reading line stands in for the board. */
export const Reading: Story = {
    args: {
        children: (
            <BoardContent>
                <ReadingLine label="Loading Projects…" />
            </BoardContent>
        ),
    },
};
