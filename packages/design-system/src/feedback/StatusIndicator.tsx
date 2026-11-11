import { LoaderCircleIcon } from 'lucide-react';
import type { CSSProperties, ReactNode } from 'react';

import { ambientMotion } from '../foundations/AmbientMotion';
import { resolveStatusTone, type StatusColour, statusStateColors } from './StatusState';

export type StatusTone = 'neutral' | 'success' | 'warning' | 'danger' | 'info';

/** A light's tone: a status tone, or the accent for something being worked on, such as "In development". */
export type StatusDotTone = StatusTone | 'accent';

/** Give the light what it means as a `state` (ready, active, waiting, failed, off: the one tone map, see
 *  `StatusState`), or a `tone`: neutral for idle or unknown (no glow), accent for something being worked on, or a
 *  status. */
export type StatusIndicatorProps = StatusColour<StatusDotTone> & {
    /** `md` (the default) is the 8px dot with its 3px halo, for every row, card and line of text; `sm` is 6px, only
     *  inside a 20px chip (a Badge) or over an icon's corner. A glyph takes a 16px box at `md`, 14px at `sm`. */
    size?: 'sm' | 'md';
    /** A colour that comes with data, such as a tracker label's own or an app role's, in place of the tone's; none
     *  keeps the tone. A neutral light in a data colour, such as a label's swatch, doesn't glow. */
    labelColor?: string | undefined;
    /** A short word after the mark in neutral text, such as a check's "Installed"; the neutral tone mutes it, for a
     *  check that didn't run. It truncates in a narrow slot, unless `wrap`. */
    label?: string;
    /** Lets the label wrap instead of truncating, the mark centred on its first line: for a state that is the line's
     *  whole message, such as a date a method starts working. */
    wrap?: boolean;
    /** What the light means, for screen readers only, when nothing beside it says so: colour is never the only
     *  signal. */
    srLabel?: string;
    /** Breathes slowly, for something live; still when the reader prefers reduced motion. */
    pulse?: boolean;
    /** A status glyph (a lucide icon, such as a stage's) in place of the dot, drawn in the state's colour in a fixed
     *  box, so a list's titles start at the same x whichever mark each row has. */
    glyph?: ReactNode;
    /** The mark at work: `spin` turns it (working; with no `glyph`, a spinner), `pulse` breathes it (waiting on
     *  something that runs, such as a review). On the motion tokens, paused out of view, still for reduced motion. */
    motion?: 'spin' | 'pulse';
    /** Over the corner of an icon: cut out of the surface beneath by a ring of the page colour, with the glow but
     *  without the halo, which would cover the icon. */
    overlay?: boolean;
};

const toneColors: Record<StatusDotTone, string> = {
    neutral: statusStateColors.off,
    accent: 'var(--color-primary-fg)',
    success: statusStateColors.ready,
    warning: statusStateColors.waiting,
    danger: statusStateColors.failed,
    info: statusStateColors.active,
};

/** A status word is neutral text beside its coloured dot, in every app: the dot carries the tone, so a row of states
 *  reads as words, not as a row of coloured labels. An off (neutral) state's word is muted. */
const labelClasses: Record<StatusDotTone, string> = {
    neutral: 'text-fg-muted',
    accent: 'text-fg',
    success: 'text-fg',
    warning: 'text-fg',
    danger: 'text-fg',
    info: 'text-fg',
};

const sizeClasses: Record<NonNullable<StatusIndicatorProps['size']>, string> = {
    sm: 'size-1.5',
    md: 'size-2',
};

/** A glyph's fixed box and the glyph in it. */
const glyphBoxes: Record<NonNullable<StatusIndicatorProps['size']>, string> = {
    sm: 'size-3.5 [&_svg]:size-3',
    md: 'size-4 [&_svg]:size-3.5',
};

const motions = { spin: 'lar-status-spin', pulse: 'lar-status-pulse' } as const;

type StatusIndicatorBaseProps = StatusIndicatorProps & {
    /** Places the light in a composition, such as an icon's corner. */
    className?: string;
};

/** The status light for the design system's own compositions, which may place it with a class. */
export function StatusIndicatorBase({
    className,
    size = 'md',
    labelColor,
    label,
    wrap = false,
    srLabel,
    pulse = false,
    glyph,
    motion,
    overlay = false,
    ...colour
}: StatusIndicatorBaseProps) {
    const tone = resolveStatusTone(colour);
    const glows = tone !== 'neutral';
    const colourStyle = { '--status-dot': labelColor ?? toneColors[tone] } as CSSProperties;
    const bare = label === undefined && srLabel === undefined;
    // A working mark with no glyph of its own is the spinner.
    const icon = glyph ?? (motion === 'spin' ? <LoaderCircleIcon strokeWidth={2.25} /> : undefined);
    const mark = icon ? (
        <span
            aria-hidden="true"
            data-status-glyph={tone}
            className={`inline-grid shrink-0 place-items-center text-(--status-dot) ${glyphBoxes[size]} ${bare ? (className ?? '') : ''}`}
            style={colourStyle}
        >
            <span
                ref={motion ? ambientMotion : undefined}
                className={`flex [&_svg]:shrink-0 ${motion ? motions[motion] : ''}`}
            >
                {icon}
            </span>
        </span>
    ) : (
        <span
            aria-hidden="true"
            data-status-dot={tone}
            className={[
                'inline-block shrink-0 rounded-full bg-(--status-dot)',
                sizeClasses[size],
                // The dot in a soft 3px halo of its own colour and a faint glow (foundations' status-halo). An idle
                // (neutral) light doesn't glow.
                overlay ? (glows ? 'status-halo-overlay' : 'status-cutout') : glows ? 'status-halo' : null,
                motion ? motions[motion] : pulse ? 'lar-led-pulse' : null,
                bare ? className : null,
            ]
                .filter(Boolean)
                .join(' ')}
            ref={motion ? ambientMotion : undefined}
            style={colourStyle}
        />
    );

    if (bare) return mark;

    if (label === undefined)
        return (
            <span data-slot="status-indicator" className={`inline-flex ${className ?? ''}`}>
                {mark}
                <span className="sr-only">{srLabel}</span>
            </span>
        );

    return (
        <span
            data-slot="status-indicator"
            className={`inline-flex max-w-full min-w-0 ${wrap ? 'items-start' : 'items-center'} text-xs font-medium ${icon ? 'gap-1.5' : 'gap-2'} ${labelClasses[tone]} ${className ?? ''}`}
        >
            {wrap ? <span className="flex h-4 shrink-0 items-center">{mark}</span> : mark}
            <span className={wrap ? 'min-w-0 leading-4 wrap-anywhere' : 'min-w-0 truncate'}>{label}</span>
        </span>
    );
}

/** Lar's status light, the one mark every app draws for a state: a tone's colour with a soft glow, pulsing while live,
 *  or a status glyph in that colour, turning while it works. The mark itself is hidden from screen readers; a `label`
 *  or `srLabel` says what it means. */
export function StatusIndicator(props: StatusIndicatorProps) {
    return <StatusIndicatorBase {...props} />;
}
