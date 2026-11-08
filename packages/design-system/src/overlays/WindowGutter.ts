/** Every popup (popover, menu) keeps the app's page gutter, 16px (`gutter-app`), from the window's edges, so a menu
 *  never runs past the line the page's content keeps to: a popup that would cross it shifts along the edge and stays
 *  beside its trigger. */
export const windowGutter = 16;

/** The positioning engine's collision padding, spread onto a popup's content (ninna-ui forwards it, but its props type
 *  doesn't name it). */
export const windowGutterProps: object = { collisionPadding: windowGutter };
