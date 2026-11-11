import { StateMessage, type StateMessageProps } from './StateMessage';

export type EmptyStateProps = StateMessageProps;

/**
 * A region with nothing to show yet: what would be here, why it is empty and what to do about it, on two scales.
 *
 * The hero: `start` owns an app's page (a first run, an empty board): the BrandMark as `artwork` on its `product`'s
 * halo, a 22/600 title, a 14/400 sentence, `md` buttons and the steps under them. Server's first run and Factory's "Add
 * your first project" are the same hero. `page` owns a page region (an empty library); `hero` a marketing page.
 *
 * The inline scale: `inline` is one muted line in a list or a panel's rows; `compact` a bare, centred 20px muted icon,
 * a 14/600 title, one 12px line and a secondary action in a grid, a panel or a settings list ("No projects yet" + "Add
 * project"), a search that finds nothing included; `panel` the same in a hairline panel of its own among dashboard
 * content. The bordered icon tile belongs to the hero alone. Use PageError when the region could not be shown.
 */
export function EmptyState(props: EmptyStateProps) {
    return <StateMessage {...props} tone="neutral" />;
}
