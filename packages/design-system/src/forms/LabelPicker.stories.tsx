import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { fn } from 'storybook/test';

import { type LabelChoice, LabelPicker } from './LabelPicker';

const choices: LabelChoice[] = [
    { name: 'bug', color: '#D73A4A', description: 'Something isn’t working' },
    { name: 'enhancement', color: '#A2EEEF', description: 'New feature or request' },
    { name: 'good first issue', color: '#7057FF' },
    { name: 'documentation', color: '#0075CA' },
    { name: 'triage' },
];

const meta = {
    title: 'Forms/LabelPicker',
    component: LabelPicker,
    args: {
        choices,
        picked: ['bug'],
        onToggle: fn(),
        filterLabel: 'Filter labels',
        placeholder: 'Filter labels',
        noMatchLabel: 'No match.',
    },
    render: function Render(args) {
        const [picked, setPicked] = useState(args.picked);

        return (
            <LabelPicker
                {...args}
                picked={picked}
                onToggle={(name) => {
                    setPicked((now) => (now.includes(name) ? now.filter((label) => label !== name) : [...now, name]));
                    args.onToggle(name);
                }}
            />
        );
    },
} satisfies Meta<typeof LabelPicker>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** A label the item’s kind sets is ticked but can’t be changed here. */
export const Locked: Story = {
    args: { picked: ['bug', 'enhancement'], locked: ['enhancement'], lockedNote: 'set by kind' },
};

/** Typing a name no label has offers to create it. */
export const Creating: Story = {
    args: {
        placeholder: 'Filter or type a new label',
        create: {
            refused: null,
            problem: (name) => (name.length > 50 ? 'A label name is at most 50 characters.' : null),
            note: 'The new label is created when the ticket submits.',
            createLabel: (name) => `Create "${name}"`,
            onCreate: fn(),
        },
    },
};

/** Without the right to add labels, a typed new name says why. */
export const CreateRefused: Story = {
    args: {
        create: {
            refused: 'Only maintainers can add labels to this repository.',
            problem: () => null,
            note: '',
            createLabel: (name) => `Create "${name}"`,
            onCreate: fn(),
        },
    },
};

export const Busy: Story = { args: { busy: true } };

export const NoChoices: Story = { args: { choices: [], picked: [] } };
