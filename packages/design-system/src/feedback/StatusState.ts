import type { StatusTone } from './StatusIndicator';

/** What a status means, which fixes its colour in every app: pick the state, never the colour.
 *
 *  - `ready`: connected, ready, up to date, done (green).
 *  - `active`: running, working, in progress, live (blue).
 *  - `waiting`: waiting on something, needs attention, degraded, paused for a reason (amber).
 *  - `failed`: failed, broken, unreachable (red).
 *  - `off`: off, idle, not checked yet, unknown (grey, no glow). */
export type StatusState = 'ready' | 'active' | 'waiting' | 'failed' | 'off';

/** The one tone map: each state's status tone. */
export const statusStateTones = {
    ready: 'success',
    active: 'info',
    waiting: 'warning',
    failed: 'danger',
    off: 'neutral',
} as const satisfies Record<StatusState, StatusTone>;

/** Each state's colour, as a CSS colour value: the status light's dot, and the one colour any other mark that shows a
 *  status (a board glyph, a slice, a stage's current segment) may be drawn in. Never for text: text takes the tone's
 *  `-fg` token. */
export const statusStateColors = {
    ready: 'var(--color-success)',
    active: 'var(--color-info)',
    waiting: 'var(--color-warning)',
    failed: 'var(--color-danger)',
    off: 'var(--color-line-strong)',
} as const satisfies Record<StatusState, string>;

/** A state's tone, for a component that takes a `tone`; no state is `off`'s neutral. */
export function statusTone(state: StatusState | undefined): StatusTone {
    return statusStateTones[state ?? 'off'];
}

/** A status's colour, given as what it means (`state`, preferred) or, for a case the map doesn't name, as a `tone`
 *  (which wins when both are given). Neither is `off`'s neutral. */
export interface StatusColour<Tone extends string = StatusTone> {
    /** What the status means (ready, active, waiting, failed, off); its tone follows from the one map. */
    state?: StatusState | undefined;
    /** The status's tone, for a case no state names. */
    tone?: Tone | undefined;
}

/** The tone a `StatusColour` resolves to. */
export function resolveStatusTone<Tone extends string>({ state, tone }: StatusColour<Tone>): Tone | StatusTone {
    return tone ?? statusTone(state);
}

/** Where a piece of work is in its life: waiting its turn, running, held (paused, or backing off until a provider
 *  answers), failed, or done. Each maps to one state of the tone map. */
export type ProgressState = 'queued' | 'running' | 'paused' | 'failed' | 'done';

/** The one map from a run's state to what it means: queued is off (grey), running active (blue), paused waiting
 *  (amber), failed failed (red), done ready (green). */
export const progressStateStatus = {
    queued: 'off',
    running: 'active',
    paused: 'waiting',
    failed: 'failed',
    done: 'ready',
} as const satisfies Record<ProgressState, StatusState>;

/** The corresponding progress state for a status. This is the inverse of progressStateStatus. */
export const statusStateProgress = {
    off: 'queued',
    active: 'running',
    waiting: 'paused',
    failed: 'failed',
    ready: 'done',
} as const satisfies Record<StatusState, ProgressState>;
