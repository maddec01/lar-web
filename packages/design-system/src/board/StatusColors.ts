// The board's statuses and the colour each is drawn in (board/tokens.css's --st-* colours).

/** A piece of work's status on the board. */
export type BoardStatus =
    | 'List'
    | 'Queued'
    | 'Shaping'
    | 'Needs you'
    | 'Ready'
    | 'In progress'
    | 'Review'
    | 'Verify'
    | 'Ready to merge'
    | 'Done';

/** Each status's colour, as a CSS colour value. */
export const statusColor: Record<BoardStatus, string> = {
    List: 'var(--st-idle)',
    Queued: 'var(--st-idle)',
    Shaping: 'var(--st-now)',
    'Needs you': 'var(--st-amber)',
    Ready: 'var(--st-now)',
    'In progress': 'var(--st-now)',
    Review: 'var(--st-review)',
    Verify: 'var(--st-amber)',
    'Ready to merge': 'var(--st-done)',
    Done: 'var(--st-done)',
};
