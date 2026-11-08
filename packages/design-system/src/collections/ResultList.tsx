import { ChevronRightIcon } from 'lucide-react';
import { type ComponentPropsWithoutRef, createContext, type ReactNode, useContext } from 'react';

import { SkeletonLoader } from '../feedback/SkeletonLoader';
import { tabbable } from '../foundations/KeyboardFocus';
import { StackBase } from '../layout/Flow';
import { LinkBoxBase, LinkOverlay } from '../typography/Link';
import { Text, TextBase } from '../typography/Typography';

const ResultListContext = createContext({ compact: false, listbox: true, card: false });

interface ResultListProps extends Omit<ComponentPropsWithoutRef<'div'>, 'className' | 'color' | 'role' | 'style'> {
    /** Names the list for screen readers, such as "Search results". */
    label: string;
    /** Results are on their way: placeholder rows take their place. */
    loading?: boolean;
    /** What screen readers hear while results load; the list's label by default. */
    loadingLabel?: string;
    /** `compact` rows for a palette or a menu; `default` for a page. */
    density?: 'default' | 'compact';
    /** `listbox` (the default) for options to choose, with a ResultRow selected; `list` for plain links. */
    role?: 'listbox' | 'list';
    /** `choice` groups ResultChoice radio rows, with one action in the containing dialog’s footer.
     *  `plain` (the default) floats rows on the surface, for a palette or a menu; `card` is a library's list on a
     *  page: one card (the card surface and depth every app card has), a hairline between rows, and a chevron at the
     *  end of every row that opens a page. Every library list (videos, playlists, people, books, music) is a `card`. */
    presentation?: 'plain' | 'card' | 'choice';
    /** Disables every radio in a choice list. */
    disabled?: boolean;
}

export function ResultList({
    children,
    label,
    loading = false,
    loadingLabel = label,
    density = 'default',
    role = 'listbox',
    presentation = 'plain',
    disabled = false,
    ...props
}: ResultListProps) {
    if (presentation === 'choice')
        return (
            <div {...props}>
                <fieldset
                    disabled={disabled}
                    aria-label={label}
                    data-presentation="choice"
                    className="border-line bg-fill-muted/50 divide-line min-w-0 divide-y overflow-hidden rounded-lg border"
                >
                    {children}
                </fieldset>
            </div>
        );

    const card = presentation === 'card';

    return (
        <ResultListContext.Provider value={{ compact: density === 'compact', listbox: role === 'listbox', card }}>
            <SkeletonLoader loading={loading} label={loadingLabel}>
                <div
                    {...props}
                    role={role}
                    aria-label={label}
                    aria-busy={loading || props['aria-busy']}
                    data-presentation={presentation}
                    className={
                        card
                            ? 'surface-card divide-line flex flex-col divide-y overflow-hidden rounded-xl border'
                            : 'flex flex-col gap-1'
                    }
                >
                    {loading ? Array.from({ length: 8 }, (_, index) => <ResultRow key={index} loading />) : children}
                </div>
            </SkeletonLoader>
        </ResultListContext.Provider>
    );
}

export interface ResultRowProps extends Pick<
    ComponentPropsWithoutRef<'button'>,
    'disabled' | 'id' | 'onPointerMove' | 'tabIndex'
> {
    /** The result's art or icon, at the row's start. */
    artwork: ReactNode;
    /** What the result is, such as "Album", read before its title. */
    kind: string;
    /** Called as the reader chooses the result. */
    onSelect: () => void;
    /** The result's page, making the row a link. */
    href?: string;
    /** The option the keyboard is on, in a listbox. */
    selected?: boolean;
    /** `icon` sets a small glyph in a narrow column; `default` shows artwork. */
    presentation?: 'default' | 'icon' | 'poster' | 'video';
    /** The page shown now, marked as current. */
    current?: boolean;
    /** A line under the title, such as an artist. */
    subtitle?: string;
    /** Extra detail at the row's end, such as a year. */
    detail?: string;
    /** The result's name. */
    title: string;
}

