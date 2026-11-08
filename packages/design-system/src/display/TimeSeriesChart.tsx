import { type KeyboardEvent, type PointerEvent, useId, useState } from 'react';

import { SkeletonLoader } from '../feedback/SkeletonLoader';

/** One sample: when it was taken, and each series' value, or null when the server didn't measure it. */
export interface TimeSeriesPoint {
    /** When the sample was taken, in milliseconds since the epoch. */
    timestamp: number;
    /** Lar's own reading. */
    lar: number | null;
    /** The whole host's reading. */
    host: number | null;
}

/** The chart's place while its samples load. */
export function TimeSeriesChartSkeleton() {
    return (
        <figure className="surface-card min-w-0 rounded-lg border p-4">
            <div className="mb-3 h-5">
                <SkeletonLoader.Shape width="short" />
            </div>
            <SkeletonLoader.Shape presentation="chart" />
            <div className="mt-3 flex h-4 items-center gap-5">
                <SkeletonLoader.Shape width="short" />
                <SkeletonLoader.Shape width="short" />
            </div>
            <div className="mt-1 flex h-4 items-center justify-between">
                <SkeletonLoader.Shape width="short" />
                <SkeletonLoader.Shape width="short" />
            </div>
        </figure>
    );
}

type Series = 'host' | 'lar';

interface TimeSeriesChartProps {
    /** What is measured, such as “CPU”: the chart's caption and the plot's name. */
    label: string;
    /** Names Lar's own series in the legend, tooltip and readings. */
    larLabel: string;
    /** Names the whole host's series in the legend, tooltip and readings. */
    hostLabel: string;
    /** The samples, oldest first. */
    points: readonly TimeSeriesPoint[];
    /** Formats axis, legend, tooltip and accessible readings (for example bytes → GiB). */
    formatValue: (value: number) => string;
    /** Formats a sample's time in the tooltip, the time axis and the readings, in the app's locale; the default is the
     *  browser's locale to the second (samples are seconds apart). */
    formatTime?: (timestamp: number) => string;
    /** The top of the scale, such as 100 for a percentage, so the plot doesn't rescale to its own peak; the peak still
     *  wins when it is higher. */
    maximum?: number;
    /** Stands in for a value the server didn't measure, such as “Not measured”. */
    unavailableLabel: string;
    /** Heads the readings table's time column; with it, a visually hidden table lists every sample for screen readers. */
    timeLabel?: string;
    /** Tells keyboard users how to read the samples, such as “Use the arrow keys to read each sample”. */
    keyboardHint?: string;
}

const colors: Record<Series, string> = { host: 'var(--color-fg-muted)', lar: 'var(--color-primary)' };
/** Each series has a line weight and a marker shape of its own, so it never depends on colour alone. Both lines are
 *  solid: a dashed line reads as a placeholder or a projection, never as measured data. */
const weights: Record<Series, string> = { host: '1.25', lar: '2' };
const markers: Record<Series, string> = { host: 'rounded-xs', lar: 'rounded-full' };
const toTheSecond = new Intl.DateTimeFormat(undefined, { hour: '2-digit', minute: '2-digit', second: '2-digit' });
const defaultTime = (timestamp: number) => toTheSecond.format(timestamp);

