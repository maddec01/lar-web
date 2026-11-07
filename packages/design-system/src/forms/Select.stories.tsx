import type { Meta, StoryObj } from '@storybook/react-vite';
import { DiscIcon, FilmIcon, GitBranchIcon, ImageIcon } from 'lucide-react';
import { fn } from 'storybook/test';

import { Field } from './Field';
import { Select, SelectItem } from './Select';

const libraryItems = (
    <>
        <SelectItem value="music" icon={<DiscIcon />}>
            Music
        </SelectItem>
        <SelectItem value="movies" icon={<FilmIcon />}>
            Movies
        </SelectItem>
        <SelectItem value="photos" icon={<ImageIcon />}>
            Photos
        </SelectItem>
        <SelectItem value="repositories" icon={<GitBranchIcon />} disabled>
            Repositories (read only)
        </SelectItem>
    </>
);

const meta = {
    title: 'Forms/Select',
    component: Select,
    args: { 'aria-label': 'Library', placeholder: 'Choose a library', onValueChange: fn(), children: libraryItems },
    argTypes: { variant: { control: 'select', options: ['filled', 'outline', 'flushed'] } },
    render: (args) => (
        <div className="max-w-xs">
            <Select {...args} />
        </div>
    ),
} satisfies Meta<typeof Select>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Placeholder: Story = {};

export const WithValue: Story = { args: { defaultValue: 'movies' } };

export const Invalid: Story = { args: { invalid: true } };

export const Disabled: Story = { args: { defaultValue: 'music', disabled: true } };

export const Clearable: Story = { args: { defaultValue: 'photos', clearable: true, onClear: fn() } };

export const LongOption: Story = {
    args: {
        'aria-label': 'Album',
        defaultValue: 'ziggy',
        children: (
            <>
                <SelectItem value="ziggy">
                    The Rise and Fall of Ziggy Stardust and the Spiders from Mars (2012 Remaster)
                </SelectItem>
                <SelectItem value="blackstar">Blackstar</SelectItem>
            </>
        ),
    },
};

/** Open on load, to see the glass listbox. */
export const Open: Story = { args: { defaultValue: 'music', defaultOpen: true } };

export const InField: Story = {
    render: (args) => (
        <div className="max-w-xs">
            <Field label="Library" helperText="Where new imports land.">
                <Select {...args} aria-label={undefined} />
            </Field>
        </div>
    ),
};
