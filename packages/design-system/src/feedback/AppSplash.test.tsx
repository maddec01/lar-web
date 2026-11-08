import { render, screen } from '@testing-library/react';
import { expect, it } from 'vite-plus/test';

import { AppSplash, splashStatusText } from './AppSplash';

it('ends every status line in one ellipsis', () => {
    expect(splashStatusText('Finishing up')).toBe('Finishing up…');
    expect(splashStatusText('Connecting to your server…')).toBe('Connecting to your server…');
    expect(splashStatusText('Signing you in...')).toBe('Signing you in…');
    expect(splashStatusText('The server is taking longer than usual. Lar keeps trying.')).toBe(
        'The server is taking longer than usual. Lar keeps trying.',
    );
});

it('shows the indeterminate track while it waits and drops it as it fades out', () => {
    const { rerender } = render(<AppSplash label="Lar Factory" product="Factory" status="Loading projects" drawn />);

    expect(screen.getByRole('status').textContent).toBe('Loading projects…');
    expect(screen.getByRole('progressbar', { name: 'Loading projects…' })).not.toHaveAttribute('aria-valuenow');

    rerender(<AppSplash label="Lar Factory" product="Factory" status="Loading projects" drawn leaving />);

    expect(screen.queryByRole('progressbar')).toBeNull();
});
