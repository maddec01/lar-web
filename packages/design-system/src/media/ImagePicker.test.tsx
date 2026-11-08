import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vite-plus/test';

import { TooltipProvider } from '../overlays/Tooltip';
import { ImagePickerOption } from './ImagePicker';

function renderPicker(element: Parameters<typeof render>[0]) {
    return render(element, { wrapper: TooltipProvider });
}

describe('ImagePickerOption', () => {
    it('marks the chosen image in its caption, never over the artwork', () => {
        renderPicker(
            <ImagePickerOption
                src="https://images.example/logo.png"
                aspect="logo"
                label="Title logo"
                errorLabel="Preview unavailable"
                selected
                onSelect={() => {}}
            />,
        );

        const option = screen.getByRole('button', { name: 'Title logo' });
        const mark = option.querySelector('[data-slot="selection-mark"]')!;

        expect(mark).toBeInTheDocument();
        expect(mark.closest('.absolute')).toBeNull();
        expect(option.querySelector('img')!.parentElement).not.toContainElement(mark as HTMLElement);
        expect(mark.parentElement).toHaveTextContent('Title logo');
    });

    it('keeps a failed preview selectable because the original image can still be valid', () => {
        const select = vi.fn();

        renderPicker(
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
        const { rerender } = renderPicker(
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

it('keeps release year separate from the full candidate title and uses the content kind', () => {
    renderPicker(
        <ImagePickerOption
            label="The Lantern Keeper: Tales from the Northern Coast"
            year={2024}
            kind="movie"
            errorLabel="Preview unavailable"
            selected={false}
            onSelect={() => undefined}
        />,
    );

    const option = screen.getByRole('button', { name: /The Lantern Keeper/ });

    expect(option).toHaveAttribute('title', 'The Lantern Keeper: Tales from the Northern Coast');
    expect(screen.getByText('2024')).toBeInTheDocument();
    expect(option.querySelector('.lucide-film')).toBeInTheDocument();
});
