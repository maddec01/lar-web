// A dossier's Work map: lanes of parts placed left to right by what they wait on, arrows between them, the end-to-end
// check, and finished history folded into one group below. The board lays it out; these draw it at the given places.

import { ChevronDownIcon, ChevronRightIcon, FlaskConicalIcon, HammerIcon, LightbulbIcon } from 'lucide-react';
import type { ReactNode, Ref } from 'react';

import { Tooltip, TooltipPopup, TooltipTrigger } from '../overlays/Tooltip';

/** The map's frame, which scrolls sideways when the map is wider; `frameRef` measures its width. */
export function WorkMapFrame({ frameRef, children }: { frameRef?: Ref<HTMLDivElement>; children: ReactNode }) {
    return (
        <div
            ref={frameRef}
            className="overflow-x-auto rounded-lg border border-(--border) bg-(--background)"
            data-work-map
        >
            {children}
        </div>
    );
}

/** The map's drawing area, `width` by `height` pixels, which places what it holds absolutely. */
export function MapCanvas({ width, height, children }: { width: number; height: number; children: ReactNode }) {
    return (
        <div className="relative" style={{ width, height }} data-map-canvas>
            {children}
        </div>
    );
}

/** A lane's band across the map, banded on odd `index`es, with its `name` in a label that stays in view as the map
 *  scrolls. */
export function MapBand({
    index,
    top,
    height,
    width,
    labelWidth,
    children,
}: {
    index: number;
    top: number;
    height: number;
    width: number;
    labelWidth: number;
    children: ReactNode;
}) {
    return (
        <div
            className={`absolute left-0 ${index ? 'border-t border-(--border)' : ''} ${index % 2 ? 'bg-[color-mix(in_srgb,var(--muted)_50%,transparent)]' : ''}`}
            style={{ top, height, width }}
        >
            <div
                className="sticky left-0 flex h-full flex-col justify-center gap-0.5 bg-[color-mix(in_srgb,var(--background)_85%,transparent)] px-3"
                style={{ width: labelWidth }}
            >
                <span className="flex min-w-0 items-center gap-1.5 text-xs font-medium">{children}</span>
            </div>
        </div>
    );
}

/** A lane's name with its icon: the decisions' lane, or the dossier's own repository's builds. */
export function MapLaneName({ lane, children }: { lane: 'decisions' | 'builds'; children: string }) {
    const Icon = lane === 'decisions' ? LightbulbIcon : HammerIcon;

    return (
        <>
            <Icon className="size-3.5 text-(--muted-foreground)" />
            {children}
        </>
    );
}

/** An arrow from one part to another: `d` is its line; a `done` one is solid in the done colour. `lit` draws it bold
 *  while either end is hovered, and `dim` faint while another is. */
export interface MapEdge {
    key: string;
    d: string;
    done: boolean;
    lit: boolean;
    dim: boolean;
}

/** The map's arrows, under its parts. `markerId` is unique to the map. */
export function MapEdges({
    width,
    height,
    markerId,
    edges,
}: {
    width: number;
    height: number;
    markerId: string;
    edges: MapEdge[];
}) {
    return (
        <svg className="pointer-events-none absolute inset-0" width={width} height={height} aria-hidden="true">
            <defs>
                {['done', 'open'].map((k) => (
                    <marker
                        key={k}
                        id={`${markerId}-${k}`}
                        viewBox="0 0 8 8"
                        refX="7"
                        refY="4"
                        markerWidth="7"
                        markerHeight="7"
                        orient="auto"
                    >
                        <path d="M0 0 8 4 0 8z" fill={k === 'done' ? 'var(--st-done)' : 'var(--muted-foreground)'} />
                    </marker>
                ))}
            </defs>
            {edges.map((e) => (
                <path
                    key={e.key}
                    d={e.d}
                    fill="none"
                    data-edge={e.key}
                    stroke={e.done ? 'var(--st-done)' : 'var(--muted-foreground)'}
                    strokeWidth={e.lit ? 2.5 : 1.5}
                    strokeDasharray={e.done ? undefined : '5 4'}
                    opacity={e.dim ? 0.2 : e.done ? 0.7 : 0.9}
                    markerEnd={`url(#${markerId}-${e.done ? 'done' : 'open'})`}
                />
            ))}
        </svg>
    );
}

/** An arrow's label, at `left`/`top` and at most `maxWidth` wide: a button that opens what it stands for, its tooltip
 *  naming them (`names`). */
