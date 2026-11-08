import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vite-plus/test';

import { DateField } from './DateField';
import { formatDateField, formatDateLong, parseDateField } from './DateValue';

describe('date precision and locale', () => {
    it.each(['2024', '2024-02', '2024-02-29', '0099-04-02'])(
        'round-trips %s without inventing precision or timezone shifts',
        (value) => {
            for (const locale of ['en-GB', 'en-US', 'fr-FR', 'pt-PT', 'de-DE']) {
                expect(parseDateField(formatDateField(value, locale), locale)).toBe(value);
            }
        },
    );
    it.each(['2023-02-29', '2024-13', '2024-00-01', '0000', '31/04/2024', '29/02/24', 'some date'])(
        'rejects impossible or ambiguous %s',
        (value) => {
            expect(parseDateField(value, 'en-GB')).toBeUndefined();
        },
    );
    it('accepts ISO, locale order and clearing', () => {
        expect(parseDateField('2/29/2024', 'en-US')).toBe('2024-02-29');
        expect(parseDateField('02/2024', 'en-GB')).toBe('2024-02');
        expect(parseDateField('2024-02-29', 'en-US')).toBe('2024-02-29');
        expect(parseDateField('')).toBe('');
    });
    it('formats the long date pages show, at its precision', () => {
        expect(formatDateLong('2021-01-10', 'en-US')).toBe('January 10, 2021');
        expect(formatDateLong('2021-01', 'en-US')).toBe('January 2021');
        expect(formatDateLong('2021', 'en-US')).toBe('2021');
        expect(formatDateLong('2021-01-10', 'en-GB')).toBe('10 January 2021');
        expect(formatDateLong('not a date', 'en-US')).toBe('not a date');
    });
    it('shows the long date at rest and the numeric text while editing', () => {
        const onValueChange = vi.fn();

        render(<DateField aria-label="Release date" value="2021-01-10" locale="en-US" onValueChange={onValueChange} />);

        const input = screen.getByRole('textbox');

        expect(input).toHaveValue('January 10, 2021');
        fireEvent.focus(input);
        expect(input).toHaveValue('01/10/2021');
        fireEvent.change(input, { target: { value: '01/12/2021' } });
        fireEvent.blur(input);
        expect(onValueChange).toHaveBeenCalledWith('2021-01-12');
    });

    it('selects the numeric text when editing starts, so typing replaces the date', () => {
        render(<DateField aria-label="Release date" value="2021-01-10" locale="en-US" onValueChange={vi.fn()} />);

        const input = screen.getByRole<HTMLInputElement>('textbox');

        fireEvent.focus(input);
        expect([input.selectionStart, input.selectionEnd]).toEqual([0, '01/10/2021'.length]);
    });
    it('only commits valid ISO dates and retains invalid drafts for correction', () => {
        const onValueChange = vi.fn();

        render(<DateField aria-label="Release date" value="2024" locale="en-GB" onValueChange={onValueChange} />);

        const input = screen.getByRole('textbox');

        fireEvent.change(input, { target: { value: '31/02/2024' } });
        fireEvent.blur(input);
        expect(input).toHaveAttribute('aria-invalid', 'true');
        expect(input).toHaveValue('31/02/2024');
        expect(input).toBeInvalid();
        expect(onValueChange).not.toHaveBeenCalled();
        fireEvent.change(input, { target: { value: '29/02/2024' } });
        fireEvent.blur(input);
        expect(onValueChange).toHaveBeenCalledWith('2024-02-29');
        expect(input).toBeValid();
        fireEvent.change(input, { target: { value: '' } });
        fireEvent.blur(input);
        expect(onValueChange).toHaveBeenLastCalledWith('');
    });
    it('reports the draft, its validity and its message to the form', () => {
        const onDraftChange = vi.fn();

        render(
            <DateField
                aria-label="Release date"
                value="2024"
                locale="en-GB"
                onValueChange={() => {}}
                onDraftChange={onDraftChange}
                invalidMessage="Enter a real date."
            />,
        );

        const input = screen.getByRole('textbox');

        expect(onDraftChange).toHaveBeenLastCalledWith({
            text: '2024',
            value: '2024',
            valid: true,
            message: undefined,
        });
        fireEvent.change(input, { target: { value: '31/02/2024' } });
        // Still typing: invalid, but no message yet.
        expect(onDraftChange).toHaveBeenLastCalledWith({
            text: '31/02/2024',
            value: undefined,
            valid: false,
            message: undefined,
        });
        fireEvent.keyDown(input, { key: 'Enter' });
        expect(onDraftChange).toHaveBeenLastCalledWith({
            text: '31/02/2024',
            value: undefined,
            valid: false,
            message: 'Enter a real date.',
        });
        expect(input).toBeInvalid();
        fireEvent.change(input, { target: { value: '28/02/2024' } });
        expect(onDraftChange).toHaveBeenLastCalledWith({
            text: '28/02/2024',
            value: '2024-02-28',
            valid: true,
            message: undefined,
        });
    });
});
