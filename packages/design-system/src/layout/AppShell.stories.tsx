import type { Meta, StoryObj } from '@storybook/react-vite';
import {
    ActivityIcon,
    BookOpenIcon,
    FilmIcon,
    GlobeIcon,
    HeadphonesIcon,
    LayoutGridIcon,
    MusicIcon,
    PlayIcon,
    ScanSearchIcon,
    ScrollTextIcon,
    ServerIcon,
    SettingsIcon,
    SlidersHorizontalIcon,
    StethoscopeIcon,
    UsersIcon,
} from 'lucide-react';
import { type ReactNode, useState } from 'react';

import { Button } from '../actions/Button';
import { IconButton } from '../actions/IconButton';
import { Avatar } from '../display/Avatar';
import { Badge } from '../display/Badge';
import { BrandMark } from '../display/BrandMark';
import { StatusIndicator, type StatusTone } from '../feedback/StatusIndicator';
import { Heading, Text } from '../typography/Typography';
import { AppShell } from './AppShell';
import { Grid, Inline, Stack } from './Flow';
import { PageLayout } from './PageLayout';
import { Section } from './Section';
import { SidebarNavigationItem } from './sidebar/SidebarNavigationItem';
import { SidebarNavigationGroup, SidebarPane } from './sidebar/SidebarPane';
import { TitleBar, TitleBarTrail } from './TitleBar';
import { CommandPaletteTrigger } from './toolbar/CommandPaletteTrigger';
import { ToolbarStatusGroup } from './toolbar/ToolbarStatusGroup';
import { ToolbarStatusItem } from './toolbar/ToolbarStatusItem';

/** Lar Server's title bar, as the admin app draws it: the brand, where you are, the palette, the server's
 *  status, Settings and the account. */
function ServerTitleBar({ page = 'Dashboard', icon = <LayoutGridIcon /> }: { page?: string; icon?: ReactNode }) {
    return (
        <TitleBar
            brand={
                <a href="#dashboard" aria-label="Go to home">
                    <BrandMark label="Lar" />
                </a>
            }
            title={
                <TitleBarTrail
                    items={[{ key: 'page', icon, label: page, onSelect: () => {}, selectLabel: 'Go somewhere else' }]}
                />
            }
            search={<CommandPaletteTrigger label="Go to…" shortcut="k" onOpen={() => {}} />}
            actions={
                <>
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
                    <IconButton
                        aria-label="Settings"
                        title="Settings"
                        icon={<SettingsIcon />}
                        notification="1 sign-in request to approve"
                        variant="title-bar"
                    />
                    <Button aria-label="Open account menu" variant="avatar">
                        <Avatar name="Pedro Gomes" />
                    </Button>
                </>
            }
        />
    );
}

const catalogs: readonly { name: string; icon: ReactNode; items: string; tone: StatusTone; state: string }[] = [
    { name: 'Music', icon: <MusicIcon />, items: '2,418 albums · 31,204 tracks', tone: 'success', state: 'Up to date' },
    { name: 'Films', icon: <FilmIcon />, items: '612 films', tone: 'info', state: 'Scanning' },
    { name: 'Series', icon: <PlayIcon />, items: '84 shows · 3,907 episodes', tone: 'success', state: 'Up to date' },
    { name: 'Books', icon: <BookOpenIcon />, items: '1,130 editions', tone: 'warning', state: '4 problems' },
];

function CatalogCard({ catalog }: { catalog: (typeof catalogs)[number] }) {
    return (
        <div className="border-base-300 bg-base-100/60 flex flex-col gap-3 rounded-lg border p-4">
            <Inline align="center" justify="between">
                <Inline align="center" className="[&>svg]:text-base-700 [&>svg]:size-4">
                    {catalog.icon}
                    <Heading as="h3" variant="subsection">
                        {catalog.name}
                    </Heading>
                </Inline>
                <Badge tone={catalog.tone}>{catalog.state}</Badge>
            </Inline>
            <Text tone="muted">{catalog.items}</Text>
        </div>
    );
}

