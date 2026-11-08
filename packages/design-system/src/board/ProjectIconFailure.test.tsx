// A failed lazy chunk must not inherit the successful module cache from the other icon tests.
import { act, render } from '@testing-library/react';
import { expect, it, vi } from 'vite-plus/test';

import { ProjectIcon } from './ProjectIcon';

const attempted = vi.hoisted(() => vi.fn());

vi.mock('../icons/dynamic', () => {
    attempted();
    throw new Error('chunk failed');
});

it('keeps the toned initial when the lucide chunk fails, without losing the surrounding content', async () => {
    const { container } = render(
        <ProjectIcon
            name="lar-server"
            size="md"
            place={0}
            icon={{ kind: 'lucide', name: 'git-branch', color: 'sky' }}
        />,
    );

    await vi.waitFor(() => expect(attempted).toHaveBeenCalled());
    await act(async () => {});

    const square = container.querySelector<HTMLElement>('[data-project-icon]')!;

    expect(square.textContent).toBe('L');
    expect(square.className).toContain('repo-tone-0');
    expect(square.querySelector('svg')).toBeNull();
});
