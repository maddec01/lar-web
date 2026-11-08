import { Text } from '../typography/Typography';

/** A data series' colour, in order: 1 navy, 2 teal, 3 orange, a set told apart for every colour vision (the
 *  `series-1` to `series-3` tokens). Use them in order and never cycle them; a status hue never names a series, and
 *  the words beside a series' swatch name it, so its colour is never the only key. */
export type MeterSeries = 1 | 2 | 3;

const seriesClasses: Record<MeterSeries, string> = {
    1: 'bg-series-1',
    2: 'bg-series-2',
    3: 'bg-series-3',
};

/** A series' key in a legend: a small square in its meter or chart colour. Square, never round, so it can't be read as
 *  a status light (StatusIndicator's dot, which only a state colours); a row that names a series and also has a
 *  status shows this swatch and says or lights the status separately. Decorative: the text beside it names the
 *  series. */
export function LegendSwatch({
    series,
    color,
}: {
    /** The series, as its StackedMeter segment has it. */
    series?: MeterSeries | undefined;
    /** A colour that comes with the data (a chart series' own), in place of `series`. */
    color?: string | undefined;
}) {
    return (
        <span
            aria-hidden="true"
            data-slot="legend-swatch"
            className={`inline-block size-2.5 shrink-0 rounded-xs ${color ? '' : seriesClasses[series ?? 1]}`}
            style={color ? { background: color } : undefined}
        />
    );
}

export interface MeterSegment {
    /** The segment's key in the meter. */
    id: string;
    /** Shown on hover, for example "Playback 50%". */
    label: string;
    /** The segment's series, which colours it. */
    series: MeterSeries;
    /** The share of the whole meter, from 0 to 1. */
    value: number;
}

interface StackedMeterProps {
    /** Summarizes the meter for assistive technology. */
    label: string;
    /** A dashed line at a share of the whole, for example a limit; it stands a little past the bar's edges. */
    marker?: {
        /** Names the marker, such as "Limit 80%". */
        label: string;
        /** Where it stands, as a share of the whole from 0 to 1. */
        value: number;
    };
    /** The segments, in order from the start. */
    segments: readonly MeterSegment[];
    /** `sm` is an 8px bar, for a dashboard card; `md` (the default) a 12px bar. */
    size?: 'sm' | 'md';
}

/** One bar split into a segment per series, each parted from the next by a hairline of the card, with an optional dashed
 *  marker. */
export function StackedMeter({ label, marker, segments, size = 'md' }: StackedMeterProps) {
    return (
        <div role="img" aria-label={label} className="relative w-full">
            <div className={`bg-track flex w-full overflow-hidden rounded-full ${size === 'sm' ? 'h-2' : 'h-3'}`}>
                {segments
                    .filter((segment) => segment.value > 0)
                    .map((segment) => (
                        <span
                            key={segment.id}
                            title={segment.label}
                            className={`border-surface-card h-full border-r-2 last:border-r-0 ${seriesClasses[segment.series]}`}
                            style={{ width: `${Math.min(segment.value, 1) * 100}%` }}
                        />
                    ))}
            </div>
            {marker ? (
                <span
                    title={marker.label}
                    className="border-fg absolute -inset-y-1 -ml-px border-l-2 border-dashed"
                    style={{ left: `${Math.min(Math.max(marker.value, 0), 1) * 100}%` }}
                />
            ) : null}
        </div>
    );
}

/** The key to the series of one or more stacked meters. */
export function MeterLegend({
    items,
    label,
}: {
    /** The segments to name, each with its colour's square swatch. */
    items: readonly Omit<MeterSegment, 'value'>[];
    /** Names the legend for screen readers. */
    label: string;
}) {
    return (
        <ul aria-label={label} className="flex flex-wrap gap-x-4 gap-y-1">
            {items.map((item) => (
                <li key={item.id} className="flex items-center gap-1.5">
                    <LegendSwatch series={item.series} />
                    <Text as="span" variant="caption" tone="muted">
                        {item.label}
                    </Text>
                </li>
            ))}
        </ul>
    );
}