/** Host and lar series, each drawn only when the server measured it, with gaps for missed samples. */
export function TimeSeriesChart({
    label,
    larLabel,
    hostLabel,
    points,
    formatValue,
    formatTime: time = defaultTime,
    maximum,
    unavailableLabel,
    timeLabel,
    keyboardHint,
}: TimeSeriesChartProps) {
    const [hovered, setHovered] = useState<number | null>(null);
    const readoutId = useId();
    const labels: Record<Series, string> = { host: hostLabel, lar: larLabel };
    const series = (['host', 'lar'] as const).filter((kind) => points.some((point) => point[kind] !== null));

    if (series.length === 0) return null;

    const observed = points.flatMap((point) => series.map((kind) => point[kind])).filter((value) => value !== null);
    const upper = Math.max(maximum ?? 0, ...observed, 1);
    const latest = points.at(-1);
    const first = points[0]?.timestamp ?? 0;
    const last = latest?.timestamp ?? first;
    const span = Math.max(last - first, 1);
    // Plot coordinates in percent of the viewBox, shared by the SVG lines and the HTML hover layer.
    const x = (timestamp: number) => 2 + ((timestamp - first) / span) * 96;
    const y = (value: number) => 38 - (Math.max(0, value) / upper) * 36;
    const path = (kind: Series) =>
        points
            .map((point, index) => {
                const value = point[kind];

                if (value === null) return '';

                // A sample after a gap starts a segment; a zero-length one draws as a dot through the round cap.
                const start = points[index - 1]?.[kind] == null;

                return `${start ? 'M' : 'L'}${x(point.timestamp).toFixed(2)},${y(value).toFixed(2)}${start ? 'h0' : ''}`;
            })
            .join(' ');
    const latestText = (kind: Series) => (latest?.[kind] == null ? unavailableLabel : formatValue(latest[kind]));
    const swatch = (kind: Series) => (
        <svg aria-hidden="true" className="h-2 w-4 shrink-0 overflow-visible" viewBox="0 0 16 8">
            <path d="M1,4 H15" stroke={colors[kind]} strokeWidth={weights[kind]} strokeLinecap="round" />
        </svg>
    );
    const active = hovered === null ? undefined : points[hovered];
    const readings = active
        ? series.flatMap((kind) => {
              const value = active[kind];

              return value === null ? [] : [{ kind, value }];
          })
        : [];
    const reading = (point: TimeSeriesPoint) =>
        `${time(point.timestamp)}: ${series
            .map((kind) => `${labels[kind]} ${point[kind] === null ? unavailableLabel : formatValue(point[kind])}`)
            .join(', ')}`;
    const step = (event: KeyboardEvent<HTMLDivElement>) => {
        const lastIndex = points.length - 1;
        const current = hovered ?? lastIndex;
        const next =
            event.key === 'ArrowLeft'
                ? Math.max(0, current - 1)
                : event.key === 'ArrowRight'
                  ? Math.min(lastIndex, current + 1)
                  : event.key === 'Home'
                    ? 0
                    : event.key === 'End'
                      ? lastIndex
                      : undefined;

        if (event.key === 'Escape') setHovered(null);

        if (next === undefined) return;

        event.preventDefault();
        setHovered(next);
    };
    const trackPointer = (event: PointerEvent<HTMLDivElement>) => {
        const bounds = event.currentTarget.getBoundingClientRect();
        const target = ((event.clientX - bounds.left) / bounds.width) * 100;
        const distance = (point: TimeSeriesPoint) => Math.abs(x(point.timestamp) - target);

        setHovered(
            points.reduce(
                (best, point, index) => (distance(point) < distance(points[best] ?? point) ? index : best),
                0,
            ),
        );
    };

    return (
        <figure className="surface-card min-w-0 rounded-lg border p-4">
            <figcaption className="text-fg mb-3 text-sm font-medium">{label}</figcaption>
            <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-x-2">
                {/* The plot takes focus: the arrow keys, Home and End walk the samples, read out as they change. */}
                <div
                    tabIndex={0}
                    role="group"
                    aria-label={label}
                    aria-describedby={readoutId}
                    {...(keyboardHint ? { 'aria-description': keyboardHint } : {})}
                    className="focus-ring relative h-36 min-w-0 touch-pan-y rounded-sm"
                    onPointerMove={trackPointer}
                    onPointerLeave={() => setHovered(null)}
                    onKeyDown={step}
                    onFocus={() => setHovered((current) => current ?? points.length - 1)}
                    onBlur={() => setHovered(null)}
                >
                    <svg
                        aria-label={`${label}: ${series.map((kind) => `${labels[kind]} ${latestText(kind)}`).join(', ')}`}
                        className="size-full overflow-visible"
                        preserveAspectRatio="none"
                        role="img"
                        viewBox="0 0 100 40"
                    >
                        <path
                            d="M2,20 H98 M2,2 H98"
                            fill="none"
                            stroke="currentColor"
                            strokeOpacity="0.12"
                            strokeWidth="0.25"
                        />
                        {/* The baseline, a step firmer than the gridlines above it: the scale's zero. */}
                        <path d="M2,38 H98" fill="none" stroke="currentColor" strokeOpacity="0.3" strokeWidth="0.3" />
                        {series.map((kind) => (
                            <path
                                key={kind}
                                d={path(kind)}
                                fill="none"
                                stroke={colors[kind]}
                                strokeLinecap="round"
                                strokeWidth={weights[kind]}
                                vectorEffect="non-scaling-stroke"
                            />
                        ))}
                    </svg>
                    {active && readings.length > 0 ? (
                        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
                            <div
                                className="bg-fg/20 absolute inset-y-0 w-px -translate-x-1/2"
                                style={{ left: `${x(active.timestamp)}%` }}
                            />
                            {readings.map(({ kind, value }) => (
                                <div
                                    key={kind}
                                    className={`ring-surface-page absolute size-2.5 -translate-x-1/2 -translate-y-1/2 ring-2 ${markers[kind]}`}
                                    style={{
                                        left: `${x(active.timestamp)}%`,
                                        top: `${(y(value) / 40) * 100}%`,
                                        backgroundColor: colors[kind],
                                    }}
                                />
                            ))}
                            <div
                                className={`border-line bg-surface-raised absolute top-0 z-10 w-max rounded-md border px-2 py-1 text-xs shadow-(--shadow-popup) ${x(active.timestamp) > 50 ? '-ml-2 -translate-x-full' : 'ml-2'}`}
                                style={{ left: `${x(active.timestamp)}%` }}
                            >
                                <div className="text-fg-muted tabular-nums">{time(active.timestamp)}</div>
                                {readings.map(({ kind, value }) => (
                                    <div key={kind} className="text-fg flex items-center gap-1.5 tabular-nums">
                                        {swatch(kind)}
                                        {labels[kind]}: {formatValue(value)}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : null}
                </div>
                {/* The scale, read off the top gridline and the baseline: each 14px label centres on its line (5% and 95%
                of the 144px plot), so it reads as the axis, never as a reading. */}
                <div
                    aria-hidden="true"
                    className="text-fg-muted text-2xs flex h-36 flex-col justify-between tabular-nums"
                >
                    <span className="leading-3.5">{formatValue(upper)}</span>
                    <span className="leading-3.5">{formatValue(0)}</span>
                </div>
            </div>
            <div id={readoutId} aria-live="polite" className="sr-only">
                {active ? reading(active) : ''}
            </div>
            {timeLabel ? (
                // A table ignores sr-only's 1px box and overflow, so it hides inside a block that honours them; on its
                // own its rows would still lay out and stretch the page's scroll height.
                <div className="sr-only">
                    <table>
                        <caption>{label}</caption>
                        <thead>
                            <tr>
                                <th scope="col">{timeLabel}</th>
                                {series.map((kind) => (
                                    <th key={kind} scope="col">
                                        {labels[kind]}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {points.map((point) => (
                                <tr key={point.timestamp}>
                                    <th scope="row">{time(point.timestamp)}</th>
                                    {series.map((kind) => (
                                        <td key={kind}>
                                            {point[kind] === null ? unavailableLabel : formatValue(point[kind])}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : null}
            <div className="text-fg-muted mt-3 flex flex-wrap items-center gap-x-5 gap-y-1 text-xs">
                {series.map((kind) => (
                    <span key={kind} className="inline-flex items-center gap-1.5">
                        {swatch(kind)}
                        {labels[kind]}: {latestText(kind)}
                    </span>
                ))}
            </div>
            {points.length > 1 ? (
                <div className="text-fg-muted mt-1 flex justify-between text-xs tabular-nums">
                    <span>{time(first)}</span>
                    <span>{time(last)}</span>
                </div>
            ) : null}
        </figure>
    );
}
