import { fireEvent, render, screen } from '@testing-library/react';
import { useState } from 'react';
import { expect, it } from 'vite-plus/test';

import { SegmentedControl } from './SegmentedControl';

function Forwarding({ initial = 'automatic' }: { initial?: 'automatic' | 'manual' | 'off' }) {
    const [value, setValue] = useState(initial);

    return (
        <SegmentedControl
            aria-label="Router forwarding"
            value={value}
            onValueChange={setValue}
            options={[
                { value: 'automatic', label: 'Automatic' },
                { value: 'manual', label: 'Manual' },
                { value: 'off', label: 'Off', disabled: true },
            ]}
        />
    );
}

it('is a radio group whose chosen choice holds the one tab stop', () => {
    render(<Forwarding />);

    const group = screen.getByRole('radiogroup', { name: 'Router forwarding' });
    const automatic = screen.getByRole('radio', { name: 'Automatic' });
    const manual = screen.getByRole('radio', { name: 'Manual' });

    expect(group).toBeTruthy();
    expect(automatic.getAttribute('aria-checked')).toBe('true');
    expect(manual.getAttribute('aria-checked')).toBe('false');
    expect(automatic.tabIndex).toBe(0);
    expect(manual.tabIndex).toBe(-1);
});

it('chooses with a click and with the arrow keys, skipping a choice that cannot be chosen', () => {
    render(<Forwarding />);

    const automatic = screen.getByRole('radio', { name: 'Automatic' });
    const manual = screen.getByRole('radio', { name: 'Manual' });

    fireEvent.click(manual);
    expect(manual.getAttribute('aria-checked')).toBe('true');

    fireEvent.keyDown(manual, { key: 'ArrowRight' });
    expect(automatic.getAttribute('aria-checked')).toBe('true');
    expect(document.activeElement).toBe(automatic);

    fireEvent.keyDown(automatic, { key: 'ArrowLeft' });
    expect(manual.getAttribute('aria-checked')).toBe('true');
    expect(screen.getByRole('radio', { name: 'Off' }).getAttribute('aria-checked')).toBe('false');
});
