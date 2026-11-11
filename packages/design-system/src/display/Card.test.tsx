import { render } from '@testing-library/react';
import { expect, it } from 'vite-plus/test';

import { Card } from './Card';

it("keeps a composition's own data-slot, and marks every card with data-card", () => {
    const { container } = render(
        <>
            <Card label="Music" data-slot="library-card" data-kind="music" />
            <Card label="Plain" />
        </>,
    );
    const [named, plain] = container.querySelectorAll('[data-card]');

    expect(named?.getAttribute('data-slot')).toBe('library-card');
    expect(named?.getAttribute('data-kind')).toBe('music');
    expect(plain?.getAttribute('data-slot')).toBe('card');
});
