// Focus an overlay hands back to its trigger as it closes (a menu, a popover, a dialog) is not the reader reaching the
// trigger, so the trigger's tooltip stays shut: it opens on hover or on focus the reader moves (Tab, arrows). The
// overlays mark the hand-back in their close auto-focus; the mark lasts until the task that moves the focus is done.

let returning = false;

/** Marks the focus about to move as an overlay's hand-back; call it from an overlay's `onCloseAutoFocus`. */
export function markFocusReturn() {
    returning = true;
    setTimeout(() => {
        returning = false;
    }, 0);
}

/** Whether the focus moving now is an overlay's hand-back. */
export function isFocusReturn() {
    return returning;
}

/** An overlay content's `onCloseAutoFocus` that marks the hand-back, then runs the caller's own (in `props`), for
 *  spreading onto ninna-ui's content, which forwards the handler though its props type doesn't name it. */
export function quietFocusReturn(props: object): object {
    const own = (props as { onCloseAutoFocus?: (event: Event) => void }).onCloseAutoFocus;

    return {
        onCloseAutoFocus: (event: Event) => {
            markFocusReturn();
            own?.(event);
        },
    };
}
