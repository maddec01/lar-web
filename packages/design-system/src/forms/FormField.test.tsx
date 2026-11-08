import { fireEvent, render, screen } from '@testing-library/react';
import { useState } from 'react';
import { expect, it } from 'vite-plus/test';

import { FormField, FormStack, FormUnit } from './FormSection';
import { Input } from './Input';

it('keeps the control mounted, and focused, while its action comes and goes', () => {
    function Editor() {
        const [value, setValue] = useState('');

        return (
            <FormStack>
                <FormField label="Title" action={value ? <button type="button">Restore</button> : <></>}>
                    <Input value={value} onChange={(event) => setValue(event.target.value)} />
                </FormField>
            </FormStack>
        );
    }

    render(<Editor />);

    const input = screen.getByRole('textbox', { name: 'Title' });

    input.focus();
    fireEvent.change(input, { target: { value: 'T' } });

    expect(screen.getByRole('textbox', { name: 'Title' })).toBe(input);
    expect(input).toHaveFocus();
});

it('wires the label and the error to the field inside a unit', () => {
    render(
        <FormStack>
            <FormField label="Runtime" invalid errorText="Enter minutes as a number.">
                <FormUnit unit="min">
                    <Input defaultValue="two hours" />
                </FormUnit>
            </FormField>
        </FormStack>,
    );

    const input = screen.getByRole('textbox', { name: 'Runtime' });
    const error = screen.getByRole('alert');

    expect(input.getAttribute('aria-invalid')).toBe('true');
    expect(input.getAttribute('aria-describedby')).toBe(error.id);
    expect(screen.getByText('min')).toBeTruthy();
});
