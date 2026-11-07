import { fireEvent, render, screen } from '@testing-library/react';
import { expect, it, vi } from 'vite-plus/test';

import { DrilldownBrowseSelector } from './DrilldownBrowseSelector';

it('opens the searchable drilldown and returns to its menu', async () => {
    const onChange = vi.fn();

    renderSelector(onChange, vi.fn());
    fireEvent.click(screen.getByRole('button', { name: 'All' }));

    expect(await screen.findByRole('menuitemradio', { name: 'All' })).toHaveAttribute('aria-checked', 'true');
    expect(screen.getByRole('menuitemradio', { name: 'Unmatched' })).toHaveAttribute('aria-disabled', 'true');
    expect(screen.getByRole('menuitem', { name: 'Genres' })).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: 'Record labels' })).toBeInTheDocument();
    expect(screen.queryByRole('searchbox', { name: 'Search genres' })).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('menuitem', { name: 'Genres' }));

    expect(screen.getByRole('listbox', { name: 'Genres' })).toBeInTheDocument();
    expect(screen.getByRole('searchbox', { name: 'Search genres' })).toHaveFocus();

    fireEvent.click(screen.getByRole('button', { name: 'Back' }));

    expect(screen.getByRole('menuitem', { name: 'Genres' })).toBeInTheDocument();
    expect(screen.queryByRole('searchbox', { name: 'Search genres' })).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('menuitem', { name: 'Record labels' }));
    expect(screen.getByRole('searchbox', { name: 'Search record labels' })).toHaveFocus();
    expect(screen.queryByRole('searchbox', { name: 'Search genres' })).not.toBeInTheDocument();
});

it('filters accents and selects a genre from the drilldown', async () => {
    const onChange = vi.fn();

    renderSelector(onChange, vi.fn());
    fireEvent.click(screen.getByRole('button', { name: 'All' }));
    fireEvent.click(await screen.findByRole('menuitem', { name: 'Genres' }));

    const search = screen.getByRole('searchbox', { name: 'Search genres' });

    fireEvent.change(search, { target: { value: 'metal' } });
    expect(screen.getByText('No genres found')).toBeInTheDocument();

    fireEvent.change(search, { target: { value: 'baio' } });

    expect(screen.getByRole('option', { name: 'Baïonarena' })).toBeInTheDocument();
    expect(screen.queryByRole('option', { name: 'Ambient' })).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('option', { name: 'Baïonarena' }));

    expect(onChange).toHaveBeenCalledWith('baionarena');
    expect(screen.queryByRole('searchbox', { name: 'Search genres' })).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'All' }));
    expect(await screen.findByRole('menuitem', { name: 'Genres' })).toBeInTheDocument();
});

it('clears the one selected filter from the shared menu', async () => {
    const onClear = vi.fn();

    renderSelector(vi.fn(), onClear);
    fireEvent.click(screen.getByRole('button', { name: 'All' }));
    fireEvent.click(await screen.findByRole('menuitemradio', { name: 'All' }));

    expect(onClear).toHaveBeenCalledOnce();
});

it('lists a short group without a search and clears it alone', async () => {
    const onChange = vi.fn();

    renderSelector(vi.fn(), vi.fn(), { selectedId: 'live', onChange });
    fireEvent.click(screen.getByRole('button', { name: 'All' }));
    fireEvent.click(await screen.findByRole('menuitem', { name: 'Types Live albums' }));

    expect(screen.queryByRole('searchbox')).not.toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Live albums' })).toHaveAttribute('aria-selected', 'true');

    fireEvent.click(screen.getByRole('option', { name: 'All types' }));

    expect(onChange).toHaveBeenCalledWith(undefined);
});

function renderSelector(
    onChange: (itemId: string | undefined) => void,
    onClear: () => void,
    types: { selectedId?: string; onChange: (itemId: string | undefined) => void } = { onChange: vi.fn() },
) {
    render(
        <DrilldownBrowseSelector
            allLabel="All"
            backLabel="Back"
            disabledOptionLabel="Unmatched"
            groups={[
                {
                    id: 'genres',
                    label: 'Genres',
                    allLabel: 'All genres',
                    items: [
                        { id: 'ambient', label: 'Ambient' },
                        { id: 'baionarena', label: 'Baïonarena' },
                        { id: 'jazz', label: 'Jazz' },
                    ],
                    loading: false,
                    loadingLabel: 'Loading genres',
                    noResultsLabel: 'No genres found',
                    searchLabel: 'Search genres',
                    onChange,
                },
                {
                    id: 'recordLabels',
                    label: 'Record labels',
                    allLabel: 'All record labels',
                    items: [{ id: 'blue-note', label: 'Blue Note' }],
                    loading: false,
                    loadingLabel: 'Loading record labels',
                    noResultsLabel: 'No record labels found',
                    searchLabel: 'Search record labels',
                    onChange,
                },
                {
                    id: 'types',
                    label: 'Types',
                    allLabel: 'All types',
                    items: [
                        { id: 'albums', label: 'Albums' },
                        { id: 'live', label: 'Live albums' },
                    ],
                    loading: false,
                    loadingLabel: 'Loading types',
                    noResultsLabel: 'No types found',
                    ...types,
                },
            ]}
            label="All"
            onClear={onClear}
        />,
    );
}
