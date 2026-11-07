import { render, screen } from '@testing-library/react';
import { expect, it } from 'vite-plus/test';

import { Spinner } from './Spinner';

it('keeps its spinner beside its label in its own inline row, spinning unless still', () => {
    const { container, rerender } = render(<Spinner label="Loading Projects…" />);
    const row = container.querySelector('[data-loader]')!;

    expect(row).toHaveClass('inline-flex');
    expect(row.firstElementChild).toHaveClass('motion-safe:animate-spin');
    expect(row).toHaveTextContent('Loading Projects…');

    rerender(<Spinner label="Loading Projects…" still />);
    expect(container.querySelector('[data-loader]')!.firstElementChild).not.toHaveClass('motion-safe:animate-spin');
});

it('with no label, names itself for screen readers by its title', () => {
    render(<Spinner title="Usage totals are still loading." />);
    expect(screen.getByTitle('Usage totals are still loading.')).toHaveTextContent('Usage totals are still loading.');
});
