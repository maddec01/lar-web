import type { Meta, StoryObj } from '@storybook/react-vite';

import { Input } from '../../forms/Input';
import { SettingsNav } from './SettingsNav';
import { SidebarNavigationItem } from './SidebarNavigationItem';
import { SidebarNavigationGroup } from './SidebarPane';

const meta = {
    title: 'Layout/SettingsNav',
    component: SettingsNav,
    args: {
        label: 'Settings sections',
        search: <Input aria-label="Search settings" placeholder="Search settings" />,
        children: <SidebarNavigationItem active>General</SidebarNavigationItem>,
    },
} satisfies Meta<typeof SettingsNav>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Search: Story = {};
export const NoMatch: Story = { args: { empty: 'Nothing matches', children: null } };
export const WithoutSearch: Story = { args: { search: undefined } };
/** On a phone the sections become a sideways row that scrolls to the active one, far along it here; the search stays
 *  whole above that row, never clipped or scrolled away with it. */
export const PhoneWithLaterSectionActive: Story = {
    globals: { viewport: { value: 'mobile1' } },
    args: {
        children: (
            <>
                <SidebarNavigationGroup label="Server">
                    {['General', 'Catalogs', 'Scans', 'Metadata providers'].map((name) => (
                        <SidebarNavigationItem key={name}>{name}</SidebarNavigationItem>
                    ))}
                </SidebarNavigationGroup>
                <SidebarNavigationGroup label="Access">
                    <SidebarNavigationItem>Users</SidebarNavigationItem>
                    <SidebarNavigationItem active>Remote access</SidebarNavigationItem>
                </SidebarNavigationGroup>
            </>
        ),
    },
};
