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

    it('shows progress and ties copy feedback to the link that was copied', async () => {
        let finishCopying!: () => void;
        const writeText = vi.fn().mockImplementation(
            () =>
                new Promise<void>((resolve) => {
                    finishCopying = resolve;
                }),
        );

        vi.stubGlobal('navigator', { clipboard: { writeText } });

        const { rerender } = render(<CopyButton label="Copy invitation" copiedLabel="Copied" value="invitation" />);

        const button = screen.getByRole('button', { name: 'Copy invitation' });

        fireEvent.click(button);
        expect(button).toHaveAttribute('aria-busy', 'true');
        expect(button).toBeDisabled();
        fireEvent.click(button);
        expect(writeText).toHaveBeenCalledTimes(1);
        rerender(<CopyButton label="Copy invitation" copiedLabel="Copied" value="updated-invitation" />);
        finishCopying();
        await waitFor(() => expect(button).toBeEnabled());
        expect(screen.queryByRole('button', { name: 'Copied' })).not.toBeInTheDocument();
        fireEvent.click(button);
        expect(writeText).toHaveBeenLastCalledWith('updated-invitation');
        finishCopying();
        expect(await screen.findByRole('button', { name: 'Copied' })).toBeEnabled();
        expect(button).not.toHaveAttribute('aria-busy', 'true');
    });

    it('as text, says Copy, then Copied, keeps its name, and reports each copy', async () => {
        const writeText = vi.fn().mockResolvedValue(undefined);
        const onCopied = vi.fn();

        vi.stubGlobal('navigator', { clipboard: { writeText } });
        render(
            <CopyButton
                presentation="text"
                label="Copy pnpm test"
                copyText="Copy"
                copiedLabel="Copied"
                value="pnpm test"
                onCopied={onCopied}
            />,
        );

        const button = screen.getByRole('button', { name: 'Copy pnpm test' });

        expect(button).toHaveTextContent('Copy');
        fireEvent.click(button);
        await waitFor(() => expect(button).toHaveTextContent('Copied'));
        expect(writeText).toHaveBeenCalledWith('pnpm test');
        expect(onCopied).toHaveBeenCalledOnce();
        expect(button).toHaveAccessibleName('Copy pnpm test');
    });
});
