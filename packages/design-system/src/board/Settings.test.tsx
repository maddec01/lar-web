// Settings' parts: the title bar's button, the sidebar's empty search and a call's paths under its result.

import { fireEvent, render, screen } from '@testing-library/react';
import { expect, it, vi } from 'vite-plus/test';

import { FormResult } from '../feedback/FormResult';
import { OpenSettingsButton, SettingsNav } from './Settings';

it('the Settings button is an icon-only App control named by its label that opens Settings', () => {
    const onOpen = vi.fn();

    render(<OpenSettingsButton label="Settings" onOpen={onOpen} />);

    const button = screen.getByRole('button', { name: 'Settings' });

    expect([button.getAttribute('data-kind'), button.hasAttribute('data-icon-only'), button.textContent]).toEqual([
        'control',
        true,
        '',
    ]);
    fireEvent.click(button);
    expect(onOpen).toHaveBeenCalledOnce();
});

it('the sidebar announces a search that keeps no section, and says nothing otherwise', () => {
    const nav = (empty?: string) => (
        <SettingsNav label="Settings sections" search={<input aria-label="Search settings" />} empty={empty}>
            {null}
        </SettingsNav>
    );
    const { rerender } = render(nav());

    expect(screen.getByRole('navigation', { name: 'Settings sections' })).toBeTruthy();
    expect(screen.queryByRole('status')).toBeNull();
    rerender(nav('No settings match.'));
    expect(screen.getByRole('status').textContent).toBe('No settings match.');
});

it("a result lists what its call touched under its text, and nothing while it's empty", () => {
    const result = (text: string) => (
        <FormResult id="result" text={text} list={[<code key="a">~/a</code>, <code key="b">~/b</code>]} />
    );
    const { container, rerender } = render(result('Removed:'));

    expect([...container.querySelectorAll('li')].map((li) => li.textContent)).toEqual(['~/a', '~/b']);
    rerender(result(''));
    expect(container.querySelectorAll('li')).toHaveLength(0);
});