export function ResultRow(props: ResultRowProps | { loading: true }) {
    const { compact, listbox, card } = useContext(ResultListContext);
    const loading = 'loading' in props;
    const presentation = loading ? 'default' : props.presentation;
    // On a card, every row that opens a page ends in a chevron, and rows sit edge to edge between hairlines.
    const chevron = presentation === 'poster' || presentation === 'video' || (card && !loading && Boolean(props.href));
    const classes = `grid w-full items-center text-left ${card ? 'rounded-none px-4' : 'rounded-md px-2'} ${presentation === 'poster' ? 'grid-cols-[4rem_minmax(0,1fr)_auto] gap-4 py-3' : presentation === 'video' ? 'grid-cols-[5rem_minmax(0,1fr)_auto] gap-4 py-3 sm:grid-cols-[10rem_minmax(0,1fr)_auto]' : presentation === 'icon' ? `${chevron ? 'grid-cols-[1rem_minmax(0,1fr)_auto]' : 'grid-cols-[1rem_minmax(0,1fr)]'} gap-3 py-2` : compact ? 'grid-cols-[2rem_minmax(0,1fr)] gap-2 py-1' : `${chevron ? 'grid-cols-[2.75rem_minmax(0,1fr)_auto]' : 'grid-cols-[2.75rem_minmax(0,1fr)]'} gap-3 ${card ? 'py-2.5' : 'py-2'}`}`;
    const content = (
        <>
            {loading ? (
                <SkeletonLoader.Shape presentation="artwork" />
            ) : presentation === 'icon' ? (
                <span aria-hidden="true" className="text-fg-muted flex size-4 [&_svg]:size-4">
                    {props.artwork}
                </span>
            ) : (
                props.artwork
            )}
            <StackBase space="none" className="min-w-0">
                <Text as="span" variant="label" truncate loading={loading}>
                    {!loading &&
                        (props.href && !listbox ? (
                            <LinkOverlay
                                href={props.href}
                                onNavigate={props.onSelect}
                                aria-current={props.current ? 'page' : undefined}
                            >
                                {props.title}
                            </LinkOverlay>
                        ) : (
                            props.title
                        ))}
                </Text>
                <Text as="span" variant="caption" tone="muted" truncate loading={loading}>
                    {!loading && (props.subtitle ?? props.kind)}
                </Text>
                {!loading && props.detail ? (
                    <TextBase as="span" variant="caption" tone="muted" className="line-clamp-2 wrap-break-word">
                        {props.detail}
                    </TextBase>
                ) : null}
            </StackBase>
            {!loading && props.subtitle && props.kind !== props.subtitle ? (
                <span className="sr-only"> {props.kind}</span>
            ) : null}
            {chevron ? (
                <span aria-hidden="true" className="text-fg-muted flex [&>svg]:size-4">
                    <ChevronRightIcon />
                </span>
            ) : null}
        </>
    );

    if (loading) return <div className={classes}>{content}</div>;

    const {
        artwork: _artwork,
        href,
        kind: _kind,
        onSelect,
        selected = false,
        presentation: _presentation,
        current = false,
        subtitle: _subtitle,
        detail: _detail,
        title: _title,
        ...buttonProps
    } = props;

    const row =
        href && !listbox ? (
            <LinkBoxBase
                className={`${classes} ${card ? 'hover:bg-fill-hover focus-within:bg-fill-hover' : 'hover:bg-surface-raised focus-within:bg-surface-raised'} has-[[aria-current=page]]:bg-surface-raised has-[[aria-current=page]]:ring-line has-[[aria-current=page]]:ring-1`}
            >
                {content}
            </LinkBoxBase>
        ) : (
            <button
                {...tabbable}
                {...buttonProps}
                type="button"
                role={listbox ? 'option' : undefined}
                aria-selected={listbox ? selected : undefined}
                aria-current={current ? 'page' : undefined}
                className={`${classes} hover:bg-surface-raised aria-selected:bg-primary-surface aria-selected:ring-primary-ring focus-ring disabled:pointer-events-none disabled:opacity-60 aria-selected:ring-1 aria-selected:ring-inset`}
                onClick={onSelect}
            >
                {content}
            </button>
        );

    return listbox ? row : <div role="listitem">{row}</div>;
}
