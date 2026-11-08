import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';

import { Button } from '../actions/Button';
import { DateField, type DateFieldDraft, type DateFieldProps } from './DateField';
import { Field } from './Field';

/** The field contract: the form hears the draft, shows its message under the field and holds Save while it is invalid. */
function DateDemo(args: DateFieldProps) {
    const [value, setValue] = useState(args.value);
    const [draft, setDraft] = useState<DateFieldDraft>();

    return (
        <form className="grid gap-3" onSubmit={(event) => event.preventDefault()}>
            <Field
                label="Release date"
                helperText="Enter a year, month and year, or full date."
                invalid={Boolean(args.invalid || draft?.message)}
                errorText={draft?.message ?? 'Enter a valid date.'}
            >
                <DateField {...args} value={value} onValueChange={setValue} onDraftChange={setDraft} />
            </Field>
            <div>
                <Button type="submit" size="sm" disabled={draft?.valid === false}>
                    Save
                </Button>
            </div>
        </form>
    );
}

/** Types into the field as a reader does, then leaves it. */
function typeAndLeave(canvasElement: HTMLElement, text: string) {
    const input = canvasElement.querySelector('input')!;
    const value = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value');

    input.focus();
    value?.set?.call(input, text);
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.blur();
}

const meta = {
    title: 'Forms/DateField',
    component: DateField,
    args: { value: '2024-02-29', locale: 'en-GB', onValueChange: () => {} },
    render: (args) => (
        <div className="max-w-sm">
            <DateDemo {...args} />
        </div>
    ),
} satisfies Meta<typeof DateField>;

export default meta;
type Story = StoryObj<typeof meta>;
export const FullDate: Story = {};
export const YearOnly: Story = { args: { value: '1997' } };
export const YearMonth: Story = { args: { value: '1997-06' } };
export const AmericanOrder: Story = { args: { locale: 'en-US' } };
export const FrenchOrder: Story = { args: { locale: 'fr-FR' } };
export const Empty: Story = { args: { value: '' } };
export const Invalid: Story = { args: { value: '2024-02-30', invalid: true } };
/** The reader left an impossible date: it stays for correction, its message reads under the field, and Save waits. */
export const InvalidDraft: Story = {
    play: ({ canvasElement }) => typeAndLeave(canvasElement, '31/02/2024'),
};
export const Disabled: Story = { args: { disabled: true } };
