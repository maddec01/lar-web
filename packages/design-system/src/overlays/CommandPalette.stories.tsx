import type { Meta, StoryObj } from '@storybook/react-vite';
import {
    BookIcon,
    BriefcaseIcon,
    DiscIcon,
    FilmIcon,
    FolderIcon,
    ImageIcon,
    type LucideIcon,
    MusicIcon,
    PlusIcon,
    SettingsIcon,
    TagIcon,
    TvIcon,
} from 'lucide-react';
import { type ComponentProps, useState } from 'react';
import { fn } from 'storybook/test';

import { Button } from '../actions/Button';
import { ResultRow } from '../collections/ResultList';
import { Kbd } from '../display/Kbd';
import { CommandPalette, CommandPaletteGroup, CommandPaletteOption, useCommandPaletteOption } from './CommandPalette';

interface Destination {
    value: string;
    title: string;
    kind: string;
    subtitle?: string;
    icon: LucideIcon;
}

const groups: { label: string; items: Destination[] }[] = [
    {
        label: 'Libraries',
        items: [
            { value: 'music', title: 'Music', kind: 'Library', subtitle: '1,284 albums', icon: MusicIcon },
            { value: 'movies', title: 'Movies', kind: 'Library', subtitle: '612 movies', icon: FilmIcon },
            { value: 'tv', title: 'TV shows', kind: 'Library', subtitle: '48 shows', icon: TvIcon },
            { value: 'photos', title: 'Photos', kind: 'Library', subtitle: '48,120 photos', icon: ImageIcon },
            { value: 'books', title: 'Books', kind: 'Library', subtitle: '412 books', icon: BookIcon },
        ],
    },
    {
        label: 'Recent',
        items: [
            { value: 'kind-of-blue', title: 'Kind of Blue', kind: 'Album', subtitle: 'Miles Davis', icon: DiscIcon },
            { value: 'dune-2', title: 'Dune: Part Two', kind: 'Movie', subtitle: '2024', icon: FilmIcon },
            {
                value: 'family-photos',
                title: 'Family photos',
                kind: 'Catalog',
                subtitle: '/mnt/media/photos/family',
                icon: FolderIcon,
            },
        ],
    },
    {
        label: 'Server',
        items: [
            { value: 'jobs', title: 'Jobs', kind: 'Page', subtitle: '2 running', icon: BriefcaseIcon },
            { value: 'settings', title: 'Settings', kind: 'Page', icon: SettingsIcon },
        ],
    },
];

function Option({ item, onSelect }: { item: Destination; onSelect: (value: string) => void }) {
    const option = useCommandPaletteOption(item.value);
    const Icon = item.icon;

    return (
        <ResultRow
            {...option}
            presentation="icon"
            artwork={<Icon />}
            title={item.title}
            subtitle={item.subtitle}
            kind={item.kind}
            onSelect={() => onSelect(item.value)}
        />
    );
}

type DemoProps = ComponentProps<typeof CommandPalette> & { initialQuery?: string; scoped?: boolean };

/** Opens with the story, filters as you type, and reopens from the button after it is closed. */
function CommandPaletteDemo({ initialQuery = '', scoped = false, ...args }: DemoProps) {
    const [open, setOpen] = useState(true);
    const [query, setQuery] = useState(initialQuery);
    const [scope, setScope] = useState(scoped ? 'Libraries' : undefined);
    const needle = query.trim().toLocaleLowerCase();
    const visible = groups
        .filter((group) => !scope || group.label === scope)
        .map((group) => ({
            ...group,
            items: group.items.filter((item) =>
                `${item.title} ${item.subtitle ?? ''}`.toLocaleLowerCase().includes(needle),
            ),
        }))
        .filter((group) => group.items.length > 0);
    const select = (value: string) => {
        args.onSelect(value);
        setOpen(false);
    };

    return (
        <>
            <Button variant="secondary" onClick={() => setOpen(true)}>
                Go to…
            </Button>
            {open ? (
                <CommandPalette
                    {...args}
                    query={query}
                    onQueryChange={(next) => {
                        setQuery(next);
                        args.onQueryChange(next);
                    }}
                    scope={
                        scope
                            ? { label: scope, leaveLabel: `Leave ${scope}`, onLeave: () => setScope(undefined) }
                            : undefined
                    }
                    options={args.busy ? [] : visible.flatMap((group) => group.items.map((item) => item.value))}
                    onSelect={select}
                    onClose={() => {
                        setOpen(false);
                        args.onClose();
                    }}
                >
                    {args.busy
                        ? null
                        : visible.map((group) => (
                              <CommandPaletteGroup key={group.label} label={group.label}>
                                  {group.items.map((item) => (
                                      <Option key={item.value} item={item} onSelect={select} />
                                  ))}
                              </CommandPaletteGroup>
                          ))}
                </CommandPalette>
            ) : null}
        </>
    );
}

