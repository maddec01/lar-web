import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { fn } from 'storybook/test';

import { TagInput } from './TagInput';

const meta = {
    title: 'Forms/TagInput',
    component: TagInput,
    args: {
        label: 'Ignored folders',
        addLabel: 'Add an ignored folder',
        removeLabel: (value) => `Remove ${value}`,
        placeholder: 'Type a folder name and press Enter',
        values: ['@eaDir', '.Trash', 'Samples'],
        onChange: fn(),
    },
    render: (args) => (
        <div className="max-w-md">
            <TagInput {...args} />
        </div>
    ),
} satisfies Meta<typeof TagInput>;

export default meta;

type Story = StoryObj<typeof meta>;

/** Controlled: changes are logged in the Actions panel. See Interactive for one that keeps its values. */
export const Default: Story = {};

export const Empty: Story = { args: { values: [] } };

export const Disabled: Story = { args: { disabled: true } };

export const LongValues: Story = {
    args: {
        label: 'Allowed origins',
        addLabel: 'Add an allowed origin',
        values: [
            'https://music.home.example.com',
            'https://a-very-long-subdomain-for-the-movie-library.tailnet-1234.ts.net',
            'http://localhost:5173',
        ],
    },
};

function InteractiveTagInput({ onChange }: { onChange: (values: string[]) => void }) {
    const [values, setValues] = useState<string[]>(['jazz', 'live']);

    return (
        <TagInput
            label="Album tags"
            addLabel="Add a tag"
            removeLabel={(value) => `Remove ${value}`}
            placeholder="Add a tag; Enter, comma or semicolon adds it"
            values={values}
            onChange={(next) => {
                setValues(next);
                onChange(next);
            }}
        />
    );
}

/** Keeps its own values: add with Enter, a comma or a semicolon; duplicates in any case are ignored. */
export const Interactive: Story = {
    render: (args) => (
        <div className="max-w-md">
            <InteractiveTagInput onChange={args.onChange} />
        </div>
    ),
};
