import { StateMessage, type StateMessageProps } from './StateMessage';

export interface PageErrorProps extends StateMessageProps {
    /** `danger` for a failure, `warning` for temporary unavailability, `neutral` for absence or no permission. 404 always uses neutral. */
    tone?: 'danger' | 'warning' | 'neutral';
    /** A short label above the title, such as “404” or “Error 503”. */
    code?: string;
}

/**
 * A page or region that could not be shown: not found, failed to load, unavailable. Say what happened in the title, the
 * likely cause in the description, and offer the way forward (try again, go home) as its actions; put technical
 * details in the `footer`. Use EmptyState for a region with nothing in it, and Alert for an operation's result.
 */
export function PageError({ tone = 'danger', code, ...props }: PageErrorProps) {
    return <StateMessage {...props} tone={code === '404' ? 'neutral' : tone} eyebrow={code} />;
}
