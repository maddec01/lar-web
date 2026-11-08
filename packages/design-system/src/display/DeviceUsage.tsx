import { TextBase } from '../typography/Typography';
import { LegendSwatch, type MeterSegment, type MeterSeries, StackedMeter } from './StackedMeter';

export interface DeviceUsageItem {
    /** The item's key. */
    id: string;
    /** Its series in the meter, whose colour its swatch takes. */
    series: MeterSeries;
    /** What it is, such as "Playback · 1080p and smaller transcode". */
    label: string;
    /** Where it stands, such as "Running" or "Waiting #1". */
    detail?: string;
    /** Its share, such as "13%". */
    value?: string;
}

export interface DeviceUsageProps {
    /** How much is in use, as a figure, such as "13%". */
    value: string;
    /** What the figure is, after it, such as "in use". */
    valueLabel: string;
    /** What room is left, under the figure, said as what still fits, such as "Room for 6 more transcodes at 1080p or
     *  lower · limit 100%", or why it isn't known yet, such as "Not measured yet". */
    summary?: string;
    /** The meter: its accessible summary, its segments (one per series) and an optional limit marker. */
    meter: { label: string; segments: readonly MeterSegment[]; marker?: { label: string; value: number } };
    /** What uses it now, one row each, with the swatch of its series. */
    items?: readonly DeviceUsageItem[];
    /** What shows without items, such as "Idle". */
    emptyLabel?: string;
    /** A quiet line after the items, such as "2 more waiting". */
    footnote?: string;
    /** `sm` is a dashboard card's (a slimmer meter); `md` (the default) a settings card's. */
    size?: 'sm' | 'md';
}

/** How much of a device's capacity is in use and by what: a headline figure with the room left, one meter split by
 *  series with an optional limit marker, and the work using it, each row keyed to its series' swatch. The same
 *  anatomy wherever a device's load shows, such as lar-server's encode budget on the dashboard and in its playback
 *  settings. Put it in a DeviceCard. */
export function DeviceUsage({
    value,
    valueLabel,
    summary,
    meter,
    items = [],
    emptyLabel,
    footnote,
    size = 'md',
}: DeviceUsageProps) {
    return (
        <div data-slot="device-usage" className="flex min-w-0 flex-col gap-3">
            {/* The figure, then the room left under it: the same two lines at every width. */}
            <div className="flex min-w-0 flex-col gap-0.5">
                <span className="flex items-baseline gap-1.5">
                    <TextBase as="span" variant="metric" className="tabular-nums">
                        {value}
                    </TextBase>
                    <TextBase as="span" variant="caption" tone="muted">
                        {valueLabel}
                    </TextBase>
                </span>
                {summary ? (
                    <TextBase as="span" variant="caption" tone="muted" className="min-w-0">
                        {summary}
                    </TextBase>
                ) : null}
            </div>
            <StackedMeter {...meter} size={size} />
            {items.length ? (
                <ul className="flex min-w-0 flex-col gap-2">
                    {items.map((item) => (
                        <li key={item.id} className="grid min-w-0 grid-cols-[auto_minmax(0,1fr)_auto] gap-x-2">
                            {/* The swatch keeps to the label's line, in its own column, under the meter's start. */}
                            <span className="flex h-4 items-center">
                                <LegendSwatch series={item.series} />
                            </span>
                            <span className="flex min-w-0 flex-col">
                                <TextBase as="span" variant="caption" className="truncate" title={item.label}>
                                    {item.label}
                                </TextBase>
                                {item.detail ? (
                                    <TextBase as="span" variant="caption" tone="muted" className="truncate">
                                        {item.detail}
                                    </TextBase>
                                ) : null}
                            </span>
                            {item.value ? (
                                <TextBase as="span" variant="caption" tone="muted" className="tabular-nums">
                                    {item.value}
                                </TextBase>
                            ) : null}
                        </li>
                    ))}
                </ul>
            ) : emptyLabel ? (
                <TextBase as="p" variant="caption" tone="muted">
                    {emptyLabel}
                </TextBase>
            ) : null}
            {footnote ? (
                <TextBase as="p" variant="caption" tone="muted">
                    {footnote}
                </TextBase>
            ) : null}
        </div>
    );
}
