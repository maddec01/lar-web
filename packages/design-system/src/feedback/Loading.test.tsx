import { render, screen } from '@testing-library/react';
import { expect, it } from 'vite-plus/test';

import { Loading } from './Loading';

it('keeps its spinner beside its label in its own inline row, spinning unless still', () => {
    const { container, rerender } = render(<Loading presentation="inline" label="Loading Projects…" />);
    const row = container.querySelector('[data-loader]')!;

    expect(row).toHaveClass('inline-flex');
    expect(row.firstElementChild).toHaveClass('motion-safe:animate-spin');
    expect(row).toHaveTextContent('Loading Projects…');

    rerender(<Loading presentation="inline" label="Loading Projects…" still />);
    expect(container.querySelector('[data-loader]')!.firstElementChild).not.toHaveClass('motion-safe:animate-spin');
});

it('with no label, names itself for screen readers by its title', () => {
    render(<Loading presentation="inline" title="Usage totals are still loading." />);
    expect(screen.getByTitle('Usage totals are still loading.')).toHaveTextContent('Usage totals are still loading.');
});

it("without a presentation is ninna-ui's spinner, its label for screen readers only", () => {
    render(<Loading label="Loading tasks" />);
    expect(screen.getByRole('status', { name: 'Loading tasks' })).toHaveAttribute('data-slot', 'loading');
});
