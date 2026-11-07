import { ChevronRightIcon } from 'lucide-react';
import { type ComponentPropsWithoutRef, createContext, type ReactNode, useContext } from 'react';

import { SkeletonLoader } from '../feedback/SkeletonLoader';
import { tabbable } from '../foundations/KeyboardFocus';
import { Stack } from '../layout/Flow';
import { LinkBox, LinkOverlay } from '../typography/Link';
import { Text } from '../typography/Typography';

const ResultListContext = createContext({ compact: false, listbox: true });

interface ResultListProps extends Omit<ComponentPropsWithoutRef<'div'>, 'className' | 'style'> {
    label: string;
    loading?: boolean;
    loadingLabel?: string;
    density?: 'compact' | 'comfortable';
}

export function ResultList({
    children,
    label,
    loading = false,
    loadingLabel = label,
    density = 'comfortable',
    role = 'listbox',
    ...props
}: ResultListProps) {
    return (
        <ResultListContext.Provider value={{ compact: density === 'compact', listbox: role === 'listbox' }}>
            <SkeletonLoader loading={loading} label={loadingLabel}>
                <div
                    {...props}
                    role={role}
                    aria-label={label}
                    aria-busy={loading || props['aria-busy']}
                    className="flex flex-col gap-1"
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
    artwork: ReactNode;
    kind: string;
    onSelect: () => void;
    href?: string;
    selected?: boolean;
    /** `icon` sets a small glyph in a narrow column; `default` shows artwork. */
    presentation?: 'default' | 'icon' | 'poster' | 'video';
    current?: boolean;
    subtitle?: string;
    detail?: string;
    title: string;
}

export function ResultRow(props: ResultRowProps | { loading: true }) {
    const { compact, listbox } = useContext(ResultListContext);
    const loading = 'loading' in props;
    const presentation = loading ? 'default' : props.presentation;
    const classes = `grid w-full items-center rounded-md px-2 text-left ${presentation === 'poster' ? 'grid-cols-[4rem_minmax(0,1fr)_auto] gap-4 py-3' : presentation === 'video' ? 'grid-cols-[5rem_minmax(0,1fr)_auto] gap-4 py-3 sm:grid-cols-[10rem_minmax(0,1fr)_auto]' : presentation === 'icon' ? 'grid-cols-[1rem_minmax(0,1fr)] gap-3 py-2' : compact ? 'grid-cols-[2rem_minmax(0,1fr)] gap-2 py-1' : 'grid-cols-[2.75rem_minmax(0,1fr)] gap-3 py-2'}`;
    const content = (
        <>
            {loading ? (
                <SkeletonLoader.Shape presentation="artwork" />
            ) : presentation === 'icon' ? (
                <span aria-hidden="true" className="text-base-600 flex size-4 [&_svg]:size-4">
                    {props.artwork}
                </span>
            ) : (
                props.artwork
            )}
            <Stack space="none" className="min-w-0">
                <Text as="span" variant="label" truncate loading={loading}>
                    {!loading &&
                        (props.href && !listbox ? (
                            <LinkOverlay
                                href={props.href}
                                onNavigate={props.onSelect}
                                aria-label={resultLabel(props)}
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
                    <Text as="span" variant="caption" tone="muted" className="line-clamp-2 wrap-break-word">
                        {props.detail}
                    </Text>
                ) : null}
            </Stack>
            {presentation === 'poster' || presentation === 'video' ? (
                <span aria-hidden="true" className="text-base-500 flex [&>svg]:size-4">
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
            <LinkBox
                className={`${classes} hover:bg-base-100 focus-within:bg-base-100 has-[[aria-current=page]]:bg-base-100 has-[[aria-current=page]]:ring-base-300 has-[[aria-current=page]]:ring-1`}
            >
                {content}
            </LinkBox>
        ) : (
            <button
                {...tabbable}
                {...buttonProps}
                type="button"
                role={listbox ? 'option' : undefined}
                aria-label={resultLabel(props)}
                aria-selected={listbox ? selected : undefined}
                aria-current={current ? 'page' : undefined}
                className={`${classes} hover:bg-base-100 aria-selected:bg-primary/10 aria-selected:ring-primary/30 focus-visible:outline-primary focus-visible:outline-2 disabled:pointer-events-none disabled:opacity-60 aria-selected:ring-1 aria-selected:ring-inset`}
                onClick={onSelect}
            >
                {content}
            </button>
        );

    return listbox ? row : <div role="listitem">{row}</div>;
}

/** The row's accessible name: what it shows, then its kind, so two rows with one title still differ. */
function resultLabel({ title, subtitle, kind }: ResultRowProps): string {
    return [title, subtitle, kind].filter(Boolean).join(', ');
}

export function ResultEmpty({ children }: { children: ReactNode }) {
    return (
        <Text as="span" tone="muted" className="px-3 py-4 text-center">
            {children}
        </Text>
    );
}
