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

/** The 24px avatar beside a name in a dense list, such as a comment’s author. */
export const Compact: Story = { args: { src: undefined, name: 'Ana Silva', size: 'sm' } };

/** The household’s users, with and without a photo. */
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

/** Initials in the person's own hue (`hueKey`, their email), the same in every app, at every size. */
export const Hued: Story = {
    render: () => (
        <div className="flex items-center gap-3">
            <Avatar name="Marta Ventura" hueKey="marta.ventura@example.com" size="lg" />
            <Avatar name="Tomás Reis" hueKey="tomas@lar.home" />
            <Avatar name="Inês Duarte" hueKey="ines.duarte@example.org" size="bar" />
            <Avatar name="kai@example.com" hueKey="kai@example.com" size="sm" />
        </div>
    ),
};
