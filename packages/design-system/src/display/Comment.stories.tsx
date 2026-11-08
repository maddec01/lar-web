import type { Meta, StoryObj } from '@storybook/react-vite';

import { Text } from '../typography/Typography';
import { Comment, CommentList } from './Comment';

const meta = {
    title: 'Display/Comment',
    component: CommentList,
    args: { children: null },
} satisfies Meta<typeof CommentList>;

export default meta;

type Story = StoryObj<typeof meta>;

/** A ticket’s comments, newest first: each author’s avatar beside a card with their name and when. */
export const Comments: Story = {
    render: () => (
        <CommentList>
            <Comment author="maddec01" time="2h">
                <Text>Looks right; ship it.</Text>
            </Comment>
            <Comment author="claude-bot" time="1d">
                <Text>Opened #145 for the sessions table.</Text>
            </Comment>
        </CommentList>
    ),
};