const meta = {
    title: 'Overlays/CommandPalette',
    component: CommandPalette,
    args: {
        label: 'Go to',
        description: 'Search libraries, recent items and server pages',
        placeholder: 'Search Lar…',
        listLabel: 'Destinations',
        query: '',
        options: [],
        empty: 'Nothing matches your search',
        footer: (
            <>
                <span>
                    <Kbd>↑↓</Kbd> to move
                </span>
                <span>
                    <Kbd>↵</Kbd> to open
                </span>
                <span>
                    <Kbd>esc</Kbd> to close
                </span>
            </>
        ),
        onQueryChange: fn(),
        onSelect: fn(),
        onClose: fn(),
        children: null,
    },
    render: (args) => <CommandPaletteDemo {...args} />,
} satisfies Meta<typeof CommandPalette>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Filtered: Story = { render: (args) => <CommandPaletteDemo {...args} initialQuery="fam" /> };

/** A scope chip narrows the list to one group; Backspace in the empty field leaves it. */
export const Scoped: Story = { render: (args) => <CommandPaletteDemo {...args} scoped /> };

export const Empty: Story = { render: (args) => <CommandPaletteDemo {...args} initialQuery="zzz" /> };

export const Busy: Story = { args: { busy: true, empty: 'Searching…' } };

export const WithoutFooter: Story = { args: { footer: undefined } };

const filterGroups = [
    {
        label: 'Actions',
        options: [
            { value: 'action:add', name: 'Add item', icon: <PlusIcon /> },
            { value: 'action:settings', name: 'Settings', icon: <SettingsIcon /> },
        ],
    },
    {
        label: 'Labels',
        options: [
            { value: 'label:bug', name: 'bug', icon: <TagIcon />, hint: '12 items', checked: true },
            { value: 'label:docs', name: 'documentation', icon: <TagIcon />, meta: 'lar-works/lar-web' },
        ],
    },
];

/** Several filter tokens before the field, a Clear control after it, and options that tick when on. */
function FilterDemo({ busy = false }: { busy?: boolean }) {
    const [tokens, setTokens] = useState(['lar-factory', 'Bug', 'needs triage', 'design']);
    const options = filterGroups.flatMap((group) => group.options);

    return (
        <>
            <Button variant="secondary">Search the board</Button>
            <CommandPalette
                label="Search the board"
                description="Find tickets, actions and settings, and filter the board."
                placeholder="Search"
                query=""
                onQueryChange={fn()}
                tokens={tokens.map((label) => ({
                    id: label,
                    label,
                    leading: <TagIcon className="size-3" />,
                    remove: {
                        label: `Remove ${label}`,
                        onRemove: () => setTokens((now) => now.filter((t) => t !== label)),
                    },
                }))}
                onBackspaceEmpty={() => setTokens((now) => now.slice(0, -1))}
                trailing={
                    tokens.length ? (
                        <Button variant="secondary" compact onClick={() => setTokens([])}>
                            Clear
                        </Button>
                    ) : null
                }
                options={options.map((option) => option.value)}
                onSelect={fn()}
                onClose={fn()}
                listLabel="Search results"
                busy={busy}
                busyLabel="Loading Projects…"
                empty="Nothing matches."
            >
                {filterGroups.map((group) => (
                    <CommandPaletteGroup key={group.label} label={group.label}>
                        {group.options.map((option) => (
                            <CommandPaletteOption key={option.value} {...option} />
                        ))}
                    </CommandPaletteGroup>
                ))}
            </CommandPalette>
        </>
    );
}

export const WithTokens: Story = { render: () => <FilterDemo /> };

/** While more may arrive, the busy label shows under what is listed so far. */
export const BusyWithOptions: Story = { render: () => <FilterDemo busy /> };
