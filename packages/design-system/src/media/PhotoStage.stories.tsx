import type { Meta, StoryObj } from '@storybook/react-vite';
import { CameraIcon } from 'lucide-react';

import { PhotoStage } from './PhotoStage';

const meta = {
    title: 'Media/PhotoStage',
    component: PhotoStage,
    args: {
        alt: 'Harbour at dawn',
        width: 6000,
        height: 4000,
        src: 'https://picsum.photos/seed/lar-harbour/1200/800',
        fallback: <CameraIcon />,
        viewAction: { label: 'View larger', onClick: () => undefined },
    },
} satisfies Meta<typeof PhotoStage>;

export default meta;

type Story = StoryObj<typeof meta>;

/** A landscape photo fills the stage’s width. */
export const Landscape: Story = {};

/** A portrait photo is centred, no taller than 70% of the window. */
export const Portrait: Story = {
    args: {
        alt: 'Kitchen window light',
        width: 3024,
        height: 4032,
        src: 'https://picsum.photos/seed/lar-window/600/800',
    },
};

export const Loading: Story = { args: { src: undefined, pending: true } };

/** The image failed: the frame keeps the photo’s shape and shows the fallback. */
export const Failed: Story = { args: { error: true } };
