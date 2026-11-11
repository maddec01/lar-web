import type { Meta, StoryObj } from '@storybook/react-vite';
import {
    ActivityIcon,
    CircleDollarSignIcon,
    HeadphonesIcon,
    InboxIcon,
    LayoutGridIcon,
    MusicIcon,
    PlusIcon,
    ServerIcon,
} from 'lucide-react';
import { fn } from 'storybook/test';

import { Button } from '../actions/Button';
import { Avatar } from '../display/Avatar';
import { StatusIndicator } from '../feedback/StatusIndicator';
import { StatusPopoverContent } from '../feedback/StatusPopoverContent';
import { TitleBar, TitleBarLabel, TitleBarTrail } from './TitleBar';
import { CommandPaletteTrigger } from './toolbar/CommandPaletteTrigger';
import { TitleBarSettingsButton } from './toolbar/TitleBarSettingsButton';
import { ToolbarCounter } from './toolbar/ToolbarCounter';
import { ToolbarStatusGroup } from './toolbar/ToolbarStatusGroup';
import { ToolbarStatusItem } from './toolbar/ToolbarStatusItem';

const status = (
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

const identity = (
    <Button aria-label="PG: Open account menu" variant="avatar">
        <Avatar name="Pedro Gomes" />
    </Button>
);

const meta = {
    title: 'Layout/TitleBar',
    component: TitleBar,
    parameters: { layout: 'fullscreen' },
    args: {
        product: 'Server',
        home: { href: '#dashboard', label: 'Lar Server, home', onNavigate: fn() },
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
        search: <CommandPaletteTrigger label="Search" shortcut="k" onOpen={fn()} />,
        status,
        statusLabel: 'Server status',
        settings: <TitleBarSettingsButton label="Settings" description="1 sign-in request" onOpen={fn()} />,
        identity,
    },
    argTypes: {
        home: { control: false },
        title: { control: false },
        search: { control: false },
        status: { control: false },
        actions: { control: false },
        settings: { control: false },
        identity: { control: false },
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

/** Lar Server's title bar: the lockup home, the page you are on, then search · status · Settings · you. */
export const Default: Story = {};

/** In a catalog: the catalog opens its siblings, the album is where you are. The trail keeps to 280px. */
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
                    { key: 'album', label: 'Kind of Blue (Legacy Edition, 50th Anniversary Remaster)' },
                ]}
            />
        ),
    },
};

/** Lar Factory's: no trail; search, the board's counters as status, the app's actions (List, Add item), Settings. */
export const WithCountersAndActions: Story = {
    args: {
        product: 'Factory',
        home: { href: '#board', label: 'Lar Factory, home', onNavigate: fn() },
        title: undefined,
        statusLabel: 'Board status',
        status: (
            <ToolbarStatusGroup role="group" aria-label="Board status">
                <ToolbarCounter
                    icon={<StatusIndicator state="waiting" />}
                    label="Need you"
                    value={6}
                    hint="6 items waiting on your answer"
                >
                    <StatusPopoverContent title="Needs you" count={6} width="wide">
                        <p className="text-fg-muted p-2 text-sm">Six items.</p>
                    </StatusPopoverContent>
                </ToolbarCounter>
                <ToolbarCounter
                    icon={<StatusIndicator state="active" />}
                    label="Building"
                    value={4}
                    track={{ used: 4, limit: 2 }}
                    hint="4 building, automatic limit 2"
                >
                    <StatusPopoverContent title="Building" count={4} width="wide" detail="Automatic limit 2">
                        <p className="text-fg-muted p-2 text-sm">Four builds.</p>
                    </StatusPopoverContent>
                </ToolbarCounter>
                <ToolbarCounter
                    icon={<CircleDollarSignIcon />}
                    label="Spend"
                    value="$198.70"
                    width="figure"
                    fold="wide"
                    hint="Agent cost on open and recent items, an API estimate"
                >
                    <StatusPopoverContent title="Agent spend" width="wide">
                        <p className="text-fg-muted p-2 text-sm">Priced items.</p>
                    </StatusPopoverContent>
                </ToolbarCounter>
            </ToolbarStatusGroup>
        ),
        actions: (
            <>
                <Button variant="quiet" size="sm" leftIcon={<InboxIcon />}>
                    <TitleBarLabel>List</TitleBarLabel>
                </Button>
                <Button size="sm" leftIcon={<PlusIcon />}>
                    <TitleBarLabel>Add item</TitleBarLabel>
                </Button>
            </>
        ),
        identity: undefined,
    },
};

/** Lar Account's: the lockup and Settings-free end, just you. */
export const Minimal: Story = {
    args: {
        product: 'Account',
        home: { href: '#account', label: 'Lar Account, home', onNavigate: fn() },
        title: undefined,
        search: undefined,
        status: undefined,
        settings: undefined,
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

/** A phone: the product's word hides, search folds to its icon, status folds into "…", the rest stays on one row. */
export const Phone: Story = {
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
    },
    decorators: [
        (Story) => (
            <div className="w-[390px]">
                <Story />
            </div>
        ),
    ],
};
