import { StateMessage, type StateMessageProps } from './StateMessage';

export type EmptyStateProps = StateMessageProps;

/**
 * A region with nothing to show yet: what would be here, why it is empty and what to do about it. `hero` owns a
 * marketing page (a missing page), `start` an app's page on its first run, with the steps under its actions, `page` a
 * page region (an empty library), `panel` is a quiet card among dashboard content, `compact` is
 * an empty list in a settings group or an archive (centred in the list's panel, with its add action: "No projects yet"
 * + "Add project"), and `inline` fits inside a panel, popover or drawer. Use PageError when the region could not be
 * shown.
 */
export function EmptyState(props: EmptyStateProps) {
    return <StateMessage {...props} tone="neutral" />;
}
