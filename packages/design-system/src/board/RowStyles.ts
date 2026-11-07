// What the board's rows share: the rule under a row, the focus ring of a row's own buttons, the action slot, and how
// the row the item dialog shows is marked.

/** The rule under a row, which takes no height, so every row of a type measures the same. */
export const ROW_RULE = 'shadow-[inset_0_-1px_var(--border)] last:shadow-none';
/** A row's own buttons draw their focus ring inside the pane that clips them. */
export const ROW_OPENS = 'focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-(--primary)';
/** What a row's action slot holds, centred and against its right edge. */
export const ROW_ACTION =
    'flex min-w-0 flex-wrap items-center justify-end gap-x-2 gap-y-1 text-right text-xs text-(--muted-foreground)';

/** A row the item dialog shows now: tinted and ringed. */
export const pickedRow = (picked: boolean) => (picked ? 'bg-(--accent) ring-2 ring-inset ring-(--primary)' : '');
