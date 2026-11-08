import '../styles.css';

import { render, screen, within } from '@testing-library/react';
import { useState } from 'react';
import { expect, it } from 'vite-plus/test';
import { page, userEvent } from 'vite-plus/test/browser/context';

import type { ThemePreference } from '../foundations/Theme';
import { DropdownMenu } from '../overlays/DropdownMenu';
import { Button } from './Button';
import { ThemeSwitch } from './ThemeSwitch';

function Choice({ menu = false, labelsVisible = false }) {
    const [value, setValue] = useState<ThemePreference>('light');
    const control = (
        <ThemeSwitch
            value={value}
            onChange={setValue}
            placement={menu ? 'menu' : 'inline'}
            labelsVisible={labelsVisible}
        />
    );

    return menu ? (
        <DropdownMenu>
            <DropdownMenu.Trigger asChild>
                <Button>Account</Button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content>
                {control}
                <DropdownMenu.Item>Sign out</DropdownMenu.Item>
            </DropdownMenu.Content>
        </DropdownMenu>
    ) : (
        <>
            <Button>Before</Button>
            {control}
            <Button>After</Button>
        </>
    );
}

it.each([false, true])(
    'tabs once through inline theme choices (visible labels: %s), arrows choose and wrap',
    async (labelsVisible) => {
        render(<Choice labelsVisible={labelsVisible} />);
        screen.getByRole('button', { name: 'Before' }).focus();
        await userEvent.keyboard('{Tab}');

        const group = screen.getByRole('radiogroup');
        const radios = within(group).getAllByRole('radio');

        expect(document.activeElement).toBe(radios[1]);
        expect(radios.filter((radio) => radio.tabIndex === 0)).toHaveLength(1);
        await userEvent.keyboard('{ArrowRight}');
        expect(document.activeElement).toBe(radios[2]);
        expect(radios[2]).toHaveAttribute('aria-checked', 'true');
        await userEvent.keyboard('{ArrowDown}');
        expect(document.activeElement).toBe(radios[0]);
        expect(radios[0]).toHaveAttribute('aria-checked', 'true');
        await userEvent.keyboard('{ArrowLeft}');
        expect(document.activeElement).toBe(radios[2]);
        await userEvent.keyboard('{Home}{End}{ArrowUp}');
        expect(document.activeElement).toBe(radios[1]);
        expect(radios[1]).toHaveAttribute('aria-checked', 'true');
        await userEvent.keyboard('{Tab}');
        expect(document.activeElement).toBe(screen.getByRole('button', { name: 'After' }));
        await userEvent.keyboard('{Shift>}{Tab}{/Shift}');
        expect(document.activeElement).toBe(radios[1]);
    },
);

it('uses the same arrow-to-select model in an account menu and keeps the menu open', async () => {
    render(<Choice menu />);
    await page.getByRole('button', { name: 'Account' }).click();

    const radios = screen.getAllByRole('menuitemradio');

    radios[1]!.focus();
    await userEvent.keyboard('{ArrowRight}');
    expect(document.activeElement).toBe(radios[2]);
    expect(radios[2]).toHaveAttribute('aria-checked', 'true');
    await userEvent.keyboard('{ArrowDown}');
    expect(document.activeElement).toBe(radios[0]);
    expect(radios[0]).toHaveAttribute('aria-checked', 'true');
    await userEvent.keyboard('{End}{ArrowLeft}');
    expect(document.activeElement).toBe(radios[1]);
    expect(radios[1]).toHaveAttribute('aria-checked', 'true');
    expect(screen.getByRole('menu')).toBeVisible();
    await userEvent.keyboard('{Tab}');
    expect(screen.getByRole('menuitem', { name: 'Sign out' })).toHaveFocus();
    await userEvent.keyboard('{Escape}');
    expect(screen.getByRole('button', { name: 'Account' })).toHaveFocus();
});
