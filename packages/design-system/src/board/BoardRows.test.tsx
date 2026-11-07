// The behaviour Lar Factory's board rows keep in the design system: which clicks reach a row, and how status and slices
// animate.

import { fireEvent, render, screen } from '@testing-library/react';
import { expect, it, vi } from 'vite-plus/test';

import { ViewToggle } from '../navigation/CollectionViewToggle';
import { DossierChips, DossierLine, DossierNote, DossierTitle, DossierToggle } from './Dossier';
import { SliceBar } from './Slices';
import { RowSide } from './StageRow';
import { StatusGlyph } from './StatusGlyph';

it("a row side with passEmpty keeps its controls' clicks and passes a click on its own space to the row", () => {
    const row = vi.fn();

    render(
        <div onClick={row}>
            <RowSide passEmpty>
                <button type="button">Start</button>
            </RowSide>
        </div>,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Start' }));
    expect(row).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole('button', { name: 'Start' }).parentElement!);
    expect(row).toHaveBeenCalledOnce();
});

it("a dossier line's toggle, title, chips and note keep their clicks from the line", () => {
    const line = vi.fn();
    const toggle = vi.fn();
    const open = vi.fn();

    render(
        <DossierLine item="I_1" picked={false} onClick={line}>
            <DossierToggle open={false} label="Expand #1" onToggle={toggle} />
            <DossierTitle name="#1 A concept" onOpen={open}>
                #1 A concept
            </DossierTitle>
            <DossierChips first={{ words: '2 need you', tone: 'warning' }} more={['1 decision']} />
            <DossierNote>On this Mac</DossierNote>
        </DossierLine>,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Expand #1' }));
    fireEvent.click(screen.getByRole('button', { name: '#1 A concept' }));
    fireEvent.click(screen.getByText('2 need you'));
    fireEvent.click(screen.getByText('On this Mac'));
    expect([toggle.mock.calls.length, open.mock.calls.length, line.mock.calls.length]).toEqual([1, 1, 0]);
    expect(screen.getByText('1 decision')).toHaveClass('sr-only');
});

it('a status glyph spins In progress and pulses the others only while running', () => {
    const { container, rerender } = render(<StatusGlyph status="In progress" running />);

    expect(container.querySelector('.status-spin svg')).not.toBeNull();
    rerender(<StatusGlyph status="Verify" running />);
    expect(container.querySelector('svg.status-pulse.lucide-circle-dot')).not.toBeNull();
    expect(container.querySelector('svg')!.style.color).toBe('var(--st-amber)');
    rerender(<StatusGlyph status="Verify" />);
    expect(container.querySelector('.status-pulse, .status-spin')).toBeNull();
});

it('a slice bar pulses its active slice unless still', () => {
    const slices = [
        { name: '#1', progress: 'done' as const },
        { name: '#2', progress: 'active' as const },
    ];
    const { container, rerender } = render(<SliceBar slices={slices} />);

    expect([...container.querySelectorAll('li')].map((li) => li.classList.contains('status-pulse'))).toEqual([
        false,
        true,
    ]);
    rerender(<SliceBar slices={slices} still />);
    expect(container.querySelector('.status-pulse')).toBeNull();
});

it('a view toggle presses the chosen view and offers the others', () => {
    const change = vi.fn();

    render(
        <ViewToggle
            compact
            value="map"
            onChange={change}
            options={[
                { value: 'map', label: 'Work map', icon: null },
                { value: 'list', label: 'Parts list', icon: null },
            ]}
        />,
    );
    expect(screen.getByRole('button', { name: 'Work map' })).toHaveAttribute('aria-pressed', 'true');
    fireEvent.click(screen.getByRole('button', { name: 'Parts list' }));
    expect(change).toHaveBeenCalledWith('list');
});
