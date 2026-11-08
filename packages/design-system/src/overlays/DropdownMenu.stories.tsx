import type { Meta, StoryObj } from '@storybook/react-vite';
import {
    ActivityIcon,
    DownloadIcon,
    LayoutGridIcon,
    ListIcon,
    LogOutIcon,
    MoreHorizontalIcon,
    PencilIcon,
    PlayIcon,
    RefreshCwIcon,
    SettingsIcon,
    ShieldCheckIcon,
    Trash2Icon,
    UserIcon,
} from 'lucide-react';
import { type ComponentProps, useState } from 'react';
import { fn } from 'storybook/test';

import { Button } from '../actions/Button';
import { IconButton } from '../actions/IconButton';
import { ThemeSwitch } from '../actions/ThemeSwitch';
import type { ThemePreference } from '../foundations/Theme';
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

/** What the menu acts on is busy: its state heads the menu, never a disabled entry standing in for it, and the menu
 *  keeps the page's 16px gutter from the window's edge. */
export const WithStatus: Story = {
    decorators: [
        (Story) => (
            <div className="flex justify-end">
                <Story />
            </div>
        ),
    ],
    render: (args) => (
        <DropdownMenu {...args}>
            <DropdownMenu.Trigger asChild>
                <IconButton aria-label="Catalog actions" icon={<MoreHorizontalIcon />} />
            </DropdownMenu.Trigger>
            <DropdownMenu.Content align="end">
                <DropdownMenu.Status state="active" label="Scanning" detail="1,204 of 3,310 files" />
                <DropdownMenu.Item onSelect={fn()}>
                    <SettingsIcon />
                    Edit Music
                </DropdownMenu.Item>
                <DropdownMenu.Item onSelect={fn()}>
                    <ActivityIcon />
                    Scan status
                </DropdownMenu.Item>
                <DropdownMenu.Item onSelect={fn()}>
                    <ShieldCheckIcon />
                    Check-up
                </DropdownMenu.Item>
            </DropdownMenu.Content>
        </DropdownMenu>
    ),
};

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

function AppearanceRow() {
    const [theme, setTheme] = useState<ThemePreference>('system');

    return <ThemeSwitch placement="menu" label="Appearance" value={theme} onChange={setTheme} />;
}

/** The account menu with an Appearance row: ThemeSwitch `placement="menu"`, the same pill as on a settings page, its
 *  label and segments keeping the entries' 12px inset, so the control lines up with the entries' text. No entry has an
 *  icon, so none does (not even Sign out). */
export const AccountWithAppearance: Story = {
    render: (args) => (
        <DropdownMenu {...args}>
            <DropdownMenu.Trigger asChild>
                <Button variant="quiet" leftIcon={<UserIcon />}>
                    Pedro
                </Button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content align="end" width="md">
                <DropdownMenu.Label presentation="identity">pedro@lar.local</DropdownMenu.Label>
                <DropdownMenu.Separator />
                <AppearanceRow />
                <DropdownMenu.Separator />
                <DropdownMenu.Item>Change password</DropdownMenu.Item>
                <DropdownMenu.Item>Replace recovery key</DropdownMenu.Item>
                <DropdownMenu.Separator />
                <DropdownMenu.Item>Sign out</DropdownMenu.Item>
            </DropdownMenu.Content>
        </DropdownMenu>
    ),
};

function SortMenu(args: ComponentProps<typeof DropdownMenu>) {
    const [sort, setSort] = useState('added');
    const [order, setOrder] = useState('descending');
    const [view, setView] = useState('grid');
    const [unmatched, setUnmatched] = useState(true);
    const [missing, setMissing] = useState(false);

    return (
        <DropdownMenu {...args}>
            <DropdownMenu.Trigger asChild>
                <Button variant="context">Sort and view</Button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content align="start">
                <DropdownMenu.RadioGroup label="View" presentation="segmented" value={view} onValueChange={setView}>
                    <DropdownMenu.RadioItem presentation="segmented" value="grid" aria-label="Grid">
                        <LayoutGridIcon />
                    </DropdownMenu.RadioItem>
                    <DropdownMenu.RadioItem presentation="segmented" value="list" aria-label="List">
                        <ListIcon />
                    </DropdownMenu.RadioItem>
                </DropdownMenu.RadioGroup>
                <DropdownMenu.Separator />
                <DropdownMenu.RadioGroup label="Sort by" value={sort} onValueChange={setSort}>
                    <DropdownMenu.RadioItem value="title">Title</DropdownMenu.RadioItem>
                    <DropdownMenu.RadioItem value="artist">Artist</DropdownMenu.RadioItem>
                    <DropdownMenu.RadioItem value="year">Release year</DropdownMenu.RadioItem>
                    <DropdownMenu.RadioItem value="added">Recently added</DropdownMenu.RadioItem>
                </DropdownMenu.RadioGroup>
                <DropdownMenu.Separator />
                <DropdownMenu.RadioGroup label="Order" value={order} onValueChange={setOrder}>
                    <DropdownMenu.RadioItem value="ascending">Oldest first</DropdownMenu.RadioItem>
                    <DropdownMenu.RadioItem value="descending">Newest first</DropdownMenu.RadioItem>
                </DropdownMenu.RadioGroup>
                <DropdownMenu.Separator />
                <DropdownMenu.Group label="Show">
                    <DropdownMenu.CheckboxItem checked={unmatched} onCheckedChange={setUnmatched}>
                        Unmatched albums
                    </DropdownMenu.CheckboxItem>
                    <DropdownMenu.CheckboxItem checked={missing} onCheckedChange={setMissing}>
                        Albums with missing tracks
                    </DropdownMenu.CheckboxItem>
                </DropdownMenu.Group>
            </DropdownMenu.Content>
        </DropdownMenu>
    );
}

/** Labelled groups: the chosen field and the chosen direction each carry a tick, so the current sort reads at a glance
 *  and the pointer’s highlight never looks like a choice. Checkbox items tick the same way. */
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

/** Choices with a detail line under their label, as Lar Factory’s board lists the models a start can use. */
export const ChoicesWithDetail: Story = {
    render: (args) => (
        <DropdownMenu {...args}>
            <DropdownMenu.Trigger asChild>
                <Button variant="secondary" size="sm" leftIcon={<PlayIcon />}>
                    Start ▾
                </Button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content align="start">
                <DropdownMenu.RadioGroup label="Start with" value="default">
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

/** Model/account menus have room for human names and scroll below a steady cap. */
export const LongModelMenu: Story = {
    render: () => (
        <DropdownMenu defaultOpen>
            <DropdownMenu.Trigger asChild>
                <Button variant="secondary">Shape</Button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content width="lg" height="capped">
                <DropdownMenu.Group label="Claude · Personal">
                    {Array.from({ length: 24 }, (_, index) => (
                        <DropdownMenu.Item key={index}>Claude Opus 5.5 · 1M context · {index + 1}</DropdownMenu.Item>
                    ))}
                </DropdownMenu.Group>
            </DropdownMenu.Content>
        </DropdownMenu>
    ),
};
