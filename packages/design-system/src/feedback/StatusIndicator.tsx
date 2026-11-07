export type StatusTone = 'neutral' | 'success' | 'warning' | 'danger' | 'info';

interface StatusIndicatorProps {
    className?: string;
    size?: 'sm' | 'md';
    tone: StatusTone;
    /** A colour that comes with data, such as a tracker label's own, in place of the tone's; none keeps the tone. */
    labelColor?: string | undefined;
    /** A short word after the dot in the tone's text colour, such as a check's "Installed"; the neutral tone mutes it,
     *  for a check that didn't run. */
    label?: string;
}

const toneClasses: Record<StatusTone, string> = {
    neutral: 'bg-base-400',
    success: 'bg-success',
    warning: 'bg-warning',
    danger: 'bg-danger',
    info: 'bg-info',
};

const labelClasses: Record<StatusTone, string> = {
    neutral: 'text-base-700',
    success: 'text-(--lar-success-text)',
    warning: 'text-(--lar-warning-text)',
    danger: 'text-(--lar-danger-text)',
    info: 'text-(--lar-info-text)',
};

const sizeClasses: Record<NonNullable<StatusIndicatorProps['size']>, string> = {
    sm: 'size-1.5',
    md: 'size-2',
};

export function StatusIndicator({ className, size = 'md', tone, labelColor, label }: StatusIndicatorProps) {
    const classes = [
        'inline-block shrink-0 rounded-full',
        sizeClasses[size],
        toneClasses[tone],
        label ? null : className,
    ]
        .filter(Boolean)
        .join(' ');
    const dot = (
        <span aria-hidden="true" className={classes} style={labelColor ? { background: labelColor } : undefined} />
    );

    if (label === undefined) return dot;

    return (
        <span
            data-slot="status-indicator"
            className={`inline-flex items-center gap-1.5 text-xs font-medium whitespace-nowrap ${labelClasses[tone]} ${className ?? ''}`}
        >
            {dot}
            {label}
        </span>
    );
}
