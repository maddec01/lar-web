import type { Meta, StoryObj } from '@storybook/react-vite';

import { Code } from './Code';
import { Text } from './Typography';

const meta = {
    title: 'Typography/Code',
    component: Code,
    args: { children: 'pnpm install' },
    argTypes: { wrap: { control: 'inline-radio', options: [undefined, 'anywhere', 'never'] } },
} satisfies Meta<typeof Code>;

export default meta;

type Story = StoryObj<typeof meta>;

/** The code chip. */
export const Chip: Story = {};

/** With `wrap`: a path that may break anywhere, and a command that never breaks, in the page's plain inline code. */
export const InASentence: Story = {
    render: () => (
        <Text variant="caption" tone="muted" className="w-56">
            Blocked by <Code wrap="anywhere">/home/.agents/skills/grill-with-docs</Code>. Fix:{' '}
            <Code wrap="never">gh auth refresh -s read:project</Code>
        </Text>
    ),
};
