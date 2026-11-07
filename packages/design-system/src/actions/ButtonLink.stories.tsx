import type { Meta, StoryObj } from '@storybook/react-vite';
import { DownloadIcon } from 'lucide-react';
import { fn } from 'storybook/test';

import { GitHubIcon } from '../icons/BrandIcons';
import { ButtonLink } from './ButtonLink';

const meta = {
    title: 'Actions/ButtonLink',
    component: ButtonLink,
    args: { href: '#install', children: 'Install Lar', variant: 'primary', size: 'lg', onNavigate: fn() },
    argTypes: {
        variant: { control: 'inline-radio', options: ['primary', 'secondary', 'inverse', 'quiet'] },
        size: { control: 'inline-radio', options: ['md', 'lg'] },
    },
} satisfies Meta<typeof ButtonLink>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {};

export const WithArrow: Story = { args: { arrow: true, children: 'Start your library' } };

export const WithIcon: Story = {
    args: { variant: 'secondary', icon: <DownloadIcon />, children: 'Download for macOS' },
};

export const External: Story = {
    args: {
        variant: 'secondary',
        href: 'https://github.com/maddec01/lar-web',
        external: true,
        icon: <GitHubIcon />,
        children: 'View on GitHub',
    },
};

export const Medium: Story = { args: { size: 'md', children: 'Read the docs', arrow: true } };

/** Every recipe at both sizes, for comparing them in light and dark. */
export const Recipes: Story = {
    render: (args) => (
        <div className="flex flex-col gap-4">
            {(['lg', 'md'] as const).map((size) => (
                <div key={size} className="flex flex-wrap items-center gap-3">
                    {(['primary', 'secondary', 'inverse', 'quiet'] as const).map((variant) => (
                        <ButtonLink key={variant} {...args} size={size} variant={variant} arrow>
                            {variant}
                        </ButtonLink>
                    ))}
                </div>
            ))}
        </div>
    ),
};
