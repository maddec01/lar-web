import { fireEvent, render, screen } from '@testing-library/react';
import { type ChangeEvent, createRef, useState } from 'react';
import { describe, expect, it, vi } from 'vite-plus/test';

import { Checkbox } from './Checkbox';

describe('Checkbox', () => {
    it('updates the native mixed state and its accessible state together', () => {
        const { rerender } = render(<Checkbox aria-label="Select albums" indeterminate />);
        const input = screen.getByRole('checkbox', { name: 'Select albums' });

        expect(input).toHaveProperty('indeterminate', true);
        expect(input).toHaveAttribute('aria-checked', 'mixed');
        fireEvent.click(input);
        expect(input).toHaveProperty('indeterminate', true);
        expect(input).toHaveAttribute('aria-checked', 'mixed');
        rerender(<Checkbox aria-label="Select albums" indeterminate />);
        expect(input).toHaveProperty('indeterminate', true);
        rerender(<Checkbox aria-label="Select albums" indeterminate={false} />);
        expect(input).toHaveProperty('indeterminate', false);
        expect(input).not.toHaveAttribute('aria-checked', 'mixed');
        rerender(<Checkbox aria-label="Select albums" indeterminate />);
        expect(input).toHaveProperty('indeterminate', true);
        expect(input).toHaveAttribute('aria-checked', 'mixed');
    });

    it('names the input with its label and preserves native form interactions', () => {
        const ref = createRef<HTMLInputElement>();
        const onClick = vi.fn();
        const onChange = vi.fn((event: ChangeEvent<HTMLInputElement>) => {
            expect(event.target).toBe(ref.current);
            expect(event.target.checked).toBe(true);
        });

        const { rerender } = render(
            <>
                <Checkbox
                    ref={ref}
                    label="Keep original files"
                    id="keep-originals"
                    name="keepOriginals"
                    value="yes"
                    data-source="onboarding"
                    aria-describedby="keep-help"
                    onClick={onClick}
                    onChange={onChange}
                />
                <p id="keep-help">Original files stay in the source folder.</p>
            </>,
        );
        const input = screen.getByRole('checkbox', { name: 'Keep original files' });

        expect(ref.current).toBe(input);
        expect(input).toHaveAccessibleDescription('Original files stay in the source folder.');
        expect(input).toHaveAttribute('id', 'keep-originals');
        expect(input).toHaveAttribute('name', 'keepOriginals');
        expect(input).toHaveAttribute('data-source', 'onboarding');
        expect(input).not.toBeChecked();
        fireEvent.click(screen.getByText('Keep original files'));
        expect(input).toBeChecked();
        expect(onClick).toHaveBeenCalledTimes(1);
        expect(onChange).toHaveBeenCalledTimes(1);
        rerender(<Checkbox label="Keep original files" disabled />);
        fireEvent.click(screen.getByText('Keep original files'));
        expect(screen.getByRole('checkbox')).toBeDisabled();
        expect(onChange).toHaveBeenCalledTimes(1);
    });

    it('toggles once through an enclosing rich label and respects disabled state', () => {
        const onChange = vi.fn();

        function Selection({ disabled = false }: { disabled?: boolean }) {
            const [checked, setChecked] = useState(false);

            return (
                <label>
                    <Checkbox
                        checked={checked}
                        disabled={disabled}
                        onChange={(event) => {
                            onChange(event.target.checked);
                            setChecked(event.target.checked);
                        }}
                    />
                    <span>Include artwork</span> <small>Copy cover images alongside the media.</small>
                </label>
            );
        }

        const { rerender } = render(<Selection />);
        const input = screen.getByRole('checkbox', {
            name: 'Include artwork Copy cover images alongside the media.',
        });

        expect(input.closest('label')?.querySelector('label')).toBeNull();
        fireEvent.click(screen.getByText('Include artwork'));
        expect(input).toBeChecked();
        expect(onChange).toHaveBeenCalledExactlyOnceWith(true);
        fireEvent.click(screen.getByText('Copy cover images alongside the media.'));
        expect(input).not.toBeChecked();
        expect(onChange).toHaveBeenNthCalledWith(2, false);
        rerender(<Selection disabled />);
        fireEvent.click(screen.getByText('Include artwork'));
        expect(input).toBeDisabled();
        expect(input).not.toBeChecked();
        expect(onChange).toHaveBeenCalledTimes(2);
    });
});
