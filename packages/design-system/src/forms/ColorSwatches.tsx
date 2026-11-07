import type { ReactNode } from 'react';

export interface ColorSwatch {
    /** What picking it sets, such as a hex colour without its #. */
    value: string;
    /** The CSS colour it shows. */
    color: string;
    /** Its accessible name, such as "Colour #D73A4A". */
    label: string;
}

/**
 * A row of round colour swatches, the one matching `value` (ignoring case) pressed and ringed, then `children`, such as
 * a field for any other colour, wrapping when they don't fit.
 */
export function ColorSwatches({
    swatches,
    value,
    disabled = false,
    onPick,
    children,
}: {
    swatches: readonly ColorSwatch[];
    value: string;
    disabled?: boolean;
    onPick: (value: string) => void;
    children?: ReactNode;
}) {
    return (
        <span className="flex flex-wrap items-center gap-1.5">
            {swatches.map((swatch) => {
                const picked = swatch.value.toLowerCase() === value.toLowerCase();

                return (
                    <button
                        key={swatch.value}
                        type="button"
                        aria-label={swatch.label}
                        aria-pressed={picked}
                        disabled={disabled}
                        className={`size-5 rounded-full border ${picked ? 'ring-2 ring-(--primary) ring-offset-1 ring-offset-(--card)' : ''}`}
                        style={{ background: swatch.color }}
                        onClick={() => onPick(swatch.value)}
                    />
                );
            })}
            {children}
        </span>
    );
}
