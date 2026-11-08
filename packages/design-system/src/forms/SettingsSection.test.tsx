import { render, screen } from '@testing-library/react';
import { expect, it } from 'vite-plus/test';

import { Button } from '../actions/Button';
import { SettingsRow } from './SettingsRow';
import { SettingsSection } from './SettingsSection';

it('keeps the known heading and action, hides provisional counts and provides N pending rows', () => {
    const { container, rerender } = render(
        <SettingsSection title="Accounts" count={3} loading skeletonRows={3} action={<Button>Add user</Button>} />,
    );

    expect(screen.getByRole('heading', { name: 'Accounts' })).toBeVisible();
    expect(screen.getByRole('status', { name: 'Accounts' })).toHaveAttribute('role', 'status');
    expect(container.querySelectorAll('.settings-row')).toHaveLength(3);
    expect(screen.queryByRole('button', { name: 'Add user' })).toBeNull();
    expect(container.querySelector('button')?.closest('[inert]')).not.toBeNull();
    expect(container.querySelector('section')).toHaveAttribute('aria-busy', 'true');
    expect(screen.queryByText('3')).toBeNull();

    rerender(
        <SettingsSection title="Accounts" count={3} action={<Button>Add user</Button>}>
            Loaded accounts
        </SettingsSection>,
    );
    expect(container.querySelector('section')).toHaveAttribute('aria-busy', 'false');
    expect(screen.getByRole('button', { name: 'Add user' })).toBeVisible();
    expect(screen.getByText('3')).toBeVisible();
    expect(screen.queryByRole('status')).toBeNull();
});

it('keeps real row content mounted but inert and hidden while loading, then restores its control', () => {
    const { container, rerender } = render(
        <SettingsRow
            loading
            loadingLabel="Loading playback"
            label="Generate audio"
            description="Prepare compatible audio."
        >
            <Button>Configure</Button>
        </SettingsRow>,
    );
    const button = container.querySelector('button');

    expect(screen.getByRole('status', { name: 'Loading playback' })).toHaveAttribute('aria-busy', 'true');
    expect(screen.queryByRole('button', { name: 'Configure' })).toBeNull();
    expect(button?.closest('[inert]')).not.toBeNull();
    rerender(
        <SettingsRow label="Generate audio" description="Prepare compatible audio.">
            <Button>Configure</Button>
        </SettingsRow>,
    );
    expect(screen.getByRole('button', { name: 'Configure' })).toBe(button);
    expect(button?.closest('[inert]')).toBeNull();
});
