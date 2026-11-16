import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PlayIcon } from 'lucide-react';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vite-plus/test';

import { Button } from './Button';
import { ButtonLink } from './ButtonLink';
import { IconButton } from './IconButton';

function Action({ kind, action }: { kind: 'button' | 'link' | 'icon'; action: () => void }) {
    const [busy, setBusy] = useState(false);
    const start = () => {
        action();
        setBusy(true);
    };

    if (kind === 'link')
        return (
            <ButtonLink href="#next" busy={busy} onNavigate={start}>
                Retry
            </ButtonLink>
        );

    if (kind === 'icon') return <IconButton aria-label="Retry" icon={<PlayIcon />} busy={busy} onClick={start} />;

    return (
        <Button busy={busy} onClick={start}>
            Retry
        </Button>
    );
}

describe.each(['button', 'link', 'icon'] as const)('%s busy activation', (kind) => {
    it('starts once, keeps focus, and ignores repeated clicks and Enter/Space while busy', async () => {
        const user = userEvent.setup();
        const action = vi.fn();

        render(<Action kind={kind} action={action} />);

        const control = screen.getByRole(kind === 'link' ? 'link' : 'button', { name: 'Retry' });

        await user.click(control);
        expect(action).toHaveBeenCalledOnce();
        expect(control).toHaveFocus();
        expect(control).toHaveAttribute('aria-busy', 'true');
        expect(control).toHaveAttribute('aria-disabled', 'true');
        expect(control).not.toHaveAttribute('disabled');
        await user.dblClick(control);
        await user.keyboard('{Enter}{Enter}  ');
        expect(control).toHaveFocus();
        expect(action).toHaveBeenCalledOnce();
    });
});
