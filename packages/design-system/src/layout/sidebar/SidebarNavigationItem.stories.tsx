import type { Meta, StoryObj } from '@storybook/react-vite';
import { GlobeIcon, LayoutGridIcon, SlidersHorizontalIcon, UsersIcon } from 'lucide-react';
import { fn } from 'storybook/test';

import { SidebarNavigationItem } from './SidebarNavigationItem';

const meta = {
    title: 'Layout/SidebarNavigationItem',
    component: SidebarNavigationItem,
    args: {
        onClick: fn(),
        children: (
            <>
                <SlidersHorizontalIcon />
                <span>General</span>
            </>
        ),
    },
    argTypes: { children: { control: false } },
    decorators: [
        (Story) => (
            <div className="flex w-60 flex-col gap-1">
                <Story />
            </div>
        ),
    ],
} satisfies Meta<typeof SidebarNavigationItem>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** The section you are on. */
export const Active: Story = { args: { active: true } };

/** Something in the section needs you, such as a sign-in request to approve. */
export const WithNotification: Story = {
    args: {
        notification: '1 sign-in request to approve',
        children: (
            <>
                <UsersIcon />
                <span>Users</span>
            </>
        ),
    },
};

/** Styles a link, such as a router link, instead of wrapping it in a button. */
export const AsLink: Story = {
    args: {
        asChild: true,
        children: (
            <a href="#remote-access">
                <GlobeIcon />
                <span>Remote Access</span>
            </a>
        ),
    },
};

/** Several items in a column, one of them active. */
export const List: Story = {
    render: () => (
        <>
            <SidebarNavigationItem>
                <SlidersHorizontalIcon />
                <span>General</span>
            </SidebarNavigationItem>
            <SidebarNavigationItem active>
                <LayoutGridIcon />
                <span>Catalogs</span>
            </SidebarNavigationItem>
            <SidebarNavigationItem notification="1 sign-in request to approve">
                <UsersIcon />
                <span>Users</span>
            </SidebarNavigationItem>
            <SidebarNavigationItem>
                <GlobeIcon />
                <span>Remote Access</span>
            </SidebarNavigationItem>
        </>
    ),
};
