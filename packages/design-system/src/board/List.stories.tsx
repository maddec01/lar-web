import type { Meta, StoryObj } from '@storybook/react-vite';
import { FolderGit2Icon, GitPullRequestIcon, InboxIcon, SquarePenIcon } from 'lucide-react';
import { fn } from 'storybook/test';

import { Button } from '../actions/Button';
import { Badge } from '../display/Badge';
import { Spinner } from '../feedback/Spinner';
import { Input } from '../forms/Input';
import { buttonKind } from './ButtonKinds';
import { FilterBar, FilterChip, FilterLabelBadge, FilterMenu } from './Filters';
import { ListButton, ListGroupItem, ListHeader, ListItemRow, ListNote, ListSortMenu } from './List';

const meta = {
    title: 'Board/List',
    component: ListHeader,
    args: {
        search: <Input type="search" placeholder="Search List" aria-label="Search List items" />,
        add: (
            <Button {...buttonKind('main')} leftIcon={<SquarePenIcon />}>
                Add item
            </Button>
        ),
        title: 'lar-factory',
        count: 12,
        scope: (
            <Button {...buttonKind('other')} compact={false} data-toggle aria-pressed>
                Board scoped
            </Button>
        ),
        sort: (
            <ListSortMenu
                value="updated"
                options={[
                    { value: 'updated', label: 'Recently updated' },
                    { value: 'priority', label: 'Priority' },
                ]}
                onChange={fn()}
            />
        ),
        filters: (
            <FilterBar>
                <FilterMenu which="kind" name="Kind" picked={0}>
                    Kinds
                </FilterMenu>
                <FilterMenu which="labels" name="Labels" picked={1}>
                    Labels
                </FilterMenu>
                <FilterChip removeLabel="Remove bug" onRemove={fn()}>
                    <FilterLabelBadge label="bug" color="#D73A4A" />
                </FilterChip>
            </FilterBar>
        ),
    },
} satisfies Meta<typeof ListHeader>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Header: Story = {};

/** A group still reading shows no count. */
export const Reading: Story = { args: { count: undefined } };

export const Rows: StoryObj<typeof ListItemRow> = {
    render: () => (
        <div className="grid w-[36rem]">
            <ListItemRow
                item="61"
                name="Move the title bar into the design system"
                onOpen={fn()}
                source={<GitPullRequestIcon className="size-4" />}
                reference="#61"
                title="Move the title bar into the design system"
                repoIcon={<FolderGit2Icon className="size-3" />}
                meta="lar-factory · 2h"
                chips={<Badge hue={25}>Bug</Badge>}
            />
            <ListItemRow
                item="draft"
                name="A draft with no ticket yet, whose title is long enough to truncate in the row"
                onOpen={fn()}
                source={<GitPullRequestIcon className="size-4" />}
                title="A draft with no ticket yet, whose title is long enough to truncate in the row"
                meta="1d"
            />
            <ListNote reading>
                <Spinner label="Loading more Projects…" />
            </ListNote>
        </div>
    ),
};

export const Empty: StoryObj<typeof ListNote> = { render: () => <ListNote>Nothing in List.</ListNote> };

export const Groups: StoryObj<typeof ListGroupItem> = {
    render: () => (
        <div className="grid w-56">
            <ListGroupItem label="All Projects" count={24} icon={<InboxIcon />} active onPick={fn()} />
            <ListGroupItem label="lar-factory" count={12} icon={<FolderGit2Icon />} active={false} onPick={fn()} />
            <ListGroupItem label="lar-server" icon={<FolderGit2Icon />} active={false} onPick={fn()} />
        </div>
    ),
};

export const TitleBarButton: StoryObj<typeof ListButton> = {
    render: () => (
        <div className="@container flex gap-2">
            <ListButton label="List" icon={<InboxIcon />} count={7} loadingLabel="Loading Projects…" onOpen={fn()} />
            <ListButton
                label="List"
                icon={<InboxIcon />}
                count={undefined}
                loadingLabel="Loading Projects…"
                onOpen={fn()}
            />
        </div>
    ),
};
