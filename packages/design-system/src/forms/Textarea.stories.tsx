import type { Meta, StoryObj } from '@storybook/react-vite';

import { Textarea } from './Textarea';

const meta = {
    title: 'Forms/Textarea',
    component: Textarea,
    args: { placeholder: 'Describe what this release changes', 'aria-label': 'Release notes', rows: 4 },
    argTypes: { resize: { control: 'inline-radio', options: ['none', 'vertical', 'horizontal', 'both'] } },
    render: (args) => (
        <div className="max-w-md">
            <Textarea {...args} />
        </div>
    ),
} satisfies Meta<typeof Textarea>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithValue: Story = {
    args: {
        defaultValue:
            'Adds gapless playback to the music player, fixes artwork for multi-disc albums and speeds up library scans on network shares.',
    },
};

export const WithCounter: Story = { args: { maxLength: 280, showCounter: true, defaultValue: 'Fixes subtitle sync.' } };

export const AutoResize: Story = { args: { autoResize: true, minRows: 2, maxRows: 8, rows: undefined } };

export const Invalid: Story = { args: { invalid: true, defaultValue: '' } };

export const Disabled: Story = { args: { disabled: true, defaultValue: 'Release notes are locked once published.' } };

/** Metadata biographies request ten visible rows; the browser’s rows sizing must take effect. */
export const Biography: Story = {
    args: {
        rows: 10,
        'aria-label': 'Biography',
        defaultValue:
            'The Mariner Collective formed in Rotterdam in 2009. Their recordings bring together ambient textures and acoustic instruments.',
    },
};
