import type { StatusTone } from '../feedback/StatusIndicator';

/** A small square holding an icon, tinted by tone: T3 Code's 8% tint behind its foreground colour. */
export const toneTileClasses: Record<StatusTone, string> = {
    neutral: 'bg-fill-muted text-fg-muted ring-1 ring-inset ring-line/70',
    success: 'bg-success-surface text-success-fg',
    warning: 'bg-warning-surface text-warning-fg',
    danger: 'bg-danger-surface text-danger-fg',
    info: 'bg-info-surface text-info-fg',
};
