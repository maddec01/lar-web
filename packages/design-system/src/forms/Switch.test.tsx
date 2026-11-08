import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vite-plus/test';

import { Switch } from './Switch';

function Controlled({ busy, onChange }: { busy: boolean; onChange: (checked: boolean) => void }) {
    const [checked, setChecked] = useState(false);

    return (
        <Switch
            aria-label="Automatic scans"
            checked={checked}
            busy={busy}
            onCheckedChange={(next) => {
                setChecked(next);
                onChange(next);
            }}
        />
    );
}

describe.each([
    [
        'uncontrolled',
        (busy: boolean, onChange: (checked: boolean) => void) => (
            <Switch aria-label="Automatic scans" busy={busy} onCheckedChange={onChange} />
        ),
    ],
    [
        'controlled',
        (busy: boolean, onChange: (checked: boolean) => void) => <Controlled busy={busy} onChange={onChange} />,
    ],
] as const)('a busy %s switch', (_, make) => {
    it('keeps its state and focus, and reads as busy, through clicks, Space and Enter', async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();

        render(make(true, onChange));

        const control = screen.getByRole('switch', { name: 'Automatic scans' });

        expect(control).toHaveAttribute('aria-busy', 'true');
        expect(control).toHaveAttribute('aria-disabled', 'true');
        expect(control).not.toBeDisabled();

        await user.click(control);
        expect(control).toHaveFocus();
        await user.keyboard(' {Enter}');
        expect(control).toHaveAttribute('aria-checked', 'false');
        expect(onChange).not.toHaveBeenCalled();
    });

    it('toggles again once busy clears', async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();
        const { rerender } = render(make(true, onChange));

        rerender(make(false, onChange));

        const control = screen.getByRole('switch', { name: 'Automatic scans' });

        expect(control).not.toHaveAttribute('aria-busy');
        await user.click(control);
        expect(control).toHaveAttribute('aria-checked', 'true');
        expect(onChange).toHaveBeenCalledExactlyOnceWith(true);
    });
});

it('turns from its label too, and not while busy', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const { rerender } = render(<Switch label="Automatic scans" busy onCheckedChange={onChange} />);

    await user.click(screen.getByText('Automatic scans'));
    expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'false');

    rerender(<Switch label="Automatic scans" onCheckedChange={onChange} />);
    await user.click(screen.getByText('Automatic scans'));
    expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'true');
    expect(onChange).toHaveBeenCalledExactlyOnceWith(true);
});
