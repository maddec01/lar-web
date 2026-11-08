import type { ReactNode } from 'react';

import { SkeletonLoader } from '../feedback/SkeletonLoader';
import { HeadingBase, TextBase } from '../typography/Typography';

export interface LibraryCardProps {
    /** The library's name, usually a link to it: the link covers the whole card (the actions and the status keep their
     *  own clicks above it). */
    title: ReactNode;
    /** What it holds, in a few words, such as "12 albums · 94 tracks", or what an empty one is waiting for, such as
     *  "No albums yet". */
    summary: string;
    /** The kind's icon, before the summary and on an empty shelf. */
    icon: ReactNode;
    /** Its most recent covers or posters, newest first (Artwork or BookCover elements); none shows an empty shelf. The
     *  shelf is decorative: the library's page lists them. */
    artwork?: readonly ReactNode[];
    /** The shape of the artwork: `square` covers (music) or `poster`s (films, shows, books). */
    artworkAspect?: 'square' | 'poster';
    /** Its state, one line: a ProgressStatusRow with `layout="line"`. */
    status?: ReactNode;
    /** Its actions, such as a "More actions" menu button, at the title's end. */
    actions?: ReactNode;
}

const coverWidth = { square: 'w-28', poster: 'w-19' } as const;

/** The shelf's slots: as many covers as its widest card shows. */
const slots = { square: 5, poster: 6 } as const;

/** Only the covers the card's width shows, the last fading out; the rest aren't drawn, so their images never load. */
const shown = {
    square: '@max-md:[&>*:nth-child(4)]:hidden @max-xl:[&>*:nth-child(5)]:hidden [&>*:nth-child(n+6)]:hidden',
    poster: '@max-sm:[&>*:nth-child(5)]:hidden @max-md:[&>*:nth-child(6)]:hidden [&>*:nth-child(n+7)]:hidden',
} as const;

/** One media library on an overview, the way a media server shows its libraries: a shelf of its newest covers, its
 *  name and what it holds, and its state in one line under a hairline. Every card in a grid has the same anatomy and
 *  height, empty or full, scanning or at rest. */
export function LibraryCard({
    title,
    summary,
    icon,
    artwork = [],
    artworkAspect = 'square',
    status,
    actions,
}: LibraryCardProps) {
    return (
        <article
            data-slot="library-card"
            className="group/library surface-card hover:border-line-hover relative isolate flex min-w-0 flex-col overflow-hidden rounded-xl border transition-colors"
        >
            <LibraryShelf artwork={artwork} aspect={artworkAspect} icon={icon} />
            <div className="flex min-w-0 flex-1 flex-col gap-3 p-4 pt-3.5">
                <div className="flex min-w-0 items-start gap-3">
                    <div className="min-w-0 flex-1">
                        <HeadingBase
                            as="h3"
                            variant="title"
                            // The name's link covers the card; it underlines on the card's hover.
                            className="[&_a]:decoration-line-strong [&_a]:focus-ring-stretched truncate [&_a]:underline-offset-4 group-hover/library:[&_a]:underline [&_a]:before:absolute [&_a]:before:inset-0 [&_a]:before:rounded-[inherit]"
                        >
                            {title}
                        </HeadingBase>
                        <TextBase
                            as="p"
                            variant="caption"
                            tone="muted"
                            className="mt-0.5 flex min-w-0 items-center gap-1.5 tabular-nums [&_svg]:size-3.5 [&_svg]:shrink-0"
                        >
                            <span aria-hidden="true" className="flex">
                                {icon}
                            </span>
                            <span className="truncate">{summary}</span>
                        </TextBase>
                    </div>
                    {actions ? <div className="relative z-10 -mt-1 -mr-1.5 flex shrink-0">{actions}</div> : null}
                </div>
                {status ? (
                    <div data-slot="library-status" className="border-line relative z-10 mt-auto border-t pt-3">
                        {status}
                    </div>
                ) : null}
            </div>
        </article>
    );
}

/** The newest covers side by side on a sunken shelf, fading out at the end. The shelf always has the same slots: the
 *  ones its covers don't fill are blank covers, so a library with two albums reads as the start of a shelf rather than
 *  a gap, and an empty one, with its kind's icon on the first, as waiting rather than broken. */
function LibraryShelf({
    artwork,
    aspect,
    icon,
}: {
    artwork: readonly ReactNode[];
    aspect: 'square' | 'poster';
    icon?: ReactNode;
}) {
    const covers = artwork.slice(0, slots[aspect]);
    const blanks = slots[aspect] - covers.length;

    return (
        <div
            aria-hidden="true"
            data-slot="library-shelf"
            className="bg-surface-sunken border-line @container flex h-36 items-center overflow-hidden border-b"
        >
            {/* The covers fade out at the shelf's end, so a long shelf reads as "and more" rather than cut. */}
            <div
                className={`flex min-w-0 flex-1 items-center gap-2.5 [mask-image:linear-gradient(to_right,black_70%,transparent)] px-4 ${shown[aspect]}`}
            >
                {covers.map((cover, index) => (
                    <div
                        key={index}
                        className={`${coverWidth[aspect]} ring-fg/8 shrink-0 rounded-md shadow-(--shadow-raised) ring-1 [&>*]:rounded-md`}
                    >
                        {cover}
                    </div>
                ))}
                {Array.from({ length: blanks }, (_, index) => (
                    <div
                        key={`blank-${index}`}
                        data-slot="library-shelf-blank"
                        className={`${coverWidth[aspect]} bg-fill-muted text-fg-muted flex shrink-0 items-center justify-center rounded-md ${aspect === 'square' ? 'aspect-square' : 'aspect-[2/3]'} [&_svg]:size-6`}
                        // Each blank a step fainter than the one before it, so the shelf trails off.
                        style={{ opacity: 1 - index * 0.18 }}
                    >
                        {covers.length === 0 && index === 0 ? icon : null}
                    </div>
                ))}
            </div>
        </div>
    );
}

/** A LibraryCard while its library loads. */
export function LibraryCardSkeleton() {
    return (
        <article className="surface-card flex min-w-0 flex-col overflow-hidden rounded-xl border">
            <div className="bg-surface-sunken border-line h-36 border-b" />
            <div className="flex flex-col gap-3 p-4 pt-3.5">
                <div className="flex flex-col gap-1.5">
                    <SkeletonLoader.Shape presentation="heading" width="medium" />
                    <SkeletonLoader.Shape width="short" />
                </div>
                <div className="border-line border-t pt-3">
                    <SkeletonLoader.Shape width="wide" />
                </div>
            </div>
        </article>
    );
}
