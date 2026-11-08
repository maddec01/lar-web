import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vite-plus/test';

import { PasswordField } from './PasswordField';

describe('PasswordField', () => {
    it('shows and hides the password with a named, pressed toggle', () => {
        render(<PasswordField label="Password" showLabel="Show password" hideLabel="Hide password" />);

        const input = screen.getByLabelText('Password', { selector: 'input' });

        expect(input).toHaveAttribute('type', 'password');
        fireEvent.click(screen.getByRole('button', { name: 'Show password' }));
        expect(input).toHaveAttribute('type', 'text');
        expect(screen.getByRole('button', { name: 'Hide password' })).toHaveAttribute('aria-pressed', 'true');
        fireEvent.click(screen.getByRole('button', { name: 'Hide password' }));
        expect(input).toHaveAttribute('type', 'password');
    });

    it('describes the field with its requirement and marks it met', () => {
        const { rerender } = render(
            <PasswordField
                label="Password"
                showLabel="Show password"
                hideLabel="Hide password"
                requirement="At least 12 characters"
            />,
        );

        expect(screen.getByLabelText('Password', { selector: 'input' })).toHaveAccessibleDescription(
            'At least 12 characters',
        );
        rerender(
            <PasswordField
                label="Password"
                showLabel="Show password"
                hideLabel="Hide password"
                requirement="At least 12 characters"
                requirementMet
            />,
        );
        expect(screen.getByText('At least 12 characters')).toHaveAttribute('data-met', 'true');
    });
});
