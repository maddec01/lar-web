import type { Meta, StoryObj } from '@storybook/react-vite';

import { AzureDevOpsIcon, GitHubIcon } from './BrandIcons';

const meta = {
    title: 'Foundations/Brand icons',
    component: GitHubIcon,
} satisfies Meta<typeof GitHubIcon>;

export default meta;

type Story = StoryObj<typeof meta>;

/** The brand marks lucide does not draw, at the sizes the apps use them. */
export const Marks: Story = {
    render: () => (
        <div className="text-base-content flex items-center gap-4">
            <GitHubIcon className="size-3" />
            <GitHubIcon className="size-5" />
            <AzureDevOpsIcon className="size-3" />
            <AzureDevOpsIcon className="size-5" />
        </div>
    ),
};
