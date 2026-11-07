import { render, screen } from '@testing-library/react';
import { expect, it } from 'vite-plus/test';

import { RadioGroup, RadioGroupItem } from './RadioGroup';

it('names and describes the actual group and updates its accessible relationships', () => {
    const choices = <RadioGroupItem value="copy" label="Copy media" />;
    const { rerender } = render(
        <>
            <p id="import-help">Choose how to import your media.</p>
            <RadioGroup aria-label="Import mode" aria-describedby="import-help">
                {choices}
            </RadioGroup>
        </>,
    );

    expect(screen.getByRole('radiogroup', { name: 'Import mode' })).toHaveAccessibleDescription(
        'Choose how to import your media.',
    );

    rerender(
        <>
            <p id="import-label">Source mode</p>
            <RadioGroup aria-labelledby="import-label">{choices}</RadioGroup>
        </>,
    );
    expect(screen.getByRole('radiogroup', { name: 'Source mode' })).not.toHaveAccessibleDescription();
    rerender(<RadioGroup aria-label="Import mode">{choices}</RadioGroup>);
    expect(screen.getByRole('radiogroup', { name: 'Import mode' })).not.toHaveAttribute('aria-labelledby');
});
