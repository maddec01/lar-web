import type { ReactNode } from 'react';

import { SkeletonLoader } from '../feedback/SkeletonLoader';
import { tabbable } from '../foundations/KeyboardFocus';
import { StackBase } from '../layout/Flow';
import { LinkBoxBase, LinkOverlayBase } from '../typography/Link';
import { TextBase } from '../typography/Typography';
import { BadgeBase } from './Badge';

type ImageCardProps =
    | {
          /** Draws the card as a skeleton while it loads. */
          loading: true;
          /** The skeleton artwork's shape: `square`, `poster` (2:3) or `video` (16:9). */
          aspect?: 'square' | 'poster' | 'video';
      }
    | {
          loading?: false;
          /** The cover, poster or picture, filling the card's frame. */
          artwork: ReactNode;
          /** Makes the whole card a button that calls this. */
          onClick?: () => void;
          /** Makes the whole card a link to this address. */
          href?: string;
          /** Called with the `href` on a plain left click, for the app's router. */
          onNavigate?: (href: string) => void;
          /** What it is, such as an album's title: one line, in full on hover and to screen readers. */
          title: string;
          /**
           * The maker row: who made it, such as an album's artist, a book's author, a film's director or a show's
           * creator; for a person, their role. Without one the row stays, empty: an unknown maker is never spelled
           * out ("Unknown author") on a card, in any catalog, so a grid's missing makers all look alike.
           */
          subtitle?: ReactNode;
          /**
           * A kind that never has a maker, such as a photo, a photo album or an artist: the meta row follows the title
           * and the reserved row comes last, so its grid has no gap under the titles and still ends at the same height.
           * Every card of such a grid passes it; a film that merely lacks a director doesn't.
           */
          noMaker?: boolean;
          /** The meta row's facts, muted, such as the year, a date or a count. Without any the row stays, empty. */
          meta?: string;
          /** The meta line's quality or format as a quiet badge after the facts, such as `4K HDR` or `FLAC 24-bit`. */
          quality?: string;
          /** A passing state, such as "Updating details…": it takes the meta line's place, never a line of its own. */
          status?: string;
          /** The card's accessible name, where the title alone doesn't say enough. */
          label?: string;
          /** The card is the one open now, such as the one a panel beside its grid shows. */
          selected?: boolean;
          /**
           * The frame: square by default, `poster` (2:3) for a film or a book. `person` is a round portrait over a
           * name and a role, for a cast, not a catalog: its caption has no meta row.
           */
          presentation?: 'person' | 'poster';
      };

// Every row is one line of one height, so every caption is the same height whatever it holds.
const row = 'h-5 min-w-0';
// The title, the maker and the meta row: VirtualGrid's row estimate counts the same three.
const captionRows = 3;
const line = `${row} block`;
// The card's link or button is focused: its ring goes round the art, where the selected ring goes.
const focusRing =
    'group-has-[:is([data-slot=link-overlay],[data-slot=action-overlay]):focus-visible]/media-item:ring-2 group-has-[:is([data-slot=link-overlay],[data-slot=action-overlay]):focus-visible]/media-item:ring-focus';

/**
 * A piece of media in a grid: its artwork over a caption of three fixed rows, as a link or a button — the title, the
 * maker (`subtitle`), then the meta row (its facts, then its quality as a badge). Every row is one line and always
 * there, empty when the item has nothing for it, so every card of every catalog grid ends at the same height. A kind
 * with no maker at all (`noMaker`) keeps its empty row last instead.
 */
export function ImageCard(props: ImageCardProps) {
    if (props.loading) {
        return (
            <StackBase space="related" className="min-w-0">
                <SkeletonLoader.Shape
                    presentation={props.aspect === 'poster' ? 'poster' : props.aspect === 'video' ? 'video' : 'artwork'}
                />
                <span className="flex flex-col gap-0.5">
                    {Array.from({ length: captionRows }, (_, index) => (
                        <span key={index} className={`${row} flex items-center`}>
                            <SkeletonLoader.Shape width={index === 0 ? 'wide' : index === 1 ? 'medium' : 'short'} />
                        </span>
                    ))}
                </span>
            </StackBase>
        );
    }

    const person = props.presentation === 'person';
    const label =
        props.label ??
        [
            props.title,
            typeof props.subtitle === 'string' ? props.subtitle : undefined,
            props.meta,
            props.quality,
            props.status,
        ]
            .filter(Boolean)
            .join(', ');
    const content = (
        <StackBase space="related" className="min-w-0 text-left">
            <span
                // The ring that marks the open card and the keyboard's focus goes round the art, never the caption.
                className={`ring-offset-surface-page relative block ring-offset-2 ${focusRing} ${person ? 'size-16 rounded-full' : 'rounded-lg'} ${props.selected ? 'ring-primary ring-2' : ''}`}
            >
                {person ? (
                    <span className="block size-full overflow-hidden rounded-full [&>div]:size-full">
                        {props.artwork}
                    </span>
                ) : (
                    props.artwork
                )}
                {props.href || props.onClick ? (
                    // A quiet veil over the art while the card is pointed at.
                    <span
                        aria-hidden="true"
                        className="group-hover/media-item:bg-fg/10 pointer-events-none absolute inset-0 rounded-[inherit] transition-colors duration-(--motion-duration-fast) motion-reduce:transition-none"
                    />
                ) : null}
            </span>
            <span className="flex min-w-0 flex-col gap-0.5">
                <TextBase as="span" variant="label" truncate className={line} title={props.title}>
                    {props.href ? (
                        <LinkOverlayBase
                            href={props.href}
                            onNavigate={props.onNavigate}
                            aria-label={label}
                            aria-current={props.selected ? 'true' : undefined}
                            className="block truncate [&:focus-visible::before]:outline-none"
                        >
                            {props.title}
                        </LinkOverlayBase>
                    ) : (
                        props.title
                    )}
                </TextBase>
                {props.noMaker ? null : (
                    <TextBase as="span" variant="body" tone="muted" truncate className={line}>
                        {props.subtitle}
                    </TextBase>
                )}
                {person ? null : (
                    <TextBase
                        as="span"
                        variant="caption"
                        tone="muted"
                        className={`${row} flex items-center gap-2 overflow-hidden`}
                    >
                        {props.status ? (
                            <span className="truncate">{props.status}</span>
                        ) : (
                            <>
                                {props.meta ? <span className="truncate">{props.meta}</span> : null}
                                {props.quality ? <BadgeBase className="shrink-0">{props.quality}</BadgeBase> : null}
                            </>
                        )}
                    </TextBase>
                )}
                {props.noMaker ? <span aria-hidden="true" className={line} /> : null}
            </span>
        </StackBase>
    );

    if (!props.href && !props.onClick) return content;

    return (
        <LinkBoxBase className="group/media-item rounded-lg">
            {content}
            {!props.href && props.onClick ? (
                <button
                    {...tabbable}
                    type="button"
                    data-slot="action-overlay"
                    aria-label={label}
                    aria-pressed={props.selected === undefined ? undefined : props.selected}
                    className="absolute inset-0 z-1 w-full cursor-pointer rounded-lg outline-none"
                    onClick={props.onClick}
                />
            ) : null}
        </LinkBoxBase>
    );
}
