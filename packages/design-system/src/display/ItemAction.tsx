import { Loading } from '@ninna-ui/feedback';
import { PencilIcon } from 'lucide-react';

export interface ItemActionProps {
    label: string;
    onClick?: () => void;
}

export function ItemAction({
    action,
    loading = false,
    loadingLabel,
}: {
    action?: ItemActionProps;
    loading?: boolean;
    loadingLabel?: string;
}) {
    const disabled = loading || !action?.onClick;

    if (!loading && !action) return null;

    return (
        <button
            type="button"
            aria-label={loading ? loadingLabel : action?.label}
            aria-hidden={loading && !loadingLabel ? true : undefined}
            aria-disabled={disabled}
            tabIndex={disabled ? -1 : 0}
            title={loading ? loadingLabel : action?.label}
            className={`bg-base-50/90 text-base-content focus-visible:outline-primary pointer-events-auto flex size-6 items-center justify-center rounded-full shadow-sm backdrop-blur-sm transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 motion-reduce:transition-none ${loading ? '' : 'opacity-0 group-hover/media-item:opacity-100 group-has-focus-visible/media-item:opacity-100 [@media(hover:none)]:opacity-100'} ${disabled ? 'cursor-default' : 'hover:bg-base-50 hover:text-primary cursor-pointer'}`}
            onClick={(event) => {
                event.stopPropagation();

                if (!disabled) action?.onClick?.();
            }}
        >
            {loading ? (
                <Loading
                    aria-hidden={!loadingLabel}
                    className="motion-reduce:animate-none"
                    color="primary"
                    label={loadingLabel ?? ''}
                    size="sm"
                    variant="spin"
                />
            ) : (
                <span className={`size-3.5 [&>svg]:size-full ${disabled ? 'opacity-40' : ''}`}>
                    <PencilIcon />
                </span>
            )}
        </button>
    );
}
