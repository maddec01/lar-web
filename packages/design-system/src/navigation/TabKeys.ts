import type { KeyboardEvent } from 'react';

/** Moves a tab row's selection and focus with the left and right arrow keys, wrapping at either end. */
export function moveTabSelection<T extends string>(
    event: KeyboardEvent<HTMLElement>,
    values: readonly T[],
    value: T,
    onChange: (value: T) => void,
) {
    const step = event.key === 'ArrowRight' ? 1 : event.key === 'ArrowLeft' ? -1 : 0;

    if (step === 0 || values.length === 0) return;

    event.preventDefault();

    const index = values.indexOf(value);
    const next = values[(index + step + values.length) % values.length]!;

    onChange(next);
    event.currentTarget.querySelector<HTMLButtonElement>(`[data-value="${next}"]`)?.focus();
}
