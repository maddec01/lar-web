// A module boundary test: keep this cache isolated from stories that already loaded the real dynamic icons.
import { act, render } from '@testing-library/react';
import { expect, it, vi } from 'vite-plus/test';

import { ProjectIcon } from './ProjectIcon';

const chunk = vi.hoisted(() => {
    let release!: () => void;
    const ready = new Promise<void>((resolve) => {
        release = resolve;
    });

    return { ready, release: () => release() };
});

vi.mock('../icons/dynamic', async (importOriginal) => {
    await chunk.ready;

    return importOriginal();
});

it('keeps the toned initial and square size while its lucide chunk loads, then overlays the icon', async (context) => {
    context.onTestFinished(chunk.release);

    const { container } = render(
        <ProjectIcon
            name="lar-server"
            size="md"
            place={0}
            icon={{ kind: 'lucide', name: 'git-branch', color: 'sky' }}
        />,
    );
    const square = container.querySelector<HTMLElement>('[data-project-icon]')!;
    const classes = square.className;

    expect(square.textContent).toBe('L');
    expect(square.querySelector('svg')).toBeNull();
    await act(async () => chunk.release());
    await vi.waitFor(() => expect(square.querySelector('svg')).not.toBeNull(), { timeout: 10_000 });
    expect(square.querySelector('svg')!.parentElement!.className).toContain('text-sky-500');
    expect(square.className).toBe(classes);
});
