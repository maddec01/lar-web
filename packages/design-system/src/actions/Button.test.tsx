import { render, screen } from '@testing-library/react';
import { PlayIcon } from 'lucide-react';
import { expect, it } from 'vite-plus/test';

import { Button } from './Button';
import { ButtonLink } from './ButtonLink';

it('an icon-only button is square, named by its label, and marks itself', () => {
    render(<Button size="sm" iconOnly leftIcon={<PlayIcon />} aria-label="Start" />);

    const button = screen.getByRole('button', { name: 'Start' });

    expect(button).toHaveAttribute('data-icon-only', '');
    expect(button.classList).toContain('w-7');
    expect(button.classList).toContain('px-0');
});

it("a caller's own data-icon-only mark stays", () => {
    render(<Button size="sm" data-icon-only="large" aria-label="Settings" />);
    expect(screen.getByRole('button', { name: 'Settings' })).toHaveAttribute('data-icon-only', 'large');
});

it('a busy button shows a spinner in its icon’s place and reads busy; busy={false} leaves the state out', () => {
    const { rerender } = render(
        <Button busy leftIcon={<PlayIcon data-testid="play" />}>
            Starting…
        </Button>,
    );

    expect(screen.getByRole('button')).toHaveAttribute('aria-busy', 'true');
    expect(screen.queryByTestId('play')).toBeNull();
    expect(screen.getByRole('button').querySelector('[data-slot="icon"] > .animate-spin > svg')).not.toBeNull();
    rerender(
        <Button busy={false} leftIcon={<PlayIcon data-testid="play" />}>
            Start
        </Button>,
    );
    expect(screen.getByRole('button')).not.toHaveAttribute('aria-busy');
    expect(screen.getByTestId('play')).not.toBeNull();
});

it('a shrinking button truncates its label and keeps its mark', () => {
    render(
        <Button shrinks mark="▾">
            Start after #12
        </Button>,
    );

    const button = screen.getByRole('button');

    expect(button.querySelector('.truncate')?.textContent).toBe('Start after #12');
    expect(button.textContent).toBe('Start after #12 ▾');
    expect(button.classList).toContain('min-w-0');
    expect(button.classList).toContain('shrink');
});

it("a compact link draws the app Button's compact look, its icon in the button's icon slot", () => {
    render(
        <ButtonLink href="#pr" size="sm" variant="secondary" icon={<PlayIcon />} data-kind="open">
            Open PR
        </ButtonLink>,
    );

    const link = screen.getByRole('link', { name: 'Open PR' });

    expect(link).toHaveAttribute('data-slot', 'button');
    expect(link).toHaveAttribute('data-kind', 'open');
    expect(link.classList).toContain('h-7');
    expect(link.querySelector('[data-slot="icon"] > svg')).not.toBeNull();
});
