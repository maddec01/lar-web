import { Loading } from '@ninna-ui/feedback';
import { PencilIcon } from 'lucide-react';

export interface ItemActionProps {
    /** Names the action, such as "Edit artwork". */
    label: string;
    /** Called when it is pressed; without it, the button shows but is held. */
    onClick?: () => void;
}

// The small round disc over the art's corner, for the pencil or the spinner.
const disc =
    'bg-surface-page/90 text-fg flex size-6 items-center justify-center rounded-full shadow-(--shadow-raised) backdrop-blur-sm';

function spinner(label: string | undefined) {
    return (
        <Loading
            aria-hidden={!label}
            className="motion-reduce:animate-none"
            color="primary"
            label={label ?? ''}
            size="sm"
            variant="spin"
        />
    );
}

/**
 * A media item's small round pencil, over its artwork's corner, shown on hover or focus; while something runs, a
 * spinner in its place (a plain status, not a button, when there is no action to press).
 */
export function ItemAction({
    action,
    loading = false,
    loadingLabel,
}: {
    /** What the pencil does; without it (and not loading), nothing shows. */
    action?: ItemActionProps;
    /** Spins in the pencil's place while the action runs. */
    loading?: boolean;
    /** Names the running action for screen readers, such as "Saving artwork". */
    loadingLabel?: string;
}) {
    const disabled = loading || !action?.onClick;

    if (!loading && !action) return null;

    // Only a spinner, with nothing to press: not a button, so it can sit inside a card or a tab that is one.
    if (!action)
        return (
            <span
                aria-hidden={loadingLabel ? undefined : true}
                title={loadingLabel}
                className={`${disc} pointer-events-auto`}
            >
                {spinner(loadingLabel)}
            </span>
        );

    return (
        <button
            type="button"
            aria-label={loading ? loadingLabel : action?.label}
            aria-hidden={loading && !loadingLabel ? true : undefined}
            aria-disabled={disabled}
            tabIndex={disabled ? -1 : 0}
            title={loading ? loadingLabel : action?.label}
            className={`${disc} focus-ring pointer-events-auto transition-colors duration-(--motion-duration-fast) motion-reduce:transition-none ${loading ? '' : 'opacity-0 group-hover/media-item:opacity-100 group-has-focus-visible/media-item:opacity-100 [@media(hover:none)]:opacity-100'} ${disabled ? 'cursor-default' : 'hover:bg-surface-page hover:text-primary-fg cursor-pointer'}`}
            onClick={(event) => {
                event.stopPropagation();

                if (!disabled) action?.onClick?.();
            }}
        >
            {loading ? (
                spinner(loadingLabel)
            ) : (
                <span className={`size-3.5 [&>svg]:size-full ${disabled ? 'opacity-40' : ''}`}>
                    <PencilIcon />
                </span>
            )}
        </button>
    );
}
