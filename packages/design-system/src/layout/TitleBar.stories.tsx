import type { Meta, StoryObj } from '@storybook/react-vite';
import { ActivityIcon, HeadphonesIcon, LayoutGridIcon, MusicIcon, ServerIcon, SettingsIcon } from 'lucide-react';
import { fn } from 'storybook/test';

import { Button } from '../actions/Button';
import { IconButton } from '../actions/IconButton';
import { Avatar } from '../display/Avatar';
import { BrandMark } from '../display/BrandMark';
import { TitleBar, TitleBarTrail } from './TitleBar';
import { CommandPaletteTrigger } from './toolbar/CommandPaletteTrigger';
import { ToolbarStatusGroup } from './toolbar/ToolbarStatusGroup';
import { ToolbarStatusItem } from './toolbar/ToolbarStatusItem';

const brand = (
    <a href="#dashboard">
        <BrandMark label="Lar" />
    </a>
);

const secondaryActions = (
    <ToolbarStatusGroup role="group" aria-label="Server online, 2 background tasks, 1 playing">
        <Button variant="summary" aria-label="Background tasks: 2 running">
            <ToolbarStatusItem icon={<ActivityIcon />} tone="info" />
        </Button>
        <Button variant="summary" aria-label="Playback: 1 stream">
            <ToolbarStatusItem icon={<HeadphonesIcon />} tone="success" />
        </Button>
        <Button variant="summary" aria-label="Server: healthy">
            <ToolbarStatusItem icon={<ServerIcon />} tone="success" />
        </Button>
    </ToolbarStatusGroup>
);

const actions = (
    <>
        <IconButton aria-label="Settings" title="Settings" icon={<SettingsIcon />} variant="title-bar" />
        <Button aria-label="PG: Open account menu" variant="avatar">
            <Avatar name="Pedro Gomes" />
        </Button>
    </>
);

const meta = {
    title: 'Layout/TitleBar',
    component: TitleBar,
    parameters: { layout: 'fullscreen' },
    args: {
        brand,
        title: (
            <TitleBarTrail
                items={[
                    {
                        key: 'page',
                        icon: <LayoutGridIcon />,
                        label: 'Dashboard',
                        onSelect: fn(),
                        selectLabel: 'Go somewhere else',
                    },
                ]}
            />
        ),
        search: <CommandPaletteTrigger label="Go to…" shortcut="k" onOpen={fn()} />,
        actions,
        secondaryActions,
        secondaryActionsLabel: 'Server status',
    },
    argTypes: {
        brand: { control: false },
        title: { control: false },
        search: { control: false },
        actions: { control: false },
    },
    decorators: [
        (Story) => (
            <div className="glass-bar border-line border-b">
                <Story />
            </div>
        ),
    ],
} satisfies Meta<typeof TitleBar>;

export default meta;

type Story = StoryObj<typeof meta>;

/** Lar Server’s title bar: brand, the page you are on, the palette, the server’s status, Settings and you. */
export const Default: Story = {};

/** In a catalog: the catalog opens its siblings, the album is where you are. Narrow screens keep the last step. */
export const CatalogTrail: Story = {
    args: {
        title: (
            <TitleBarTrail
                items={[
                    {
                        key: 'catalog',
                        icon: <MusicIcon />,
                        label: 'Music',
                        onSelect: fn(),
                        selectLabel: 'Switch catalog',
                    },
                    { key: 'artist', label: 'Miles Davis' },
                    { key: 'album', label: 'Kind of Blue' },
                ]}
            />
        ),
    },
};

/** Only the brand and a plain title, before the app knows where you are. */
export const Minimal: Story = {
    args: {
        title: <TitleBarTrail items={[{ key: 'catalog', label: 'b7c1e2' }]} />,
        search: undefined,
        actions: undefined,
    },
};

/** A location with no alternate destinations is text, with no menu affordance. */
export const NoChoices: Story = {
    args: {
        title: (
            <TitleBarTrail items={[{ key: 'missing', label: 'Page not found', hasChoices: false, onSelect: fn() }]} />
        ),
    },
};

export const EmptyTrail: Story = { args: { title: <TitleBarTrail items={[]} /> } };
export const NarrowLongCatalog: Story = {
    args: {
        title: (
            <TitleBarTrail
                items={[
                    {
                        key: 'catalog',
                        label: 'International documentary films and restored archive editions',
                        onSelect: fn(),
                    },
                ]}
            />
        ),
        secondaryActions: (
            <ToolbarStatusGroup aria-label="Server status">
                <Button variant="summary" aria-label="Server healthy">
                    <ToolbarStatusItem icon={<ServerIcon />} tone="success" />
                </Button>
            </ToolbarStatusGroup>
        ),
        secondaryActionsLabel: 'Server status',
    },
    decorators: [
        (Story) => (
            <div className="w-80">
                <Story />
            </div>
        ),
    ],
};
