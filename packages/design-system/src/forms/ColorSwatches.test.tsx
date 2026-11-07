// A row of colour swatches: which one is pressed, and what a press picks.

import { fireEvent, render } from '@testing-library/react';
import { expect, it, vi } from 'vite-plus/test';

import { ColorSwatches } from './ColorSwatches';

it('presses the swatch matching the value whatever its case, and a press picks its value', () => {
    const picked = vi.fn();
    const { getByRole } = render(
        <ColorSwatches
            swatches={[
                { value: 'D73A4A', color: '#D73A4A', label: 'Colour #D73A4A' },
                { value: '0E8A16', color: '#0E8A16', label: 'Colour #0E8A16' },
            ]}
            value="d73a4a"
            onPick={picked}
        />,
    );

    expect(getByRole('button', { name: 'Colour #D73A4A' }).getAttribute('aria-pressed')).toBe('true');
    expect(getByRole('button', { name: 'Colour #0E8A16' }).getAttribute('aria-pressed')).toBe('false');
    fireEvent.click(getByRole('button', { name: 'Colour #0E8A16' }));
    expect(picked).toHaveBeenCalledWith('0E8A16');
});
