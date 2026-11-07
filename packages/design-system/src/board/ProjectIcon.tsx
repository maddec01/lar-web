// A project's icon, in a fixed square. An emoji or monogram chosen in T3 takes the square. Otherwise it holds the
// toned initial, with the favicon or lucide icon laid over it once that has loaded, so the square keeps its size either
// way and a missing or broken one leaves the initial. Decorative, as a name sits beside it. An SVG favicon only ever
// renders through this <img>, which runs none of its scripts.

import { lazy, Suspense, useState, type ComponentProps, type ComponentType } from 'react';

import type { DynamicIcon } from '../icons/dynamic';
import type { DataAttributes } from './DataAttributes';

/** T3's project icon colours, which tint a lucide icon or a monogram. */
export type ProjectIconColor =
    | 'gray'
    | 'red'
    | 'orange'
    | 'amber'
    | 'yellow'
    | 'lime'
    | 'green'
    | 'emerald'
    | 'teal'
    | 'cyan'
    | 'sky'
    | 'blue'
    | 'indigo'
    | 'violet'
    | 'purple'
    | 'fuchsia'
    | 'pink'
    | 'rose';

/** What a project's square shows over its initial: a lucide icon by name, an emoji, up to two characters of a
 *  monogram, or a favicon at `src`. */
export type ProjectIconSource =
    | { kind: 'lucide'; name: string; color: ProjectIconColor }
    | { kind: 'emoji'; emoji: string }
    | { kind: 'monogram'; text: string; color: ProjectIconColor }
    | { kind: 'favicon'; src: string };

/** The board's palette of repository colours, which the repositories take in their list order. */
const REPO_TONES = 8;

const SIZES = {
    small: { square: 'size-3.5 text-[8px]', emoji: 'text-[10px]', monogram: 'text-[7px]' },
    row: { square: 'size-4 text-[9px]', emoji: 'text-xs', monogram: 'text-[8px]' },
    medium: { square: 'size-5 text-[10px]', emoji: 'text-sm', monogram: 'text-[10px]' },
};

export type ProjectIconSize = keyof typeof SIZES;

/** Whole class names, as Tailwind only finds those. */
const COLORS: Record<ProjectIconColor, string> = {
    gray: 'text-gray-500',
    red: 'text-red-500',
    orange: 'text-orange-500',
    amber: 'text-amber-500',
    yellow: 'text-yellow-500',
    lime: 'text-lime-500',
    green: 'text-green-500',
    emerald: 'text-emerald-500',
    teal: 'text-teal-500',
    cyan: 'text-cyan-500',
    sky: 'text-sky-500',
    blue: 'text-blue-500',
    indigo: 'text-indigo-500',
    violet: 'text-violet-500',
    purple: 'text-purple-500',
    fuchsia: 'text-fuchsia-500',
    pink: 'text-pink-500',
    rose: 'text-rose-500',
};

const OVERLAY = 'absolute inset-0 size-full bg-base-100';

/** lucide's name map and its icons are lazy chunks, loaded when first shown. DynamicIcon draws nothing for a name
 *  lucide lacks or an icon that won't load, and a name map that won't load draws nothing here. */
const LucideIcon = lazy<ComponentType<ComponentProps<typeof DynamicIcon>>>(() =>
    import('../icons/dynamic').then(
        (lucide) => ({ default: lucide.DynamicIcon }),
        () => ({ default: () => null }),
    ),
);

function Favicon({ src }: { src: string }) {
    const [loaded, setLoaded] = useState(false);
    const [failed, setFailed] = useState(false);

    if (failed) return null;

    return (
        <img
            src={src}
            alt=""
            hidden={!loaded}
            onLoad={() => setLoaded(true)}
            onError={() => setFailed(true)}
            className={`${OVERLAY} object-contain`}
        />
    );
}

const graphemes = new Intl.Segmenter();
const firstGraphemes = (text: string, count: number) => {
    let shown = '';
    let length = 0;

    for (const { segment } of graphemes.segment(text)) {
        shown += segment;

        if (++length === count) break;
    }

    return shown;
};

/**
 * A project's icon in a square of its `size`: `icon`, or its `name`'s initial on the colour of its `place` among the
 * board's repositories (muted for a project the board doesn't list), with a favicon or lucide icon laid over the
 * initial once it has loaded.
 */
export function ProjectIcon({
    icon,
    name,
    place,
    size,
    ...data
}: {
    icon?: ProjectIconSource | null | undefined;
    name: string;
    place?: number | undefined;
    size: ProjectIconSize;
} & DataAttributes) {
    const { square, emoji, monogram } = SIZES[size];
    const shared = `${square} relative grid shrink-0 place-items-center overflow-hidden rounded-md font-bold`;

    if (icon?.kind === 'emoji')
        return (
            <span {...data} data-project-icon className={shared} aria-hidden="true">
                <span className={emoji}>{icon.emoji}</span>
            </span>
        );

    if (icon?.kind === 'monogram')
        return (
            <span {...data} data-project-icon className={`${shared} ${COLORS[icon.color]}`} aria-hidden="true">
                <span className={`${monogram} leading-none whitespace-nowrap`}>{firstGraphemes(icon.text, 2)}</span>
            </span>
        );

    const tone = place === undefined ? 'repo-tone-none' : `repo-tone-${place % REPO_TONES}`;

    return (
        <span
            {...data}
            data-project-icon
            className={`${tone} ${shared} bg-[var(--k,var(--color-base-600))] text-white`}
            aria-hidden="true"
        >
            {firstGraphemes(name, 1).toUpperCase()}
            {icon?.kind === 'favicon' && <Favicon key={icon.src} src={icon.src} />}
            {icon?.kind === 'lucide' && (
                <Suspense fallback={null}>
                    <LucideIcon
                        key={icon.name}
                        name={icon.name as ComponentProps<typeof DynamicIcon>['name']}
                        className={`${OVERLAY} ${COLORS[icon.color]}`}
                    />
                </Suspense>
            )}
        </span>
    );
}
