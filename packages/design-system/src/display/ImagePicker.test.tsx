import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vite-plus/test';

import { ImagePickerOption } from './ImagePicker';

describe('ImagePickerOption', () => {
    it('keeps a failed preview selectable because the original image can still be valid', () => {
        const select = vi.fn();

        render(
            <ImagePickerOption
                src="https://images.example/thumbnail.jpg"
                label="Provider image"
                errorLabel="Preview unavailable"
                selected={false}
                onSelect={select}
            />,
        );

        const option = screen.getByRole('button', { name: 'Provider image' });
        const image = option.querySelector('img')!;

        expect(image).toHaveAttribute('loading', 'lazy');
        expect(image).toHaveAttribute('referrerpolicy', 'no-referrer');
        expect(option.querySelector('[data-slot="skeleton"]')).toBeInTheDocument();
        fireEvent.error(image);
        expect(screen.getByRole('img', { name: 'Preview unavailable' })).toBeInTheDocument();
        expect(option).toBeEnabled();
        expect(option.querySelector('[data-slot="skeleton"]')).not.toBeInTheDocument();
        fireEvent.click(option);
        expect(select).toHaveBeenCalledOnce();
    });

    it('retains a landscape option while its authenticated bytes are pending', () => {
        const select = vi.fn();
        const { rerender } = render(
            <ImagePickerOption
                pending
                landscape
                label="Current image"
                errorLabel="Preview unavailable"
                selected
                onSelect={select}
            />,
        );
        const option = screen.getByRole('button', { name: 'Current image' });

        expect(option.querySelector('[data-state="loading"]')).toHaveClass('aspect-video');
        expect(option.querySelector('[data-slot="skeleton"]')).toBeInTheDocument();
        fireEvent.click(option);
        expect(select).toHaveBeenCalledOnce();
        rerender(
            <ImagePickerOption
                src="blob:current"
                landscape
                label="Current image"
                errorLabel="Preview unavailable"
                selected
                disabled
                onSelect={select}
            />,
        );
        expect(option.querySelector('[data-slot="skeleton"]')).toBeInTheDocument();
        fireEvent.load(option.querySelector('img')!);
        expect(option.querySelector('[data-state="ready"]')).toHaveClass('aspect-video');
        expect(option.querySelector('[data-slot="skeleton"]')).not.toBeInTheDocument();
        fireEvent.click(option);
        expect(select).toHaveBeenCalledOnce();
    });
});
