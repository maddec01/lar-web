// Add item's parts: the ticket search's field, button and picks, the panel field's label or group, and the pane switch.

import { fireEvent, render, screen } from '@testing-library/react';
import { expect, it, vi } from 'vite-plus/test';

import { ViewToggle } from '../navigation/CollectionViewToggle';
import { PanelField, TicketSearch } from './AddItem';

const search = (props: Partial<Parameters<typeof TicketSearch>[0]> = {}) => (
    <TicketSearch
        id="pick"
        query="seek"
        onQueryChange={() => {}}
        onSearch={() => {}}
        fieldLabel="Search open tickets"
        placeholder="Words from the title, or #12"
        searchLabel="Search"
        tickets={[]}
        listLabel="Open tickets"
        onPick={() => {}}
        result=""
        {...props}
    />
);

it('Enter in the field and the Search button both search, and typing reports the query', () => {
    const onSearch = vi.fn();
    const onQueryChange = vi.fn();

    render(search({ onSearch, onQueryChange }));

    const field = screen.getByRole('searchbox', { name: 'Search open tickets' });

    fireEvent.change(field, { target: { value: '#12' } });
    expect(onQueryChange).toHaveBeenCalledWith('#12');
    fireEvent.keyDown(field, { key: 'a' });
    expect(onSearch).not.toHaveBeenCalled();
    fireEvent.keyDown(field, { key: 'Enter' });
    fireEvent.click(screen.getByRole('button', { name: 'Search' }));
    expect(onSearch).toHaveBeenCalledTimes(2);
});

it('lists the matches as buttons that pick by number, with a note, and none while busy', () => {
    const onPick = vi.fn();
    const tickets = [
        { number: 8, title: 'Seek stalls' },
        { number: 9, title: 'Seek is slow', note: 'Already added' },
    ];
    const { rerender } = render(search({ tickets, onPick }));
    const list = screen.getByRole('list', { name: 'Open tickets' });

    expect([...list.querySelectorAll('[data-ticket]')].map((button) => button.textContent)).toEqual([
        '#8Seek stalls',
        '#9Seek is slowAlready added',
    ]);
    fireEvent.click(screen.getByRole('button', { name: /Seek is slow/ }));
    expect(onPick).toHaveBeenCalledWith(9);
    rerender(search({ tickets, onPick, busy: true, picking: true }));
    expect(screen.getByRole('list', { name: 'Open tickets' }).getAttribute('aria-busy')).toBe('true');
    expect(screen.getByRole<HTMLButtonElement>('button', { name: /Seek stalls/ }).disabled).toBe(true);
});

it('announces its result, and shows no list without matches', () => {
    render(search({ result: 'No open ticket matches.' }));
    expect(screen.queryByRole('list')).toBeNull();
    expect(screen.getByRole('status').textContent).toContain('No open ticket matches.');
});

it('a panel field labels its field, or names its group without one', () => {
    render(
        <>
            <PanelField heading="Kind" htmlFor="kind">
                <input id="kind" />
            </PanelField>
            <PanelField heading="Labels" id="labels">
                <span>docs</span>
            </PanelField>
        </>,
    );
    expect(screen.getByLabelText('Kind').id).toBe('kind');
    expect(screen.getByRole('group', { name: 'Labels' }).id).toBe('labels');
});

it('a text view toggle presses its picked option and passes on its markers', () => {
    const onChange = vi.fn();

    render(
        <ViewToggle
            presentation="text"
            label="Add"
            value="new"
            onChange={onChange}
            options={[
                { value: 'new', label: 'New work', attributes: { 'data-pane': 'new' } },
                { value: 'pick', label: 'Find a ticket', attributes: { 'data-pane': 'pick' } },
            ]}
        />,
    );

    const pick = screen.getByRole('button', { name: 'Find a ticket' });

    expect(screen.getByRole('button', { name: 'New work' }).getAttribute('aria-pressed')).toBe('true');
    expect([pick.getAttribute('aria-pressed'), pick.getAttribute('data-pane')]).toEqual(['false', 'pick']);
    fireEvent.click(pick);
    expect(onChange).toHaveBeenCalledWith('pick');
});
