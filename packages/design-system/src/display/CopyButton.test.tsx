import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vite-plus/test';

import { CopyButton } from './CopyButton';

describe('copy invitation from LAN administration', () => {
    afterEach(() => vi.unstubAllGlobals());

    it('copies over plain HTTP and restores keyboard focus', () => {
        vi.stubGlobal('navigator', {});

        const copy = vi.fn().mockImplementation(() => {
            expect((document.activeElement as HTMLTextAreaElement).value).toBe('lar://join?v=2&t=invite');

            return true;
        });

        Object.defineProperty(document, 'execCommand', { configurable: true, value: copy });
        render(<CopyButton label="Copy invitation" copiedLabel="Copied" value="lar://join?v=2&t=invite" />);

        const button = screen.getByRole('button', { name: 'Copy invitation' });

        button.focus();
        fireEvent.click(button);
        expect(copy).toHaveBeenCalledWith('copy');
        expect(screen.getByRole('button', { name: 'Copied' })).toHaveFocus();
        expect(document.querySelector('textarea')).toBeNull();
        Reflect.deleteProperty(document, 'execCommand');
    });

    it('does not claim success when clipboard permission and fallback both fail', async () => {
        const writeText = vi.fn().mockRejectedValue(new Error('denied'));

        vi.stubGlobal('navigator', { clipboard: { writeText } });
        render(<CopyButton label="Copy invitation" copiedLabel="Copied" value="invitation" />);
        fireEvent.click(screen.getByRole('button', { name: 'Copy invitation' }));
        await waitFor(() => expect(writeText).toHaveBeenCalledWith('invitation'));
        expect(screen.queryByRole('button', { name: 'Copied' })).not.toBeInTheDocument();
    });
});
