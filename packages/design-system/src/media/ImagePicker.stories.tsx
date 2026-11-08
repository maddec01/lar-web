import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';

import { Alert } from '../feedback/Alert';
import { ImagePicker, ImagePickerGrid, ImagePickerHeader, ImagePickerOption, ImageUpload } from './ImagePicker';
import { darkTitleLogo, lightTitleLogo } from './titleLogoFixtures';

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
                <ImagePickerHeader
                    title="Available images"
                    count={options.length}
                    countLabel={`${options.length} images`}
                    description="Covers from Cover Art Archive, fanart.tv and the album’s own folder."
                    automatic={{ label: 'Use automatic', onAction: () => undefined }}
                    remove={{ label: 'Remove', onAction: () => undefined }}
                    actionsLabel="More image actions"
                    upload={
                        <ImageUpload
                            label="Upload cover"
                            hint="JPEG, PNG, WebP or GIF, up to 10 MB"
                            onFile={() => undefined}
                        />
                    }
                />
            }
        >
            <ImagePickerGrid label="Covers">
                {options.map((option) => (
                    <ImagePickerOption
                        key={option.id}
                        label={option.label}
                        detail={option.detail}
                        src={option.src}
                        errorLabel="Cover couldn’t be loaded"
                        selected={selected === option.id}
                        onSelect={() => setSelected(option.id)}
                    />
                ))}
            </ImagePickerGrid>
        </ImagePicker>
    );
}

const meta = {
    title: 'Media/ImagePicker',
    component: ImagePickerOption,
    args: {
        label: 'Cover Art Archive',
        detail: '1200 × 1200',
        src: 'https://picsum.photos/seed/lar-cover-1/300/300',
        errorLabel: 'Cover couldn’t be loaded',
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

/** One header for every picker: the album cover (metadata shared by two catalogs, so the one notice; a change staged,
 *  undone from its own line) and the movie poster (still looking up) keep the same one-row toolbar: Upload, then ⋯. */
export const HeaderContract: Story = {
    render: () => (
        <div className="grid max-w-xl gap-8">
            <ImagePickerHeader
                notice={<Alert tone="info" size="sm" title="Changes here apply in Music and Vinyl Rips" />}
                title="Available images"
                count={8}
                countLabel="8 images"
                description="Covers from Cover Art Archive, fanart.tv and TheAudioDB."
                undo={{ label: 'Undo', onAction: () => undefined }}
                automatic={{ label: 'Use automatic', onAction: () => undefined }}
                remove={{ label: 'Remove', onAction: () => undefined }}
                actionsLabel="More image actions"
                upload={<ImageUpload label="Upload an image" hint="JPEG, PNG, WebP or GIF" onFile={() => undefined} />}
                pending={{ label: 'fanart.tv', detail: 'Not saved yet' }}
            />
            <ImagePickerHeader
                title="Available images"
                loading
                loadingLabel="Looking for posters"
                description="Posters from Trakt and fanart.tv."
                automatic={{ label: 'Use automatic', onAction: () => undefined, disabled: true }}
                remove={{ label: 'Remove', onAction: () => undefined }}
                actionsLabel="More image actions"
                upload={<ImageUpload label="Upload an image" hint="JPEG, PNG, WebP or GIF" onFile={() => undefined} />}
            />
        </div>
    ),
};

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

/** Long match titles stay readable, with year and media kind independent of the title. */
export const MovieCandidate: Story = {
    args: {
        label: 'The Lantern Keeper: Tales from the Northern Coast',
        year: 2024,
        kind: 'movie',
        src: undefined,
        detail: undefined,
        aspect: 'poster',
    },
};

/** Both inks stay identifiable when selecting title artwork, in either UI theme. */
export const TransparentLogos: Story = {
    render: () => (
        <ImagePicker
            label="Title logos"
            header={<ImagePickerHeader title="Available logos" actionsLabel="More image actions" />}
        >
            <ImagePickerGrid label="Lar artwork">
                {[lightTitleLogo, darkTitleLogo].map((src, index) => (
                    <ImagePickerOption
                        key={src}
                        src={src}
                        aspect="logo"
                        label={index ? 'Dark logo' : 'Light logo'}
                        errorLabel="Couldn’t load logo"
                        selected={index === 0}
                        onSelect={() => {}}
                    />
                ))}
            </ImagePickerGrid>
        </ImagePicker>
    ),
};