function DashboardPage() {
    return (
        <PageLayout label="Dashboard">
            <Stack space="page">
                <Section
                    title="Media catalogs"
                    count={catalogs.length}
                    actions={<Button variant="secondary">Manage catalogs</Button>}
                >
                    <Grid variant="overview">
                        {catalogs.map((catalog) => (
                            <CatalogCard key={catalog.name} catalog={catalog} />
                        ))}
                    </Grid>
                </Section>
                <Section title="Now playing" count={1} description="Whatever is played on this server shows up here.">
                    <div className="border-base-300 bg-base-100/60 flex items-center gap-3 rounded-lg border p-4">
                        <StatusIndicator tone="success" />
                        <Stack space="none" className="min-w-0 flex-1">
                            <Text as="span" variant="label">
                                Kind of Blue — So What
                            </Text>
                            <Text as="span" variant="caption" tone="muted">
                                Ana · iPhone · Direct · FLAC 24/96
                            </Text>
                        </Stack>
                        <Badge tone="accent">Lossless</Badge>
                    </div>
                </Section>
            </Stack>
        </PageLayout>
    );
}

interface SettingsSection {
    id: string;
    label: string;
    icon: ReactNode;
    notification?: string;
}

const settingsGroups: readonly { label: string; sections: readonly SettingsSection[] }[] = [
    {
        label: 'Server',
        sections: [
            { id: 'general', label: 'General', icon: <SlidersHorizontalIcon /> },
            { id: 'catalogs', label: 'Catalogs', icon: <LayoutGridIcon /> },
            { id: 'scans', label: 'Scans', icon: <ScanSearchIcon /> },
            { id: 'playback', label: 'Playback', icon: <PlayIcon /> },
        ],
    },
    {
        label: 'Access',
        sections: [
            { id: 'users', label: 'Users', icon: <UsersIcon />, notification: '1 sign-in request to approve' },
            { id: 'remote-access', label: 'Remote Access', icon: <GlobeIcon /> },
        ],
    },
    {
        label: 'System',
        sections: [
            { id: 'diagnostics', label: 'Diagnostics', icon: <StethoscopeIcon /> },
            { id: 'logs', label: 'Logs', icon: <ScrollTextIcon /> },
        ],
    },
];

/** The full admin frame: the title bar on top, the settings sections down the side and the open one beside them. */
function ShellWithSidebar() {
    const [active, setActive] = useState('users');
    const section = settingsGroups.flatMap((group) => group.sections).find((item) => item.id === active);

    return (
        <AppShell header={<ServerTitleBar page="Settings" icon={<SettingsIcon />} />}>
            <div className="flex flex-1 flex-col md:flex-row">
                <div className="md:sticky md:top-(--lar-header-height) md:h-[calc(100dvh-var(--lar-header-height))] md:w-60 md:shrink-0">
                    <SidebarPane label="Settings navigation">
                        {settingsGroups.map((group) => (
                            <SidebarNavigationGroup key={group.label} label={group.label}>
                                {group.sections.map((item) => (
                                    <SidebarNavigationItem
                                        key={item.id}
                                        active={item.id === active}
                                        notification={item.notification}
                                        onClick={() => setActive(item.id)}
                                    >
                                        {item.icon}
                                        <span>{item.label}</span>
                                    </SidebarNavigationItem>
                                ))}
                            </SidebarNavigationGroup>
                        ))}
                    </SidebarPane>
                </div>
                <PageLayout
                    label={section?.label}
                    title={section?.label}
                    description="Accounts, invitations, roles, catalog permissions, and active sessions."
                >
                    <Section title="People" count={3} actions={<Button>Invite someone</Button>}>
                        <Stack space="related">
                            {['Pedro Gomes · Administrator', 'Ana Ribeiro · Member', 'Tomás Gomes · Member'].map(
                                (person) => (
                                    <div
                                        key={person}
                                        className="border-base-300 bg-base-100/60 flex items-center gap-3 rounded-lg border p-3"
                                    >
                                        <Avatar name={person} />
                                        <Text as="span">{person}</Text>
                                    </div>
                                ),
                            )}
                        </Stack>
                    </Section>
                </PageLayout>
            </div>
        </AppShell>
    );
}

const meta = {
    title: 'Layout/AppShell',
    component: AppShell,
    parameters: { layout: 'fullscreen' },
    args: { header: <ServerTitleBar />, children: <DashboardPage /> },
    argTypes: { header: { control: false }, children: { control: false } },
} satisfies Meta<typeof AppShell>;

export default meta;

type Story = StoryObj<typeof meta>;

/** Lar Server's dashboard: the glass title bar over a page that scrolls under it. */
export const Default: Story = {};

/** The top-level app shell: title bar, a sidebar of sections and the page beside it. */
export const WithSidebar: Story = { render: () => <ShellWithSidebar /> };
