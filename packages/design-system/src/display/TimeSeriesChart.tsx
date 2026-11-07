import { type PointerEvent, useState } from 'react';

import { SkeletonLoader } from '../feedback/SkeletonLoader';

export interface TimeSeriesPoint {
    timestamp: number;
    lar: number | null;
    host: number | null;
}

export function TimeSeriesChartSkeleton() {
    return (
        <figure className="border-base-300 bg-base-100 min-w-0 rounded-lg border p-4">
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
    label: string;
    larLabel: string;
    hostLabel: string;
    points: readonly TimeSeriesPoint[];
    formatValue: (value: number) => string;
    maximum?: number;
    unavailableLabel: string;
}

const colors: Record<Series, string> = { host: 'var(--color-base-600)', lar: 'var(--color-primary)' };
const time = (timestamp: number) => new Date(timestamp).toLocaleTimeString();

/** Host and lar series, each drawn only when the server measured it, with gaps for missed samples. */
export function TimeSeriesChart({
    label,
    larLabel,
    hostLabel,
    points,
    formatValue,
    maximum,
    unavailableLabel,
}: TimeSeriesChartProps) {
    const [hovered, setHovered] = useState<number | null>(null);
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
        <span aria-hidden="true" className="size-2 shrink-0 rounded-full" style={{ backgroundColor: colors[kind] }} />
    );
    const active = hovered === null ? undefined : points[hovered];
    const readings = active
        ? series.flatMap((kind) => {
              const value = active[kind];

              return value === null ? [] : [{ kind, value }];
          })
        : [];
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
        <figure className="border-base-300 bg-base-100 min-w-0 rounded-lg border p-4">
            <figcaption className="text-base-content mb-3 text-sm font-medium">{label}</figcaption>
            <div
                className="relative h-36 w-full touch-pan-y"
                onPointerMove={trackPointer}
                onPointerLeave={() => setHovered(null)}
            >
                <svg
                    aria-label={`${label}: ${series.map((kind) => `${labels[kind]} ${latestText(kind)}`).join(', ')}`}
                    className="size-full overflow-visible"
                    preserveAspectRatio="none"
                    role="img"
                    viewBox="0 0 100 40"
                >
                    <path
                        d="M2,38 H98 M2,20 H98 M2,2 H98"
                        fill="none"
                        stroke="currentColor"
                        strokeOpacity="0.12"
                        strokeWidth="0.25"
                    />
                    {series.map((kind) => (
                        <path
                            key={kind}
                            d={path(kind)}
                            fill="none"
                            stroke={colors[kind]}
                            strokeLinecap="round"
                            strokeWidth="2"
                            vectorEffect="non-scaling-stroke"
                        />
                    ))}
                </svg>
                {active && readings.length > 0 ? (
                    <div aria-hidden="true" className="pointer-events-none absolute inset-0">
                        <div
                            className="bg-base-content/20 absolute inset-y-0 w-px -translate-x-1/2"
                            style={{ left: `${x(active.timestamp)}%` }}
                        />
                        {readings.map(({ kind, value }) => (
                            <div
                                key={kind}
                                className="ring-base-50 absolute size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full ring-2"
                                style={{
                                    left: `${x(active.timestamp)}%`,
                                    top: `${(y(value) / 40) * 100}%`,
                                    backgroundColor: colors[kind],
                                }}
                            />
                        ))}
                        <div
                            className={`border-base-300 bg-base-100 absolute top-0 z-10 w-max rounded-md border px-2 py-1 text-xs shadow-sm ${x(active.timestamp) > 50 ? '-ml-2 -translate-x-full' : 'ml-2'}`}
                            style={{ left: `${x(active.timestamp)}%` }}
                        >
                            <div className="text-base-600 tabular-nums">{time(active.timestamp)}</div>
                            {readings.map(({ kind, value }) => (
                                <div key={kind} className="text-base-content flex items-center gap-1.5 tabular-nums">
                                    {swatch(kind)}
                                    {labels[kind]}: {formatValue(value)}
                                </div>
                            ))}
                        </div>
                    </div>
                ) : null}
            </div>
            <div className="text-base-700 mt-3 flex flex-wrap items-center gap-x-5 gap-y-1 text-xs">
                {series.map((kind) => (
                    <span key={kind} className="inline-flex items-center gap-1.5">
                        {swatch(kind)}
                        {labels[kind]}: {latestText(kind)}
                    </span>
                ))}
                <span className="ml-auto tabular-nums">{formatValue(upper)}</span>
            </div>
            {points.length > 1 ? (
                <div className="text-base-600 mt-1 flex justify-between text-xs tabular-nums">
                    <span>{time(first)}</span>
                    <span>{time(last)}</span>
                </div>
            ) : null}
        </figure>
    );
}