export function MapEdgeLabel({
    edge,
    label,
    names,
    left,
    top,
    maxWidth,
    onOpen,
}: {
    edge: string;
    label: string;
    names: string;
    left: number;
    top: number;
    maxWidth: number;
    onOpen: () => void;
}) {
    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <button
                    type="button"
                    aria-label={`${label}: ${names}`}
                    onClick={onOpen}
                    data-edge-label={edge}
                    className="absolute truncate rounded text-left text-[11px] leading-3.5 text-(--muted-foreground) hover:text-(--foreground) hover:underline focus-visible:outline-2 focus-visible:outline-(--primary)"
                    style={{ left, top, maxWidth }}
                >
                    {label}
                </button>
            </TooltipTrigger>
            <TooltipPopup side="top">{names}</TooltipPopup>
        </Tooltip>
    );
}

/** A node's place on the map, faint while `dim`; hovering it lights its arrows. */
export function MapNode({
    left,
    top,
    dim,
    onHover,
    children,
}: {
    left: number;
    top: number;
    dim: boolean;
    onHover: (hovered: boolean) => void;
    children: ReactNode;
}) {
    return (
        <div
            className={`absolute transition-opacity ${dim ? 'opacity-40' : ''}`}
            style={{ left, top }}
            onMouseEnter={() => onHover(true)}
            onMouseLeave={() => onHover(false)}
        >
            {children}
        </div>
    );
}

/** The group finished history folds into, across the map at `top`: a button with its `glyph` and `text` that shows or
 *  hides the finished parts, saying which it does. */
export function MapHistoryGroup({
    open,
    top,
    height,
    dim,
    glyph,
    text,
    showLabel,
    hideLabel,
    onToggle,
    onHover,
}: {
    open: boolean;
    top: number;
    height: number;
    dim: boolean;
    glyph: ReactNode;
    text: string;
    showLabel: string;
    hideLabel: string;
    onToggle: () => void;
    onHover: (hovered: boolean) => void;
}) {
    return (
        <button
            type="button"
            aria-expanded={open}
            onClick={onToggle}
            data-map-history
            onMouseEnter={() => onHover(true)}
            onMouseLeave={() => onHover(false)}
            className={`absolute flex items-center gap-2 rounded-lg border border-(--border) bg-(--card) px-2.5 text-left text-xs shadow-xs transition-opacity hover:bg-(--accent) focus-visible:outline-2 focus-visible:outline-(--primary) ${dim ? 'opacity-40' : ''}`}
            style={{ left: 12, right: 12, top, height }}
        >
            {glyph}
            <span className="min-w-0 truncate font-medium">{text}</span>
            <span className="inline-flex shrink-0 items-center gap-1 text-(--muted-foreground)">
                {open ? (
                    <>
                        {hideLabel}
                        <ChevronDownIcon className="size-3.5" />
                    </>
                ) : (
                    <>
                        {showLabel}
                        <ChevronRightIcon className="size-3.5" />
                    </>
                )}
            </span>
        </button>
    );
}

/** The finished parts under the map, `width` wide, one HistoryRow each. */
export function MapHistoryList({ width, children }: { width: number; children: ReactNode }) {
    return (
        <ol
            className="m-0 grid list-none grid-cols-[repeat(auto-fill,minmax(min(100%,28rem),1fr))] gap-x-4 gap-y-1 px-3 pb-3"
            style={{ width }}
            data-map-history-parts
        >
            {children}
        </ol>
    );
}

/** A finished part as one row of the history: its glyph, kind, title opening it, what it followed, and at its right its
 *  repository, pull requests and thread. */
export function HistoryRow({
    id,
    glyph,
    kind,
    name,
    onOpen,
    title,
    after,
    afterTitle,
    side,
}: {
    id: string;
    glyph: ReactNode;
    kind: ReactNode;
    /** The part's full name, for its title's tooltip. */
    name: string;
    onOpen: () => void;
    title: ReactNode;
    after?: string | undefined;
    afterTitle?: string | undefined;
    side: ReactNode;
}) {
    return (
        <li
            className="flex min-h-12 min-w-0 items-center gap-3 rounded-md px-3 text-[13px] hover:bg-(--soft)"
            data-history-part={id}
        >
            {glyph}
            <span className="w-22 shrink-0">{kind}</span>
            <button
                type="button"
                onClick={onOpen}
                title={name}
                className="min-w-0 truncate rounded text-left hover:underline focus-visible:outline-2 focus-visible:outline-(--primary)"
            >
                {title}
            </button>
            {after && (
                <span
                    className="min-w-0 shrink-[1000] truncate text-[11px] text-(--muted-foreground)"
                    title={afterTitle}
                >
                    {after}
                </span>
            )}
            <span className="ml-auto flex shrink-0 items-center gap-2 text-[11px] text-(--muted-foreground)">
                {side}
            </span>
        </li>
    );
}

