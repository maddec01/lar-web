import { act, fireEvent, render, screen } from '@testing-library/react';
import { type FormEvent, useState } from 'react';
import { expect, it } from 'vite-plus/test';

import { OptionSelect } from './OptionSelect';

it('gives its form an empty value for None, the picked value after a pick, and an input event by then', async () => {
    const heard: (string | null)[] = [];

    function Owner() {
        const [value, setValue] = useState('');

        return (
            <form
                aria-label="Owner"
                onInput={(event: FormEvent<HTMLFormElement>) =>
                    heard.push(new FormData(event.currentTarget).get('who') as string | null)
                }
            >
                <OptionSelect
                    id="who"
                    name="who"
                    label="Who"
                    value={value}
                    onChange={setValue}
                    none="None"
                    options={[{ value: 'a', label: 'Ada' }]}
                />
            </form>
        );
    }

    render(<Owner />);

    const form = screen.getByRole('form', { name: 'Owner' }) as HTMLFormElement;
    const trigger = screen.getByRole('combobox', { name: 'Who' });
    const pick = async (name: string) => {
        await act(async () => fireEvent.keyDown(trigger, { key: 'ArrowDown' }));
        await act(async () =>
            screen
                .getAllByRole('option')
                .find((option) => option.textContent === name)!
                .click(),
        );
    };

    expect(new FormData(form).get('who')).toBe('');
    expect(trigger.textContent).toBe('None');
    await pick('Ada');
    expect(heard).toEqual(['a']);
    expect(trigger.textContent).toBe('Ada');
    await pick('None');
    expect(heard).toEqual(['a', '']);
});

it('leaves a letter on the closed control alone when a pick writes at once', () => {
    render(
        <OptionSelect
            label="Model"
            writesOnPick
            value="a"
            onChange={() => undefined}
            options={[
                { value: 'a', label: 'Ada' },
                { value: 'b', label: 'Babbage' },
            ]}
        />,
    );

    const trigger = screen.getByRole('combobox', { name: 'Model' });

    expect(fireEvent.keyDown(trigger, { key: 'b' })).toBe(false);
    expect(trigger.textContent).toBe('Ada');
});
