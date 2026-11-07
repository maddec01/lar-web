import type { Meta, StoryObj } from '@storybook/react-vite';

import { Avatar } from './Avatar';

const meta = {
    title: 'Display/Avatar',
    component: Avatar,
    args: { name: 'Ana Ferreira', src: 'https://picsum.photos/seed/lar-ana/96/96', alt: 'Ana Ferreira' },
} satisfies Meta<typeof Avatar>;

export default meta;

type Story = StoryObj<typeof meta>;

export const WithImage: Story = {};

export const Initials: Story = { args: { src: undefined, name: 'Rui Costa' } };

export const FallbackIcon: Story = { args: { src: undefined, name: undefined, showFallbackIcon: true } };

export const Square: Story = { args: { shape: 'square' } };

/** The 24px avatar beside a name in a dense list, such as a comment's author. */
export const Compact: Story = { args: { src: undefined, name: 'Ana Silva', compact: true } };

/** The household's users, with and without a photo. */
export const Household: Story = {
    render: (args) => (
        <div className="flex items-center gap-3">
            <Avatar {...args} />
            <Avatar name="Rui Costa" />
            <Avatar name="Marta Silva" />
            <Avatar name="Guest" showFallbackIcon />
        </div>
    ),
};
