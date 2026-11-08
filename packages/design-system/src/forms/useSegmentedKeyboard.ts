import { type KeyboardEvent, useRef } from 'react';

/** One tab stop; arrows wrap and choose, Home/End choose an edge. Shared by every segmented choice. */
export function useSegmentedKeyboard<V extends string>(values: readonly V[], value: V, onChange: (value: V) => void) {
    const group = useRef<HTMLDivElement>(null);
    const stop = values.includes(value) ? value : values[0];
    const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
        const step = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[event.key];
        const edge = event.key === 'Home' ? 0 : event.key === 'End' ? values.length - 1 : undefined;

        if (step === undefined && edge === undefined) return;

        event.preventDefault();
        // A containing menu must not also move focus to a different entry.
        event.stopPropagation();

        const current = values.indexOf(value);
        const next = values[edge ?? (current + (step ?? 0) + values.length) % values.length];

        if (next === undefined) return;

        onChange(next);
        group.current?.querySelector<HTMLElement>(`[data-value="${CSS.escape(next)}"]`)?.focus();
    };

    return { group, stop, onKeyDown };
}
