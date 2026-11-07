import type { Meta, StoryObj } from '@storybook/react-vite';

import { Text } from '../typography/Typography';
import { HiddenField } from './HiddenField';

const meta = {
    title: 'Forms/HiddenField',
    component: HiddenField,
    args: { name: 'labels', value: 'docs' },
    render: (args) => (
        <form>
            <HiddenField {...args} />
            <Text tone="muted">The form submits labels=docs; the field itself shows nothing.</Text>
        </form>
    ),
} satisfies Meta<typeof HiddenField>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
