import { fireEvent, render, screen } from '@testing-library/react';
import { expect, it, vi } from 'vite-plus/test';

import { LabelPicker } from './LabelPicker';

it('uses checkboxes for existing labels and Enter only to create a new name', () => {
    const onToggle = vi.fn();
    const onCreate = vi.fn();

    render(
        <LabelPicker
            choices={[{ name: 'bug' }]}
            picked={[]}
            onToggle={onToggle}
            filterLabel="Filter labels"
            placeholder="Filter labels"
            noMatchLabel="No match."
            create={{ refused: null, problem: () => null, note: '', createLabel: (name) => `Create ${name}`, onCreate }}
        />,
    );

    const filter = screen.getByRole('textbox', { name: 'Filter labels' });

    fireEvent.change(filter, { target: { value: 'bug' } });
    fireEvent.keyDown(filter, { key: 'Enter' });
    expect(onToggle).not.toHaveBeenCalled();
    expect(onCreate).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole('checkbox', { name: 'bug' }));
    expect(onToggle).toHaveBeenCalledWith('bug');
    fireEvent.change(filter, { target: { value: 'new' } });
    fireEvent.keyDown(filter, { key: 'Enter' });
    expect(onCreate).toHaveBeenCalledExactlyOnceWith('new');
    expect(filter).toHaveValue('');
});

it.each([true, false])('blocks creation when busy or refused (busy: %s)', (busy) => {
    const onCreate = vi.fn();

    render(
        <LabelPicker
            choices={[]}
            picked={[]}
            onToggle={vi.fn()}
            filterLabel="Filter labels"
            placeholder="Filter labels"
            noMatchLabel="No match."
            busy={busy}
            create={{
                refused: busy ? null : 'Access denied',
                problem: () => null,
                note: '',
                createLabel: (name) => `Create ${name}`,
                onCreate,
            }}
        />,
    );

    const filter = screen.getByRole('textbox');

    fireEvent.change(filter, { target: { value: 'new' } });

    if (busy) expect(screen.getByRole('button', { name: 'Create new' })).toBeDisabled();
    else expect(screen.queryByRole('button', { name: 'Create new' })).not.toBeInTheDocument();

    fireEvent.keyDown(filter, { key: 'Enter' });
    expect(onCreate).not.toHaveBeenCalled();
});
