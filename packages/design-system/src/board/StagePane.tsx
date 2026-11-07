// A section of Lar Factory's board's work by stage (Queue, Shaping, Ready to build, Build, Concepts and linked work): a
// titled list that takes the height of its rows, so a section with none stays small and the page scrolls past them all.

import type { ReactNode } from 'react';

/** A stage's section: its status glyph, title and count, anything at the header's `right`, then its rows. */
export function StagePane({
    id,
    title,
    glyph,
    count,
    right,
    children,
}: {
    /** Names the section, as `data-stage`, and its heading's id. */
    id: string;
    title: string;
    glyph?: ReactNode;
    count: number;
    right?: ReactNode;
    children: ReactNode;
}) {
    return (
        <section
            data-stage={id}
            aria-labelledby={`${id}-h`}
            className="min-w-0 overflow-hidden rounded-xl border border-(--border) bg-(--card) shadow-xs"
        >
            <header className="flex min-h-10 flex-wrap items-center gap-x-2 gap-y-1 border-b border-(--border) px-3 py-1">
                {glyph}
                <h3 id={`${id}-h`} className="m-0 text-[13px] font-medium whitespace-nowrap">
                    {title} <span className="font-normal text-(--muted-foreground) tabular-nums">{count}</span>
                </h3>
                {right && <span className="ml-auto flex max-w-full min-w-0 items-center">{right}</span>}
            </header>
            <div className="@container">{children}</div>
        </section>
    );
}

/** The rows of a stage's section. */
export function StageList({ children }: { children: ReactNode }) {
    return <ol className="m-0 grid list-none p-0">{children}</ol>;
}

/** What a section says with no row: that it's loading, that nothing is in it, or that the filters hide every row. */
export function StagePaneEmpty({ children }: { children: ReactNode }) {
    return (
        <p data-pane-empty className="m-0 px-3 py-3 text-[12px] text-(--muted-foreground)">
            {children}
        </p>
    );
}

/** Builds at work against the build limit, in a section's header: one bar per build the `limit` allows, more when
 *  they're over it, the bars at work in `color`, then the count in words. */
export function BuildLimit({
    building,
    limit,
    color,
    title,
    children,
}: {
    building: number;
    limit?: number | undefined;
    color: string;
    title: string;
    children: ReactNode;
}) {
    return (
        <span
            className="build-limit inline-flex items-center gap-1.5 text-[11px] whitespace-nowrap text-(--muted-foreground) tabular-nums"
            title={title}
        >
            {limit !== undefined && (
                <span className="inline-flex gap-[3px]">
                    {Array.from({ length: Math.max(limit, building) }, (_, n) => (
                        <span
                            key={n}
                            className="bar h-1.5 w-3 rounded-full"
                            style={{ background: n < building ? color : 'var(--border)' }}
                        />
                    ))}
                </span>
            )}
            {children}
        </span>
    );
}

/** A switch in a section's header with its visible `label` before it, and before that any `hold` that keeps it from
 *  acting, truncating; `title` says what it would do. */
export function HeaderSwitch({
    label,
    title,
    hold,
    control,
}: {
    label: string;
    title: string;
    hold?: string | undefined;
    /** The Switch, named by `label` for assistive technology. */
    control: ReactNode;
}) {
    return (
        <span
            className="auto-build inline-flex min-w-0 items-center gap-1.5 text-[11px] whitespace-nowrap text-(--muted-foreground)"
            title={title}
        >
            {hold && (
                <span className="min-w-0 truncate" title={hold} data-auto-build-hold>
                    {hold}
                </span>
            )}
            <span aria-hidden="true">{label}</span>
            {control}
        </span>
    );
}

/** The stages' sections, one under another, named by `label`. */
export function StageSections({ label, children }: { label: string; children: ReactNode }) {
    return (
        <section className="stages flex flex-col gap-3" aria-label={label}>
            {children}
        </section>
    );
}
