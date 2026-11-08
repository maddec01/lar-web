import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vite-plus/test';

import { ButtonLink } from './ButtonLink';

describe.each([false, true])('ButtonLink (compact: %s)', (compact) => {
    it('routes a plain click through onNavigate instead of loading the page', () => {
        const onNavigate = vi.fn();
        const onClick = vi.fn();

        render(
            <ButtonLink href="/settings" size={compact ? 'sm' : 'lg'} onNavigate={onNavigate} onClick={onClick}>
                Settings
            </ButtonLink>,
        );

        const event = fireEvent.click(screen.getByRole('link', { name: 'Settings' }));

        expect(onClick).toHaveBeenCalledOnce();
        expect(onNavigate).toHaveBeenCalledWith('/settings');
        expect(event).toBe(false);
    });

    it.each([{ metaKey: true }, { ctrlKey: true }, { shiftKey: true }, { altKey: true }, { button: 1 }])(
        'leaves a modified or middle click (%o) to the browser',
        (modifiers) => {
            const onNavigate = vi.fn();

            render(
                <ButtonLink href="/settings" size={compact ? 'sm' : 'lg'} onNavigate={onNavigate}>
                    Settings
                </ButtonLink>,
            );

            const event = fireEvent.click(screen.getByRole('link', { name: 'Settings' }), modifiers);

            expect(onNavigate).not.toHaveBeenCalled();
            expect(event).toBe(true);
        },
    );

    it('leaves an external link and a prevented click alone', () => {
        const onNavigate = vi.fn();

        render(
            <>
                <ButtonLink href="https://lar.works" external size={compact ? 'sm' : 'lg'} onNavigate={onNavigate}>
                    Website
                </ButtonLink>
                <ButtonLink
                    href="/help"
                    size={compact ? 'sm' : 'lg'}
                    onNavigate={onNavigate}
                    onClick={(event) => event.preventDefault()}
                >
                    Help
                </ButtonLink>
            </>,
        );

        fireEvent.click(screen.getByRole('link', { name: 'Website' }));
        fireEvent.click(screen.getByRole('link', { name: 'Help' }));

        expect(onNavigate).not.toHaveBeenCalled();
    });
});
