/** A header's or a row's action slot: when its trailing control is a ghost Button (quiet or destructive-quiet, marked
 *  `data-settings-edge="ghost"`), the slot pulls that button's 12px inset past its edge, so a ghost action's label sits
 *  flush with the card or panel edge like a bordered action's edge does. It finds the ghost as the slot's last child,
 *  or the last child of a group in it (an Inline of actions), up to two groups deep. Every action slot in the design
 *  system applies it, so no caller adjusts a ghost action itself. */
export const ghostEdgeClassName = [
    '[&:has(>[data-settings-edge=ghost]:last-child)]:-me-3',
    '[&:has(>:last-child>[data-settings-edge=ghost]:last-child)]:-me-3',
    '[&:has(>:last-child>:last-child>[data-settings-edge=ghost]:last-child)]:-me-3',
].join(' ');
