import type { Meta, StoryObj } from '@storybook/react-vite';
import {
    DownloadIcon,
    LayoutGridIcon,
    ListIcon,
    LogOutIcon,
    MoreHorizontalIcon,
    PencilIcon,
    PlayIcon,
    RefreshCwIcon,
    SettingsIcon,
    Trash2Icon,
    UserIcon,
} from 'lucide-react';
import { type ComponentProps, useState } from 'react';
import { fn } from 'storybook/test';

import { Button } from '../actions/Button';
import { IconButton } from '../actions/IconButton';
import { DropdownMenu } from './DropdownMenu';

const meta = {
    title: 'Overlays/DropdownMenu',
    component: DropdownMenu,
    args: { defaultOpen: true, onOpenChange: fn(), children: null },
    decorators: [
        (Story) => (
            <div className="h-96">
                <Story />
            </div>
        ),
    ],
    render: (args) => (
        <DropdownMenu {...args}>
            <DropdownMenu.Trigger asChild>
                <IconButton aria-label="Album actions" icon={<MoreHorizontalIcon />} />
            </DropdownMenu.Trigger>
            <DropdownMenu.Content align="start">
                <DropdownMenu.Item onSelect={fn()}>
                    <PlayIcon />
                    Play
                </DropdownMenu.Item>
                <DropdownMenu.Item onSelect={fn()}>
                    <PencilIcon />
                    Edit metadata
                </DropdownMenu.Item>
                <DropdownMenu.Item onSelect={fn()}>
                    <RefreshCwIcon />
                    Refresh artwork
                </DropdownMenu.Item>
                <DropdownMenu.Item disabled>
                    <DownloadIcon />
                    Download (offline)
                </DropdownMenu.Item>
                <DropdownMenu.Separator />
                <DropdownMenu.Item destructive onSelect={fn()}>
                    <Trash2Icon />
                    Remove from library
                </DropdownMenu.Item>
            </DropdownMenu.Content>
        </DropdownMenu>
    ),
} satisfies Meta<typeof DropdownMenu>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Actions: Story = {};

export const Closed: Story = { args: { defaultOpen: false } };

/** The account menu: an identity label, links, then sign out. */
export const Account: Story = {
    render: (args) => (
        <DropdownMenu {...args}>
            <DropdownMenu.Trigger asChild>
                <Button variant="quiet" leftIcon={<UserIcon />}>
                    Pedro
                </Button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content align="start" width="md">
                <DropdownMenu.Label presentation="identity">pedro@lar.local</DropdownMenu.Label>
                <DropdownMenu.Item aria-current="page">
                    <UserIcon />
                    Profile
                </DropdownMenu.Item>
                <DropdownMenu.Item>
                    <SettingsIcon />
                    Server settings
                </DropdownMenu.Item>
                <DropdownMenu.Separator />
                <DropdownMenu.Item>
                    <LogOutIcon />
                    Sign out
                </DropdownMenu.Item>
            </DropdownMenu.Content>
        </DropdownMenu>
    ),
};

function SortMenu(args: ComponentProps<typeof DropdownMenu>) {
    const [sort, setSort] = useState('added');
    const [view, setView] = useState('grid');

    return (
        <DropdownMenu {...args}>
            <DropdownMenu.Trigger asChild>
                <Button variant="context">Sort and view</Button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content align="start">
                <DropdownMenu.Label>View</DropdownMenu.Label>
                <DropdownMenu.RadioGroup presentation="segmented" value={view} onValueChange={setView}>
                    <DropdownMenu.RadioItem presentation="segmented" value="grid" aria-label="Grid">
                        <LayoutGridIcon />
                    </DropdownMenu.RadioItem>
                    <DropdownMenu.RadioItem presentation="segmented" value="list" aria-label="List">
                        <ListIcon />
                    </DropdownMenu.RadioItem>
                </DropdownMenu.RadioGroup>
                <DropdownMenu.Separator />
                <DropdownMenu.Label>Sort by</DropdownMenu.Label>
                <DropdownMenu.RadioGroup value={sort} onValueChange={setSort}>
                    <DropdownMenu.RadioItem value="title">Title</DropdownMenu.RadioItem>
                    <DropdownMenu.RadioItem value="artist">Artist</DropdownMenu.RadioItem>
                    <DropdownMenu.RadioItem value="year">Release year</DropdownMenu.RadioItem>
                    <DropdownMenu.RadioItem value="added">Recently added</DropdownMenu.RadioItem>
                </DropdownMenu.RadioGroup>
                <DropdownMenu.Separator />
                <DropdownMenu.CheckboxItem checked>Show unmatched albums</DropdownMenu.CheckboxItem>
            </DropdownMenu.Content>
        </DropdownMenu>
    );
}

/** Radio groups, a segmented group that keeps the menu open, and a checkbox item. */
export const SortAndView: Story = { render: (args) => <SortMenu {...args} /> };

export const LongMenu: Story = {
    render: (args) => (
        <DropdownMenu {...args}>
            <DropdownMenu.Trigger asChild>
                <Button variant="context">Move to catalog</Button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content align="start">
                {Array.from({ length: 40 }, (_, index) => (
                    <DropdownMenu.Item key={index}>
                        {index === 0
                            ? 'Photos from every family holiday between 2004 and 2026, sorted by place'
                            : `Catalog ${index + 1}`}
                    </DropdownMenu.Item>
                ))}
            </DropdownMenu.Content>
        </DropdownMenu>
    ),
};

/** Choices with a detail line under their label, as Lar Factory's board lists the models a start can use. */
export const ChoicesWithDetail: Story = {
    render: (args) => (
        <DropdownMenu {...args}>
            <DropdownMenu.Trigger asChild>
                <Button variant="tinted" compact leftIcon={<PlayIcon />}>
                    Start ▾
                </Button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content align="start">
                <DropdownMenu.RadioGroup value="default">
                    <DropdownMenu.Label>Start with</DropdownMenu.Label>
                    <DropdownMenu.RadioItem value="default">
                        <DropdownMenu.ItemText detail="Codex · gpt-5.5, high effort">
                            T3 Project default
                        </DropdownMenu.ItemText>
                    </DropdownMenu.RadioItem>
                    <DropdownMenu.RadioItem value="opus">
                        <DropdownMenu.ItemText>Claude Opus</DropdownMenu.ItemText>
                    </DropdownMenu.RadioItem>
                </DropdownMenu.RadioGroup>
            </DropdownMenu.Content>
        </DropdownMenu>
    ),
};
