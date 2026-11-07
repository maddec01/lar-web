import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';

import { Text } from '../typography/Typography';
import { ImagePicker, ImagePickerGrid, ImagePickerOption, ImageUpload } from './ImagePicker';

const options = [
    {
        id: 'musicbrainz',
        label: 'Cover Art Archive',
        detail: '1200 × 1200',
        src: 'https://picsum.photos/seed/lar-cover-1/300/300',
    },
    { id: 'fanart', label: 'fanart.tv', detail: '1000 × 1000', src: 'https://picsum.photos/seed/lar-cover-2/300/300' },
    {
        id: 'folder',
        label: 'folder.jpg',
        detail: '600 × 600 · Local file',
        src: 'https://picsum.photos/seed/lar-cover-3/300/300',
    },
    { id: 'embedded', label: 'Embedded in 01 - Airbag.flac', detail: '500 × 500', src: undefined },
];

function CoverPicker({ initial = 'musicbrainz' }: { initial?: string }) {
    const [selected, setSelected] = useState(initial);

    return (
        <ImagePicker
            label="Choose a cover"
            header={
                <div className="flex items-center justify-between gap-3">
                    <Text tone="muted">4 covers found for OK Computer</Text>
                    <ImageUpload
                        label="Upload cover"
                        hint="JPEG, PNG, WebP or GIF, up to 10 MB"
                        onFile={() => undefined}
                    />
                </div>
            }
        >
            <ImagePickerGrid label="Covers">
                {options.map((option) => (
                    <ImagePickerOption
                        key={option.id}
                        label={option.label}
                        detail={option.detail}
                        src={option.src}
                        errorLabel="Cover could not be loaded"
                        selected={selected === option.id}
                        onSelect={() => setSelected(option.id)}
                    />
                ))}
            </ImagePickerGrid>
        </ImagePicker>
    );
}

const meta = {
    title: 'Display/ImagePicker',
    component: ImagePickerOption,
    args: {
        label: 'Cover Art Archive',
        detail: '1200 × 1200',
        src: 'https://picsum.photos/seed/lar-cover-1/300/300',
        errorLabel: 'Cover could not be loaded',
        selected: false,
        onSelect: () => undefined,
    },
    render: (args) => (
        <div className="w-40">
            <ImagePickerOption {...args} />
        </div>
    ),
} satisfies Meta<typeof ImagePickerOption>;

export default meta;

type Story = StoryObj<typeof meta>;

/** The full picker: a header with an upload button over a grid of choices. */
export const Picker: Story = { render: () => <CoverPicker /> };

export const Option: Story = {};

export const Selected: Story = { args: { selected: true } };

export const Pending: Story = { args: { src: undefined, pending: true } };

export const Failed: Story = { args: { src: undefined, error: true } };

export const Disabled: Story = { args: { disabled: true } };

export const Landscape: Story = {
    args: {
        label: 'Backdrop from TMDB',
        detail: '3840 × 2160',
        src: 'https://picsum.photos/seed/lar-backdrop/640/360',
        landscape: true,
    },
    render: (args) => (
        <div className="w-72">
            <ImagePickerOption {...args} />
        </div>
    ),
};

/** Every option state side by side. */
export const States: Story = {
    render: (args) => (
        <ImagePickerGrid label="Option states">
            <ImagePickerOption {...args} label="Default" />
            <ImagePickerOption {...args} label="Selected" selected />
            <ImagePickerOption {...args} label="Pending" src={undefined} pending />
            <ImagePickerOption {...args} label="Failed" src={undefined} error />
            <ImagePickerOption {...args} label="Disabled" disabled />
            <ImagePickerOption {...args} label="Logo" aspect="logo" src={undefined} />
        </ImagePickerGrid>
    ),
};

export const Upload: Story = {
    render: () => (
        <ImageUpload label="Upload cover" hint="JPEG, PNG, WebP or GIF, up to 10 MB" onFile={() => undefined} />
    ),
};

export const UploadDisabled: Story = {
    render: () => (
        <ImageUpload
            label="Upload cover"
            hint="Uploads are turned off for this library"
            disabled
            onFile={() => undefined}
        />
    ),
};
