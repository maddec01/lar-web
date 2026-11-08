import { fireEvent, render, screen } from '@testing-library/react';
import { useState } from 'react';
import { expect, it } from 'vite-plus/test';

import { FormField, FormSection, FormStack, FormUnit } from './FormSection';
import { Input } from './Input';

const row = (name: string) => screen.getByRole('textbox', { name }).closest('[data-form-row]')!;

it('keeps no action column for an empty action, such as an empty fragment', () => {
    render(
        <FormStack>
            <FormField label="Title" action={<></>}>
                <Input />
            </FormField>
            <FormField label="Year" action={<button type="button">Restore</button>}>
                <Input />
            </FormField>
        </FormStack>,
    );

    expect(row('Title').className).not.toContain('_auto]');
    expect(row('Year').className).toContain('_auto]');
});

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
    expect(row('Title').className).toContain('_auto]');
});

it('draws rows flush on a FormStack and padded inside a FormSection panel, labels topping their control', () => {
    render(
        <FormStack>
            <FormField label="Title">
                <Input />
            </FormField>
            <FormSection title="Library">
                <FormField label="Name">
                    <Input />
                </FormField>
            </FormSection>
        </FormStack>,
    );

    expect(row('Title').className).not.toMatch(/\bpx-4\b/);
    expect(row('Name').className).toMatch(/\bpx-4\b/);

    for (const name of ['Title', 'Name']) expect(row(name).className).toContain('sm:items-start');
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
