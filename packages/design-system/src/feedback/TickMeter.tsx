import { type CSSProperties, useCallback, useLayoutEffect, useRef, useState } from 'react';

import { ambientMotion } from '../foundations/AmbientMotion';
import { type StatusState, statusStateColors } from './StatusState';

/** One share of the meter: a stage, a slice, a check, a part, or a scan's whole run. */
export interface TickSegment {
    /** What it is, for its tooltip, such as "Slice 2: done". */
    label: string;
    /** What it means, which colours its lit ticks (the one tone map): `ready` done, `active` at work, `waiting` held or
     *  needing you, `failed`. None, or `off`, is work still ahead: the bare ticks. */
    state?: StatusState | undefined;
    /** A colour that comes with the data, such as an encoder's playback share, in place of the state's. */
    color?: string | undefined;
    /** How much of the meter it takes, against the other segments' (1 each by default), such as a share of the work. */
    weight?: number | undefined;
    /** How far its own ticks are lit, from 0 to 1 (all of them by default once it has a colour). */
    value?: number | undefined;
    /** Its work runs: the front tick it lights breathes. */
    pulse?: boolean | undefined;
    /** Work of unknown size runs: a light travels along the whole meter, in its colour. */
    sweep?: boolean | undefined;
}

interface TickMeterProps {
    /** Names the meter for assistive technology, such as "Slices, 2 of 5 done". */
    label: string;
    /** The meter's shares, in order. */
    segments: readonly TickSegment[];
    /** A limit on the meter, 0 to 1: the tick it falls on stands out while unlit, as a gauge's red line. */
    marker?: number | undefined;
    /** `sm` (the default) is an 8px tick, for a row or a card; `md` 10px, for a lane or a popover; `lg` 12px, for a
     *  dialog or a details page. */
    size?: 'sm' | 'md' | 'lg';
}

/** One tick and its gap, in pixels: a tick is 4px wide with a 3px gap everywhere, and only how many fit changes. */
const PITCH = 7;
const heights = { sm: 'h-2', md: 'h-2.5', lg: 'h-3' } as const;
const plain = (segment: TickSegment) => segment.value === undefined && !segment.pulse && !segment.sweep;
const colourOf = (segment: TickSegment) =>
    segment.color ?? (segment.state && segment.state !== 'off' ? statusStateColors[segment.state] : undefined);

interface Tick {
    colour?: string | undefined;
    fill: number;
    pulse: boolean;
    title: string;
}

/** Each segment's run of `count` ticks, in proportion to its weight, every tick given to one so the meter is whole. */
function lay(count: number, segments: readonly TickSegment[]): Tick[] {
    // Neighbours that look alike (one colour, lit whole, none at work) are one run: done slices read as one done share.
    const runs: { segment: TickSegment; weight: number }[] = [];

    for (const segment of segments) {
        const last = runs.at(-1);
        const weight = Math.max(0, segment.weight ?? 1);

        if (last && plain(last.segment) && plain(segment) && colourOf(last.segment) === colourOf(segment)) {
            last.weight += weight;
            last.segment = { ...last.segment, label: `${last.segment.label}, ${segment.label}` };
        } else runs.push({ segment, weight });
    }

    const total = runs.reduce((sum, run) => sum + run.weight, 0) || 1;
    const exact = runs.map((run) => (run.weight / total) * count);
    const sizes = exact.map(Math.floor);
    let left = count - sizes.reduce((sum, size) => sum + size, 0);

    // Largest remainders take the ticks left over, so the runs fill the meter exactly.
    for (const i of exact.map((_, i) => i).sort((a, b) => (exact[b]! % 1) - (exact[a]! % 1))) {
        if (left <= 0) break;

        sizes[i]! += 1;
        left -= 1;
    }

    const ticks: Tick[] = [];

    runs.forEach(({ segment }, i) => {
        const colour = colourOf(segment);
        const length = sizes[i]!;
        const lit = colour ? Math.min(1, Math.max(0, segment.value ?? 1)) * length : 0;

        for (let t = 0; t < length; t++)
            ticks.push({
                colour,
                fill: Math.min(1, Math.max(0, lit - t)),
                // Only the front tick of work that runs breathes: the last one it lights.
                pulse: !!segment.pulse && t === Math.ceil(lit) - 1,
                title: segment.label,
            });
    });

    return ticks;
}

/**
 * A meter of small rounded ticks, as many as its width holds, the one way every Lar app shows how far work has come:
 * a scan, a workflow's stages, a piece of work's slices, its checks, a concept's parts. Its segments share the ticks in
 * order and in proportion to their weight; each lights its ticks in its state's colour up to its `value`, the front
 * tick of running work breathes (`pulse`), work of unknown size sends a light along the ticks (`sweep`), and work still
 * ahead is the bare ticks. Neighbouring segments that look alike merge into one run. A tick is 4px wide with a 3px gap
 * at every width, so a meter set to a whole number of ticks (n × 7px − 3px) spaces them evenly; what width is left
 * over spreads between them. Motion pauses out of view and holds still for reduced motion. Use Progress for one plain
 * determinate bar and StackedMeter for shares of a whole with a legend.
 */
export function TickMeter({ label, segments, marker, size = 'sm' }: TickMeterProps) {
    const element = useRef<HTMLSpanElement | null>(null);
    // Measured from the meter's own width, which never grows with its ticks (it clips them), so a narrowing meter
    // always lands on fewer ticks.
    const [count, setCount] = useState(size === 'lg' ? 48 : 24);

    useLayoutEffect(() => {
        const meter = element.current;

        if (!meter || typeof ResizeObserver === 'undefined') return;

        const measure = () => setCount(Math.max(4, Math.floor((meter.clientWidth + 3) / PITCH)));
        const observer = new ResizeObserver(measure);

        observer.observe(meter);
        measure();

        return () => observer.disconnect();
    }, []);

    const sweep = segments.length === 1 && segments[0]!.sweep ? segments[0]! : undefined;
    const moving = !!sweep || segments.some((segment) => segment.pulse);
    const setElement = useCallback(
        (node: HTMLSpanElement | null) => {
            element.current = node;

            return moving ? ambientMotion(node) : undefined;
        },
        [moving],
    );
    const ticks = sweep ? lay(count, [{ label: sweep.label }]) : lay(count, segments);
    const limit = marker === undefined ? undefined : Math.min(count - 1, Math.max(0, Math.round(marker * count) - 1));

    return (
        <span
            ref={setElement}
            role="img"
            aria-label={label}
            data-slot="tick-meter"
            data-sweeping={sweep ? '' : undefined}
            className={`lar-tick-meter flex w-full min-w-0 items-center justify-between overflow-hidden ${heights[size]}`}
            style={
                {
                    '--lar-tick-colour': sweep ? (colourOf(sweep) ?? statusStateColors.active) : undefined,
                    '--lar-tick-count': ticks.length,
                } as CSSProperties
            }
        >
            {ticks.map((tick, index) => (
                <span
                    key={index}
                    title={tick.title || undefined}
                    data-front={tick.pulse ? '' : undefined}
                    data-marker={index === limit && !(tick.fill > 0) ? '' : undefined}
                    className="lar-tick h-full w-1 shrink-0 rounded-full"
                    style={
                        sweep
                            ? ({ '--lar-tick-index': index } as CSSProperties)
                            : tick.fill > 0 && tick.colour
                              ? {
                                    background: tick.colour,
                                    // A tick the work is partway through glows in proportion.
                                    opacity: tick.fill < 1 ? 0.35 + tick.fill * 0.65 : undefined,
                                }
                              : undefined
                    }
                />
            ))}
        </span>
    );
}
