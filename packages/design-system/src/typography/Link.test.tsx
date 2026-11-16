// Every link that routes in the app: a plain left click goes through onNavigate; anything the browser should handle
// itself (a modified or middle click, an external link, a click the caller cancelled) is left to the browser.
import { fireEvent, render, screen } from '@testing-library/react';
import type { ComponentType, ReactNode } from 'react';
import { describe, expect, it, vi } from 'vite-plus/test';

import { ButtonLink } from '../actions/ButtonLink';
import { Link, LinkOverlay } from './Link';

type RoutedProps = {
    href: string;
    onNavigate: (href: string) => void;
    children: ReactNode;
};
type Routed = ComponentType<RoutedProps>;

describe.each([
    ['Link', Link],
    ['LinkOverlay', LinkOverlay],
    ['ButtonLink', ButtonLink],
] as [string, Routed][])('%s', (_, Component) => {
    it('routes a plain click through onNavigate instead of loading the page', () => {
        const navigate = vi.fn();
        const event = new MouseEvent('click', { bubbles: true, cancelable: true });

        render(
            <Component href="/catalog" onNavigate={navigate}>
                Catalog
            </Component>,
        );
        fireEvent(screen.getByRole('link'), event);

        expect(navigate).toHaveBeenCalledWith('/catalog');
        expect(event.defaultPrevented).toBe(true);
    });
});

it('leaves a modified click to the browser', () => {
    const navigate = vi.fn();

    render(
        <Link href="/catalog" onNavigate={navigate}>
            Catalog
        </Link>,
    );
    fireEvent(screen.getByRole('link'), new MouseEvent('click', { bubbles: true, cancelable: true, metaKey: true }));

    expect(navigate).not.toHaveBeenCalled();
});

it('a routed link does not also trigger the row it sits in', () => {
    const selectRow = vi.fn();

    render(
        <div onClick={selectRow}>
            <LinkOverlay href="/catalog" onNavigate={() => {}}>
                Catalog
            </LinkOverlay>
        </div>,
    );
    fireEvent.click(screen.getByRole('link'));

    expect(selectRow).not.toHaveBeenCalled();
});
