import type { Meta, StoryObj } from '@storybook/react-vite';

import { Field } from './Field';
import { Input } from './Input';
import { Textarea } from './Textarea';

const meta = {
    title: 'Forms/Field',
    component: Field,
    args: {
        label: 'Library name',
        helperText: 'Shown in the sidebar and on every client.',
        children: <Input placeholder="Music" />,
    },
    render: (args) => (
        <div className="max-w-sm">
            <Field {...args} />
        </div>
    ),
} satisfies Meta<typeof Field>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Required: Story = { args: { required: true } };

export const Optional: Story = {
    args: {
        label: 'Description',
        optionalText: 'Optional',
        helperText: undefined,
        children: <Textarea placeholder="What this library holds" rows={3} />,
    },
};

export const Invalid: Story = {
    args: {
        label: 'Media folder',
        invalid: true,
        errorText: '/srv/media/music doesn’t exist on this server.',
        children: <Input defaultValue="/srv/media/music" invalid />,
    },
};

export const Disabled: Story = {
    args: {
        label: 'Repository URL',
        disabled: true,
        helperText: 'Managed by the organisation; ask an owner to change it.',
        children: <Input defaultValue="https://github.com/lar-works/lar-web.git" disabled />,
    },
};
