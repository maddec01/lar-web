import { render, screen } from '@testing-library/react';
import { expect, it } from 'vite-plus/test';

import { Input } from '../../forms/Input';
import { SettingsNav } from './SettingsNav';
import { SidebarNavigationItem } from './SidebarNavigationItem';

it("keeps the search outside the sections' scroller, so a phone's sideways row never scrolls it away", () => {
    render(
        <SettingsNav label="Settings" search={<Input aria-label="Search settings" />}>
            <SidebarNavigationItem active>General</SidebarNavigationItem>
        </SettingsNav>,
    );

    const nav = screen.getByRole('navigation', { name: 'Settings' });

    expect(nav).not.toContainElement(screen.getByRole('textbox', { name: 'Search settings' }));
    expect(nav).toContainElement(screen.getByRole('button', { name: 'General' }));
});
