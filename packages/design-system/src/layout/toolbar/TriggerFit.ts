// What the command palette trigger shows, with tokens, in the room it has. Tokens go from the last, into a count,
// while the word Search and the count still fit; the key hint shows only with every token and room to spare; below the
// word's room, or on the narrowest title bar, the field folds to its magnifier with a count. Widths are in pixels, in
// the field's `text-xs`.
import { type RefObject, useLayoutEffect, useState } from 'react';

/** The field's borders, left padding, 16px magnifier, gap and right padding. */
const CHROME = 48;
const SEARCH_WORD = 48;
const COUNT = 24;
const KEY_HINT = 26;
const GAP = 4;
/** lar-server's trigger width, which the field keeps until its tokens ask for more. */
const MIN_WIDTH = 224;
/** Up to this title bar width, the smallest phones', the field folds. Its row there still has room for the word, as the
 *  bar gives its actions their own row, so the room alone would never fold it. */
const NARROWEST_BAR = 340;

interface FieldRoom {
    /** What the field may fill. */
    field: number;
    /** The title bar's width. */
    bar: number;
}

export interface TriggerFit {
    /** How many tokens show; the rest are in the count. */
    shown: number;
    keyHint: boolean;
    folded: boolean;
    width: number;
}

export function fitTrigger({ field: room, bar }: FieldRoom, tokenWidths: readonly number[]): TriggerFit {
    const tokens = (count: number) => tokenWidths.slice(0, count).reduce((sum, width) => sum + width + GAP, 0);
    const used = (count: number) =>
        CHROME + SEARCH_WORD + tokens(count) + (count < tokenWidths.length ? COUNT + GAP : 0);
    let shown = tokenWidths.length;

    while (shown > 0 && used(shown) > room) shown--;

    return {
        shown,
        keyHint: shown === tokenWidths.length && used(shown) + KEY_HINT + GAP <= room,
        folded: bar <= NARROWEST_BAR || used(shown) > room,
        width: Math.min(room, Math.max(MIN_WIDTH, used(tokenWidths.length) + KEY_HINT + GAP)),
    };
}

/** The room in `wrapper` and the title bar holding it, and each child's width in `ghost`, which draws every token out of
 *  sight to be measured. */
export function useTriggerRoom(
    wrapper: RefObject<HTMLElement | null>,
    ghost: RefObject<HTMLElement | null>,
    tokens: string,
) {
    const [room, setRoom] = useState({ field: 0, bar: 0 });
    const [widths, setWidths] = useState<number[]>([]);

    useLayoutEffect(() => {
        const measure = () => {
            setRoom({
                field: wrapper.current!.getBoundingClientRect().width,
                bar: (wrapper.current!.closest('header') ?? wrapper.current!).getBoundingClientRect().width,
            });

            const next = [...ghost.current!.children].map((child) => (child as HTMLElement).offsetWidth);

            setWidths((now) => (now.join() === next.join() ? now : next));
        };

        measure();

        // The ghost resizes too when a late web font changes the tokens' widths.
        const observer = new ResizeObserver(measure);

        observer.observe(wrapper.current!);
        observer.observe(ghost.current!);

        return () => observer.disconnect();
    }, [wrapper, ghost, tokens]);

    return { room, widths };
}