const NODE_TONE = {
    default: 'border-(--border)',
    asks: 'border-[color-mix(in_srgb,var(--warning)_45%,var(--border))] shadow-[inset_3px_0_0_var(--warning)]',
    waits: 'border-dashed border-(--input)',
} as const;

/**
 * A part on the map, `width` by `height`: a card that opens it (`openLabel` names the button, `title` says it all),
 * with its `source` in the corner, a `head` line (kind, repository, fields) with its `action` at the right, its title,
 * its `glyph` and `facts`, and its `slices` along the bottom. It `asks` (an answer from you) or `waits` (on other work)
 * in its border's tone, and is ringed while `picked`.
 */
export function MapPartNode({
    id,
    width,
    height,
    tone = 'default',
    picked,
    openLabel,
    title,
    onOpen,
    source,
    head,
    action,
    name,
    glyph,
    facts,
    slices,
}: {
    id: string;
    width: number;
    height: number;
    tone?: keyof typeof NODE_TONE;
    picked: boolean;
    openLabel: string;
    title: string;
    onOpen: () => void;
    source: ReactNode;
    head: ReactNode;
    action?: ReactNode;
    name: ReactNode;
    glyph: ReactNode;
    facts: string;
    slices?: ReactNode;
}) {
    return (
        <div
            style={{ width, height }}
            data-map-part={id}
            className={`relative flex flex-col gap-1 overflow-hidden rounded-lg border bg-(--card) px-2.5 py-2 text-left shadow-xs ${NODE_TONE[tone]} ${picked ? 'ring-2 ring-(--primary) ring-offset-1 ring-offset-(--card)' : ''}`}
        >
            <button
                type="button"
                aria-label={openLabel}
                title={title}
                onClick={onOpen}
                className="absolute inset-0 rounded-lg hover:bg-[color-mix(in_srgb,var(--accent)_60%,transparent)] focus-visible:outline-2 focus-visible:outline-(--primary)"
            />
            {source}
            <span
                className="pointer-events-none relative flex min-h-6 min-w-0 items-center gap-1.5 pr-5 text-[11px] text-(--muted-foreground)"
                data-map-head
            >
                {head}
                {action && <span className="pointer-events-auto ml-auto shrink-0">{action}</span>}
            </span>
            <span className="pointer-events-none relative line-clamp-2 text-[13px] leading-snug font-medium">
                {name}
            </span>
            <span className="pointer-events-none relative mt-auto flex min-w-0 items-center gap-1.5 text-xs">
                {glyph}
                <span className="min-w-0 flex-1 truncate" data-map-facts>
                    {facts}
                </span>
            </span>
            {slices && <span className="pointer-events-none absolute inset-x-2.5 bottom-0.5">{slices}</span>}
        </div>
    );
}

/** The end-to-end check at the end of the map, `width` by `height`: its `label`, title, then its `glyph` and `steps`
 *  (how many, and what it comes after), which `stepsTitle` says in full. */
export function MapCheckNode({
    width,
    height,
    label,
    title,
    glyph,
    steps,
    stepsTitle,
}: {
    width: number;
    height: number;
    label: string;
    title: string;
    glyph: ReactNode;
    steps: string;
    stepsTitle?: string | undefined;
}) {
    return (
        <div
            style={{ width, height }}
            data-map-check
            className="flex flex-col gap-1 rounded-lg border-2 border-dashed border-(--input) bg-(--card) px-2.5 py-2 shadow-xs"
        >
            <span className="flex items-center gap-1.5 text-[11px] text-(--muted-foreground)">
                <FlaskConicalIcon className="size-3.5" />
                {label}
            </span>
            <span className="line-clamp-2 text-[13px] leading-snug font-medium">{title}</span>
            <span className="mt-auto flex min-w-0 items-center gap-1.5 text-xs">
                {glyph}
                <span className="min-w-0 truncate" title={stepsTitle}>
                    {steps}
                </span>
            </span>
        </div>
    );
}
