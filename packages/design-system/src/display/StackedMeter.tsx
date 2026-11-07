import { Text } from '../typography/Typography';

export type MeterTone = 'primary' | 'info' | 'success' | 'warning';

const toneClasses: Record<MeterTone, string> = {
    primary: 'bg-primary',
    info: 'bg-info',
    success: 'bg-success',
    warning: 'bg-warning',
};

export interface MeterSegment {
    id: string;
    /** Shown on hover, for example "Playback 50%". */
    label: string;
    tone: MeterTone;
    /** The share of the whole meter, from 0 to 1. */
    value: number;
}

interface StackedMeterProps {
    /** Summarizes the meter for assistive technology. */
    label: string;
    /** A dashed line at a share of the whole, for example a limit. */
    marker?: { label: string; value: number };
    segments: readonly MeterSegment[];
}

/** One bar split into toned segments, with an optional dashed marker. */
export function StackedMeter({ label, marker, segments }: StackedMeterProps) {
    return (
        <div
            role="img"
            aria-label={label}
            className="bg-base-200 relative flex h-4 w-full overflow-hidden rounded-full"
        >
            {segments
                .filter((segment) => segment.value > 0)
                .map((segment) => (
                    <span
                        key={segment.id}
                        title={segment.label}
                        className={`border-base-50 h-full border-r last:border-r-0 ${toneClasses[segment.tone]}`}
                        style={{ width: `${Math.min(segment.value, 1) * 100}%` }}
                    />
                ))}
            {marker ? (
                <span
                    title={marker.label}
                    className="border-base-content absolute inset-y-0 border-l-2 border-dashed"
                    style={{ left: `${Math.min(Math.max(marker.value, 0), 1) * 100}%` }}
                />
            ) : null}
        </div>
    );
}

/** The key to the tones of one or more stacked meters. */
export function MeterLegend({ items, label }: { items: readonly Omit<MeterSegment, 'value'>[]; label: string }) {
    return (
        <ul aria-label={label} className="flex flex-wrap gap-x-4 gap-y-1">
            {items.map((item) => (
                <li key={item.id} className="flex items-center gap-1.5">
                    <span aria-hidden="true" className={`size-2 shrink-0 rounded-full ${toneClasses[item.tone]}`} />
                    <Text as="span" variant="caption" tone="muted">
                        {item.label}
                    </Text>
                </li>
            ))}
        </ul>
    );
}
