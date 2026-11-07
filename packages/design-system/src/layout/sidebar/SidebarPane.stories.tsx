import type { Meta, StoryObj } from '@storybook/react-vite';
import {
    GlobeIcon,
    LayoutGridIcon,
    PlayIcon,
    ScanSearchIcon,
    ScrollTextIcon,
    SlidersHorizontalIcon,
    StethoscopeIcon,
    UsersIcon,
} from 'lucide-react';
import { type ReactNode, useState } from 'react';

import { SidebarNavigationItem } from './SidebarNavigationItem';
import { SidebarNavigationGroup, SidebarPane } from './SidebarPane';

interface SettingsSection {
    id: string;
    label: string;
    icon: ReactNode;
    notification?: string;
}

const groups: readonly { label: string; sections: readonly SettingsSection[] }[] = [
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

function SettingsNavigation() {
    const [active, setActive] = useState('catalogs');

    return groups.map((group) => (
        <SidebarNavigationGroup key={group.label} label={group.label}>
            {group.sections.map((section) => (
                <SidebarNavigationItem
                    key={section.id}
                    active={section.id === active}
                    notification={section.notification}
                    onClick={() => setActive(section.id)}
                >
                    {section.icon}
                    <span>{section.label}</span>
                </SidebarNavigationItem>
            ))}
        </SidebarNavigationGroup>
    ));
}

const meta = {
    title: 'Layout/SidebarPane',
    component: SidebarPane,
    parameters: { layout: 'fullscreen' },
    args: { label: 'Settings navigation', children: <SettingsNavigation /> },
    argTypes: { children: { control: false } },
    decorators: [
        (Story) => (
            <div className="h-[560px] md:w-60">
                <Story />
            </div>
        ),
    ],
} satisfies Meta<typeof SidebarPane>;

export default meta;

type Story = StoryObj<typeof meta>;

/** Lar Server's settings sections, grouped. Below the md breakpoint they become one scrolling row. */
export const SettingsSections: Story = {};

/** A single ungrouped list. */
export const Flat: Story = {
    args: {
        label: 'Library',
        children: (
            <>
                <SidebarNavigationItem active>
                    <LayoutGridIcon />
                    <span>All catalogs</span>
                </SidebarNavigationItem>
                <SidebarNavigationItem>
                    <ScanSearchIcon />
                    <span>Integrity</span>
                </SidebarNavigationItem>
            </>
        ),
    },
};
