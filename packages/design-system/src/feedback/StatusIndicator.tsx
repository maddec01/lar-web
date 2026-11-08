import type { CSSProperties } from 'react';

import { resolveStatusTone, type StatusColour, statusStateColors } from './StatusState';

export type StatusTone = 'neutral' | 'success' | 'warning' | 'danger' | 'info';

/** A light's tone: a status tone, or the accent for something being worked on, such as "In development". */
export type StatusDotTone = StatusTone | 'accent';

/** Give the light what it means as a `state` (ready, active, waiting, failed, off: the one tone map, see
 *  `StatusState`), or a `tone`: neutral for idle or unknown (no glow), accent for something being worked on, or a
 *  status. */
export type StatusIndicatorProps = StatusColour<StatusDotTone> & {
    /** sm is 6px, for a line of small text or the corner of an icon; md is 8px, for a row's state. */
    size?: 'sm' | 'md';
    /** A colour that comes with data, such as a tracker label's own or a board role's, in place of the tone's; none
     *  keeps the tone. A neutral light in a data colour, such as a label's swatch, doesn't glow. */
    labelColor?: string | undefined;
    /** A short word after the dot in the tone's text colour, such as a check's "Installed"; the neutral tone mutes it,
     *  for a check that didn't run. */
    label?: string;
    /** What the light means, for screen readers only, when nothing beside it says so: colour is never the only
     *  signal. */
    srLabel?: string;
    /** Breathes slowly, for something live or in progress; still when the reader prefers reduced motion. */
    pulse?: boolean;
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
    srLabel,
    pulse = false,
    overlay = false,
    ...colour
}: StatusIndicatorBaseProps) {
    const tone = resolveStatusTone(colour);
    const glows = tone !== 'neutral';
    const dot = (
        <span
            aria-hidden="true"
            data-status-dot={tone}
            className={[
                'inline-block shrink-0 rounded-full bg-(--status-dot)',
                sizeClasses[size],
                // The website's readiness light: the dot in a soft halo of its own colour, and a faint glow (foundations'
                // status-halo). An idle (neutral) light doesn't glow.
                overlay ? (glows ? 'status-halo-overlay' : 'status-cutout') : glows ? 'status-halo' : null,
                pulse ? 'lar-led-pulse' : null,
                label === undefined && srLabel === undefined ? className : null,
            ]
                .filter(Boolean)
                .join(' ')}
            style={{ '--status-dot': labelColor ?? toneColors[tone] } as CSSProperties}
        />
    );

    if (label === undefined && srLabel === undefined) return dot;

    if (label === undefined)
        return (
            <span data-slot="status-indicator" className={`inline-flex ${className ?? ''}`}>
                {dot}
                <span className="sr-only">{srLabel}</span>
            </span>
        );

    return (
        <span
            data-slot="status-indicator"
            className={`inline-flex items-center gap-2 text-xs font-medium whitespace-nowrap ${labelClasses[tone]} ${className ?? ''}`}
        >
            {dot}
            {label}
        </span>
    );
}

/** Lar's status light, the one dot every app draws for a state: a tone's colour with a soft glow, pulsing while live.
 *  The dot itself is hidden from screen readers; a `label` or `srLabel` says what it means. */
export function StatusIndicator(props: StatusIndicatorProps) {
    return <StatusIndicatorBase {...props} />;
}
