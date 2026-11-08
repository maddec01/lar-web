import type { Meta, StoryObj } from '@storybook/react-vite';
import { type ComponentProps, useState } from 'react';
import { fn } from 'storybook/test';

import { Button } from '../actions/Button';
import { ImageViewer } from './ImageViewer';

const photo = `data:image/svg+xml;utf8,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="1067" viewBox="0 0 1600 1067">
<defs><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f59e0b"/><stop offset="0.55" stop-color="#ec4899"/><stop offset="1" stop-color="#312e81"/></linearGradient></defs>
<rect width="1600" height="1067" fill="url(#sky)"/>
<circle cx="1120" cy="520" r="120" fill="#fde68a" opacity="0.9"/>
<path d="M0 760 L260 600 L520 720 L820 540 L1120 700 L1400 600 L1600 680 L1600 1067 L0 1067 Z" fill="#1e1b4b"/>
<path d="M0 880 L340 780 L700 860 L1040 760 L1600 900 L1600 1067 L0 1067 Z" fill="#0f0a2e"/>
</svg>`)}`;

/** Opens with the story, and reopens from the button after it is closed. */
function ImageViewerDemo(args: ComponentProps<typeof ImageViewer>) {
    const [open, setOpen] = useState(args.open);

    return (
        <>
            <Button variant="secondary" onClick={() => setOpen(true)}>
                View photo
            </Button>
            <ImageViewer
                {...args}
                open={open}
                onClose={() => {
                    setOpen(false);
                    args.onClose();
                }}
            />
        </>
    );
}

const meta = {
    title: 'Overlays/ImageViewer',
    component: ImageViewer,
    args: {
        open: true,
        alt: 'Sunset over the hills of Sintra',
        caption: 'Sintra at sunset · 14 June 2019',
        resolution: { width: 1600, height: 1067 },
        src: photo,
        onClose: fn(),
    },
    render: (args) => <ImageViewerDemo {...args} />,
} satisfies Meta<typeof ImageViewer>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Closed: Story = { args: { open: false } };

export const WithoutCaption: Story = { args: { caption: undefined, resolution: undefined } };

/** Without a source yet, the viewer shows the loading indicator rather than a broken image. */
export const Loading: Story = { args: { src: undefined } };

export const LongCaption: Story = {
    args: {
        caption:
            'The whole family on the terrace of Pena Palace after the long walk up from the village, just before the fog rolled in over the Moorish Castle',
    },
};

/** Catalog artwork uses the loaded image’s dimensions when no original resolution is supplied. */
export const NaturalDimensions: Story = { args: { resolution: undefined, caption: 'Album cover' } };
