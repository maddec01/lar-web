import { render, screen } from '@testing-library/react';
import { expect, it } from 'vite-plus/test';

import { Button } from '../actions/Button';
import { SettingsRow } from './SettingsRow';

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
