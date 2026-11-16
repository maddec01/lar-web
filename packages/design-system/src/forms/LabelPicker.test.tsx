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
