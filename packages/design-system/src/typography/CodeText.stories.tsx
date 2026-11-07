import type { Meta, StoryObj } from '@storybook/react-vite';

import { CodeText } from './CodeText';
import { Text } from './Typography';

const meta = {
    title: 'Typography/CodeText',
    component: CodeText,
    args: { wrap: 'anywhere', children: '/home/.agents/skills/grill-with-docs' },
    argTypes: { wrap: { control: 'inline-radio', options: ['anywhere', 'never'] } },
} satisfies Meta<typeof CodeText>;

export default meta;

type Story = StoryObj<typeof meta>;

/** A path that may break anywhere, and a command that never breaks, in the page's plain inline code. */
export const InASentence: Story = {
    render: () => (
        <Text variant="caption" tone="muted" className="w-56">
            Blocked by <CodeText wrap="anywhere">/home/.agents/skills/grill-with-docs</CodeText>. Fix:{' '}
            <CodeText wrap="never">gh auth refresh -s read:project</CodeText>
        </Text>
    ),
};
