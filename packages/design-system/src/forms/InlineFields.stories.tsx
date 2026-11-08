import type { Meta, StoryObj } from '@storybook/react-vite';

import { Button } from '../actions/Button';
import { Field } from './Field';
import { InlineFields } from './InlineFields';
import { Input } from './Input';
import { Select, SelectItem } from './Select';

const fields = (
    <>
        <Field label="Repository">
            <Input placeholder="lar-works/lar-web" />
        </Field>
        <Field label="Branch">
            <Select aria-label="Branch" defaultValue="main">
                <SelectItem value="main">main</SelectItem>
                <SelectItem value="develop">develop</SelectItem>
            </Select>
        </Field>
    </>
);

const actions = (
    <>
        <Button variant="secondary">Cancel</Button>
        <Button>Add repository</Button>
    </>
);

const meta = {
    title: 'Forms/InlineFields',
    component: InlineFields,
    args: { children: fields, actions },
} satisfies Meta<typeof InlineFields>;

export default meta;

type Story = StoryObj<typeof meta>;

/** Sized by its container: in a wide one the fields sit side by side with the actions at the end. */
export const Wide: Story = {
    render: (args) => (
        <div className="max-w-3xl">
            <InlineFields {...args} />
        </div>
    ),
};

/** In a narrow card the fields stack and the actions sit below them. */
export const Narrow: Story = {
    render: (args) => (
        <div className="border-line bg-surface-raised max-w-xs rounded-lg border p-4">
            <InlineFields {...args} />
        </div>
    ),
};

export const SingleField: Story = {
    args: {
        children: (
            <Field label="Library name">
                <Input defaultValue="Music" />
            </Field>
        ),
        actions: <Button>Rename</Button>,
    },
    render: (args) => (
        <div className="max-w-2xl">
            <InlineFields {...args} />
        </div>
    ),
};
