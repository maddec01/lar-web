// A project icon's square: the colour its place gives it, what a chosen icon shows, and the initial a favicon or lucide
// icon falls back to.

import { act, fireEvent, render } from '@testing-library/react';
import { expect, it, vi } from 'vite-plus/test';

import { ProjectIcon } from './ProjectIcon';

const square = (container: HTMLElement) => container.querySelector<HTMLElement>('[data-project-icon]')!;

it("takes its place's colour, repeating after the eighth, and the muted colour for a project the board doesn't list", () => {
    const tone = (place: number | undefined) =>
        [...square(render(<ProjectIcon name="lar-web" place={place} size="row" />).container).classList].find((c) =>
            c.startsWith('repo-tone-'),
        );

    expect(tone(1)).toBe('repo-tone-1');
    expect(tone(9)).toBe('repo-tone-1');
    expect(tone(undefined)).toBe('repo-tone-none');
});

it('shows the initial, an emoji or the first two characters of a monogram, and stays out of the accessibility tree', () => {
    const icon = (props: Partial<Parameters<typeof ProjectIcon>[0]>) =>
        square(render(<ProjectIcon name="lar-web" size="row" {...props} />).container);

    expect(icon({}).textContent).toBe('L');
    expect(icon({}).getAttribute('aria-hidden')).toBe('true');
    expect(icon({ icon: { kind: 'emoji', emoji: '🎛️' } }).textContent).toBe('🎛️');
    expect(icon({ icon: { kind: 'monogram', text: '👩‍💻Web', color: 'rose' } }).textContent).toBe('👩‍💻W');
});

it('keeps the initial under a favicon, which shows once it loads and goes when it fails', () => {
    const { container } = render(
        <ProjectIcon name="lar-web" size="row" place={0} icon={{ kind: 'favicon', src: '/icon.png' }} />,
    );
    const image = () => container.querySelector('img');

    expect(image()!.hidden).toBe(true);
    expect(square(container).textContent).toBe('L');
    fireEvent.load(image()!);
    expect(image()!.hidden).toBe(false);
    fireEvent.error(image()!);
    expect(image()).toBeNull();
    expect(square(container).textContent).toBe('L');
});

it('lays a lucide icon over the initial once its chunk loads', async () => {
    const { container } = render(
        <ProjectIcon name="lar-web" size="row" place={0} icon={{ kind: 'lucide', name: 'git-branch', color: 'sky' }} />,
    );

    expect(square(container).textContent).toBe('L');
    await vi.waitFor(() => expect(container.querySelector('svg')).not.toBeNull(), { timeout: 10_000 });
    await act(async () => {});
    expect(container.querySelector('svg')!.getAttribute('class')).toContain('text-sky-500');
});
