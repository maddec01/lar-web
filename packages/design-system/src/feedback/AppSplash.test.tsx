import { expect, it } from 'vite-plus/test';

import { splashStatusText } from './AppSplash';

it('ends every status line in one ellipsis', () => {
    expect(splashStatusText('Finishing up')).toBe('Finishing up…');
    expect(splashStatusText('Connecting to your server…')).toBe('Connecting to your server…');
    expect(splashStatusText('Signing you in...')).toBe('Signing you in…');
    expect(splashStatusText('The server is taking longer than usual. Lar keeps trying.')).toBe(
        'The server is taking longer than usual. Lar keeps trying.',
    );
});
