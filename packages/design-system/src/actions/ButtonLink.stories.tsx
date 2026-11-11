import type { Meta, StoryObj } from '@storybook/react-vite';
import { DownloadIcon, GitPullRequestIcon, MessageSquareTextIcon } from 'lucide-react';
import { fn } from 'storybook/test';

import { GitHubIcon } from '../icons/BrandIcons';
import { Button } from './Button';
import { ButtonLink } from './ButtonLink';

const meta = {
    title: 'Actions/ButtonLink',
    component: ButtonLink,
    args: { href: '#install', children: 'Install Lar', variant: 'primary', size: 'lg', onNavigate: fn() },
    argTypes: {
        variant: { control: 'inline-radio', options: ['primary', 'secondary', 'inverse', 'quiet', 'tinted'] },
        size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
        look: { control: 'inline-radio', options: ['marketing', 'app'] },
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

/** The app Button’s compact look as a link, as Lar Factory’s board opens a pull request or a T3 thread. */
export const Compact: Story = {
    render: () => (
        <div className="flex items-center gap-3">
            <ButtonLink href="#pr" size="sm" variant="secondary" icon={<GitPullRequestIcon />}>
                Open PR
            </ButtonLink>
            <ButtonLink href="#main" size="sm" variant="primary">
                Open on GitHub
            </ButtonLink>
            <ButtonLink
                href="#thread"
                size="sm"
                iconOnly
                variant="secondary"
                icon={<MessageSquareTextIcon />}
                aria-label="Open thread"
            />
        </div>
    ),
};

/** The app look at both app sizes beside the Button it matches: `sm` 28px on a row or a card, `md` 32px in a dialog's
 *  footer, each in the recipes a link takes, `tinted` among them. */
export const AppLook: Story = {
    render: () => (
        <div className="flex flex-col gap-4">
            {(['sm', 'md'] as const).map((size) => (
                <div key={size} className="flex flex-wrap items-center gap-3">
                    {(['primary', 'tinted', 'secondary', 'quiet'] as const).map((variant) => (
                        <ButtonLink
                            key={variant}
                            href={`#${variant}`}
                            look="app"
                            size={size}
                            variant={variant}
                            icon={<GitPullRequestIcon />}
                        >
                            {variant}
                        </ButtonLink>
                    ))}
                    <Button size={size} variant="tinted" leftIcon={<GitPullRequestIcon />}>
                        Button
                    </Button>
                </div>
            ))}
        </div>
    ),
};
