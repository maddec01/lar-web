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
    PlusIcon,
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
import { Avatar } from '../display/Avatar';
import { Badge } from '../display/Badge';
import { StatusIndicator, type StatusTone } from '../feedback/StatusIndicator';
import { StatusPopoverContent } from '../feedback/StatusPopoverContent';
import { Heading, Text } from '../typography/Typography';
import { AppShell } from './AppShell';
import { ContentContainer } from './ContentContainer';
import { Grid, InlineBase, StackBase } from './Flow';
import { PageLayout } from './PageLayout';
import { Section } from './Section';
import { SidebarNavigationItem } from './sidebar/SidebarNavigationItem';
import { SidebarNavigationGroup, SidebarPane } from './sidebar/SidebarPane';
import { TitleBar, TitleBarTrail } from './TitleBar';
import { CommandPaletteTrigger } from './toolbar/CommandPaletteTrigger';
import { TitleBarSettingsButton } from './toolbar/TitleBarSettingsButton';
import { ToolbarCounter } from './toolbar/ToolbarCounter';
import { ToolbarStatusGroup } from './toolbar/ToolbarStatusGroup';
import { ToolbarStatusItem } from './toolbar/ToolbarStatusItem';

/** Lar Server’s title bar, as the admin app draws it: the lockup home, where you are, then search · status ·
 *  Settings · the account. */
function ServerTitleBar({ page = 'Dashboard', icon = <LayoutGridIcon /> }: { page?: string; icon?: ReactNode }) {
    return (
        <TitleBar
            product="Server"
            home={{ href: '#dashboard', label: 'Lar Server, home' }}
            title={
                <TitleBarTrail
                    items={[{ key: 'page', icon, label: page, onSelect: () => {}, selectLabel: 'Go somewhere else' }]}
                />
            }
            search={<CommandPaletteTrigger label="Search" shortcut="k" onOpen={() => {}} />}
            statusLabel="Server status"
            status={
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
            }
            settings={<TitleBarSettingsButton label="Settings" description="1 sign-in request" onOpen={() => {}} />}
            identity={
                <Button aria-label="PG: Open account menu" variant="avatar">
                    <Avatar name="Pedro Gomes" />
                </Button>
            }
        />
    );
}

/** Lar Factory’s board title bar: the lockup, search, the board’s counters, its actions and Settings. */
function FactoryTitleBar() {
    return (
        <TitleBar
            product="Factory"
            home={{ href: '#board', label: 'Lar Factory, home' }}
            search={<CommandPaletteTrigger label="Search" shortcut="k" onOpen={() => {}} />}
            statusLabel="Board status"
            status={
                <ToolbarStatusGroup role="group" aria-label="Board status">
                    <ToolbarCounter
                        icon={<StatusIndicator state="waiting" />}
                        label="Need you"
                        value={6}
                        hint="6 items waiting on you"
                    >
                        <StatusPopoverContent title="Needs you" count={6} width="wide">
                            <Text tone="muted">Six items.</Text>
                        </StatusPopoverContent>
                    </ToolbarCounter>
                    <ToolbarCounter
                        icon={<StatusIndicator state="active" />}
                        label="Building"
                        value={3}
                        track={{ used: 3, limit: 4 }}
                        hint="3 building, automatic limit 4"
                    >
                        <StatusPopoverContent title="Building" count={3} width="wide">
                            <Text tone="muted">Three builds.</Text>
                        </StatusPopoverContent>
                    </ToolbarCounter>
                </ToolbarStatusGroup>
            }
            actions={
                <Button size="sm" leftIcon={<PlusIcon />}>
                    <span className="@max-pane:sr-only">Add item</span>
                </Button>
            }
            settings={<TitleBarSettingsButton label="Settings" onOpen={() => {}} />}
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
        <div className="border-line bg-surface-raised flex flex-col gap-3 rounded-lg border p-4">
            <InlineBase align="center" justify="between">
                <InlineBase align="center" className="[&>svg]:text-fg-muted [&>svg]:size-4">
                    {catalog.icon}
                    <Heading as="h3" variant="subsection">
                        {catalog.name}
                    </Heading>
                </InlineBase>
                <Badge tone={catalog.tone}>{catalog.state}</Badge>
            </InlineBase>
            <Text tone="muted">{catalog.items}</Text>
        </div>
    );
}

function DashboardPage() {
    return (
        <PageLayout label="Dashboard">
            <StackBase space="page">
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
                    <div className="border-line bg-surface-raised flex items-center gap-3 rounded-lg border p-4">
                        <StatusIndicator tone="success" />
                        <StackBase space="none" className="min-w-0 flex-1">
                            <Text as="span" variant="label">
                                Kind of Blue — So What
                            </Text>
                            <Text as="span" variant="caption" tone="muted">
                                Ana · iPhone · Direct · FLAC 24/96
                            </Text>
                        </StackBase>
                        <Badge tone="accent">Lossless</Badge>
                    </div>
                </Section>
            </StackBase>
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
                        <StackBase space="related">
                            {['Pedro Gomes · Administrator', 'Ana Ribeiro · Member', 'Tomás Gomes · Member'].map(
                                (person) => (
                                    <div
                                        key={person}
                                        className="border-line bg-surface-raised flex items-center gap-3 rounded-lg border p-3"
                                    >
                                        <Avatar name={person} />
                                        <Text as="span">{person}</Text>
                                    </div>
                                ),
                            )}
                        </StackBase>
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

/** Lar Server’s dashboard: the glass title bar over a page that scrolls under it. */
export const Default: Story = {};

/** The top-level app shell: title bar, a sidebar of sections and the page beside it. */
export const WithSidebar: Story = { render: () => <ShellWithSidebar /> };

/** A desktop window (Lar Factory’s Mac app): the shell fills the window and its main area scrolls under the bar’s
 *  glass; the bar drags the window and starts past the traffic lights. */
export const Desktop: Story = {
    args: {
        scroll: 'contained',
        trafficLights: true,
        header: <FactoryTitleBar />,
        children: (
            <ContentContainer as="main">
                <StackBase space="section" className="pt-4 pb-6">
                    {Array.from({ length: 12 }, (_, lane) => (
                        <Section key={lane} title={`Lane ${lane + 1}`} count={3}>
                            <Grid variant="overview">
                                {catalogs.map((catalog) => (
                                    <CatalogCard key={catalog.name} catalog={catalog} />
                                ))}
                            </Grid>
                        </Section>
                    ))}
                </StackBase>
            </ContentContainer>
        ),
    },
};
