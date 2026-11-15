import { Children, type ComponentPropsWithoutRef, createContext, type ReactNode, useContext } from 'react';

import { SkeletonLoader } from '../feedback/SkeletonLoader';
import { tabbable } from '../foundations/KeyboardFocus';
import { StackBase } from '../layout/Flow';
import { LinkBoxBase, LinkOverlayBase } from '../typography/Link';
import { Text, TextBase } from '../typography/Typography';

const ResultListContext = createContext({ compact: false, listbox: true, card: false });

/** Set by ResultGroups around its one group, whose plain list then flows into the columns itself. */
const LoneGroupContext = createContext(false);

/** The grouped layout's column: 320px at least, as many as fit. */
const groupColumns = 'grid-cols-[repeat(auto-fit,minmax(min(20rem,100%),1fr))]';
const loneColumns = 'grid grid-cols-[repeat(auto-fill,minmax(min(20rem,100%),1fr))] gap-x-6 gap-y-1';

interface ResultGroupsProps {
    /** One Section per group, each holding a ResultList. */
    children: ReactNode;
}

/**
 * Result lists in groups (Music, Movies, People…), each a titled Section holding a ResultList: side by side in as
 * many 320px columns as fit, so two groups share the page instead of leaving a third of it empty. A lone group's rows
 * flow into those columns themselves (a plain list's), rather than one long list down the page's first column.
 */
export function ResultGroups({ children }: ResultGroupsProps) {
    const lone = Children.toArray(children).length === 1;

    return (
        <div data-slot="result-groups" className={`grid ${groupColumns} items-start gap-x-6 gap-y-8`}>
            <LoneGroupContext.Provider value={lone}>{children}</LoneGroupContext.Provider>
        </div>
    );
}

interface ResultListProps extends Omit<ComponentPropsWithoutRef<'div'>, 'className' | 'color' | 'role' | 'style'> {
    /** Names the list for screen readers, such as "Search results". */
    label: string;
    /** Results are on their way: placeholder rows take their place. */
    loading?: boolean;
    /** What screen readers hear while results load; the list's label by default. */
    loadingLabel?: string;
    /** `compact` rows for a palette or a menu; `default` for a page, where the list bleeds by its rows' padding
     *  (`row-inset`) so their text sits on the content edge. */
    density?: 'default' | 'compact';
    /** `listbox` (the default) for options to choose, with a ResultRow selected; `list` for plain links. */
    role?: 'listbox' | 'list';
    /** `choice` groups ResultChoice radio rows, with one action in the containing dialog’s footer.
     *  `plain` (the default) floats rows on the surface, for search results, a palette or a menu; `card` is a library's list on a
     *  page: unboxed and unruled, roomier rows, each its own rounded surface under the pointer and with focus inside.
     *  Every library list (videos, playlists, people, books, music) is a `card`. */
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
    const lone = useContext(LoneGroupContext);

    if (presentation === 'choice')
        return (
            <div {...props}>
                <fieldset
                    disabled={disabled}
                    aria-label={label}
                    data-presentation="choice"
                    className="surface-panel divide-line min-w-0 divide-y overflow-hidden rounded-xl border"
                >
                    {children}
                </fieldset>
            </div>
        );

    const card = presentation === 'card';
    const flows = lone && presentation === 'plain' && !loading;

    return (
        <ResultListContext.Provider value={{ compact: density === 'compact', listbox: role === 'listbox', card }}>
            <SkeletonLoader loading={loading} label={loadingLabel}>
                <div
                    {...props}
                    role={role}
                    aria-label={label}
                    aria-busy={loading || props['aria-busy']}
                    data-presentation={presentation}
                    // A page's list (not a compact palette or menu) bleeds by its rows' padding, so their text sits on
                    // the content edge and only the rounded hover fill reaches into the gutter.
                    className={`${density === 'compact' ? '' : '-mx-row-inset'} ${flows ? loneColumns : 'flex flex-col gap-1'}`}
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
    /** Extra detail under the subtitle, such as a year. */
    detail?: string;
    /** The result's state at the row's end, such as a StatusIndicator with its label ("Source missing"). It keeps its
     *  words; the title truncates first. */
    status?: ReactNode;
    /** The result's name. */
    title: string;
}

export function ResultRow(props: ResultRowProps | { loading: true }) {
    const { compact, listbox, card } = useContext(ResultListContext);
    const loading = 'loading' in props;
    const presentation = loading ? 'default' : props.presentation;
    // A row is its own rounded surface; on a card it is roomier, with the page's larger radius.
    const radius = card ? 'rounded-lg' : 'rounded-md';
    const classes = `grid w-full items-center text-left ${radius} ${compact ? 'px-2' : 'px-row-inset'} ${presentation === 'poster' ? 'grid-cols-[4rem_minmax(0,1fr)] gap-4 py-3' : presentation === 'video' ? 'grid-cols-[5rem_minmax(0,1fr)] gap-4 py-3 sm:grid-cols-[10rem_minmax(0,1fr)]' : presentation === 'icon' ? 'grid-cols-[1rem_minmax(0,1fr)] gap-3 py-2' : compact ? 'grid-cols-[2rem_minmax(0,1fr)] gap-2 py-1' : `grid-cols-[2.75rem_minmax(0,1fr)] gap-3 ${card ? 'py-2.5' : 'py-2'}`}`;
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
                            <LinkOverlayBase
                                href={props.href}
                                onNavigate={props.onSelect}
                                aria-current={props.current ? 'page' : undefined}
                                className={radius}
                            >
                                {props.title}
                            </LinkOverlayBase>
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
            {/* An implicit third column sized to the status, so the title's column gives way first. */}
            {!loading && props.status ? (
                <span className="col-start-3 row-start-1 flex items-center whitespace-nowrap">{props.status}</span>
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
        status: _status,
        title: _title,
        ...buttonProps
    } = props;

    const row =
        href && !listbox ? (
            <LinkBoxBase
                className={`${classes} hover:bg-fill-hover focus-within:bg-fill-hover has-[[aria-current=page]]:current transition-colors motion-reduce:transition-none`}
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
                className={`${classes} hover:bg-fill-hover aria-selected:current aria-[current=page]:current focus-ring-inset transition-colors disabled:pointer-events-none disabled:opacity-60 motion-reduce:transition-none`}
                onClick={onSelect}
            >
                {content}
            </button>
        );

    return listbox ? row : <div role="listitem">{row}</div>;
}
