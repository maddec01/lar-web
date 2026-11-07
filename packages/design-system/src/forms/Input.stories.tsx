import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';

import { Input } from './Input';

const meta = {
    title: 'Forms/Input',
    component: Input,
    args: { placeholder: 'Search albums, artists and tracks', 'aria-label': 'Search' },
    argTypes: {
        variant: { control: 'select', options: ['filled', 'outline', 'flushed', 'unstyled'] },
        size: { control: 'select', options: ['xs', 'sm', 'md', 'lg', 'xl'] },
    },
    render: (args) => (
        <div className="max-w-sm">
            <Input {...args} />
        </div>
    ),
} satisfies Meta<typeof Input>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithValue: Story = { args: { defaultValue: 'Kind of Blue' } };

export const Clearable: Story = { args: { defaultValue: 'Miles Davis', clearable: true, onClear: fn() } };

export const WithCounter: Story = {
    args: { 'aria-label': 'Repository name', defaultValue: 'lar-web', maxLength: 40, showCounter: true },
};

export const Invalid: Story = {
    args: { 'aria-label': 'Media folder', defaultValue: '/srv/media/musci', invalid: true },
};

export const Disabled: Story = {
    args: { 'aria-label': 'Server address', defaultValue: 'lar.local:8096', disabled: true },
};

export const Password: Story = {
    args: { 'aria-label': 'Access token', type: 'password', defaultValue: 'ghp_example' },
};

export const LongValue: Story = {
    args: {
        'aria-label': 'Media folder',
        defaultValue:
            '/srv/media/music/David Bowie/1972 - The Rise and Fall of Ziggy Stardust and the Spiders from Mars',
    },
};

/** Every variant and state, for comparing them in light and dark. */
export const AllVariants: Story = {
    render: (args) => (
        <div className="flex max-w-sm flex-col gap-3">
            {(['filled', 'outline', 'flushed', 'unstyled'] as const).map((variant) => (
                <Input
                    key={variant}
                    {...args}
                    variant={variant}
                    placeholder={`${variant} input`}
                    aria-label={variant}
                />
            ))}
            <Input {...args} placeholder="Invalid" aria-label="Invalid" invalid />
            <Input {...args} placeholder="Disabled" aria-label="Disabled" disabled />
        </div>
    ),
};

/** `setting` is a settings row's 16rem field and `short` a few characters' one, such as a hex colour. */
export const Widths: Story = {
    render: () => (
        <div className="grid max-w-sm gap-3">
            <Input aria-label="Glossary path" presentation="setting" defaultValue="docs/glossary.md" />
            <Input aria-label="Hex colour" presentation="short" defaultValue="D73A4A" />
            <Input aria-label="Build limit" presentation="count" inputMode="numeric" defaultValue="2" />
        </div>
    ),
};

/** `title` types a document's title in place, such as a new item's in Lar Factory's Add item dialog. */
export const Title: Story = {
    render: () => (
        <div className="max-w-xl">
            <Input aria-label="Title" placeholder="Title" presentation="title" />
        </div>
    ),
};
