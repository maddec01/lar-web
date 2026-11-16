import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vite-plus/test';

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
});
