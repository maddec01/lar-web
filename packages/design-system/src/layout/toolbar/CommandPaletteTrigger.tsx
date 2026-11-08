import { SearchIcon } from 'lucide-react';
import {
    forwardRef,
    type ReactNode,
    type Ref,
    type RefObject,
    useEffect,
    useEffectEvent,
    useImperativeHandle,
    useLayoutEffect,
    useRef,
    useState,
} from 'react';

import { BadgeBase } from '../../display/Badge';
import { Kbd } from '../../display/Kbd';
import { tabbable } from '../../foundations/KeyboardFocus';
import { applePlatform, isShortcut } from '../../foundations/KeyboardShortcut';
import { fitTrigger, useTriggerRoom } from './TriggerFit';

/** What narrows the palette, shown in the trigger as a small chip. */
export interface CommandPaletteTriggerToken {
    id: string;
    label: string;
    /** An icon or colour mark before the label. */
    leading?: ReactNode;
    /** A lar-brand app hue that colours the chip, as a kind's badge. */
    hue?: number;
}

interface CommandPaletteTriggerProps {
    label: string;
    onOpen: () => void;
    /** Key that opens the palette from anywhere, pressed with ⌘ on Apple devices and Ctrl elsewhere. */
    shortcut: string;
    /** What narrows the palette now, such as filters. With tokens, the trigger measures its own room: the chips go
     *  into a count from the last, then it folds to its icon. */
    tokens?: readonly CommandPaletteTriggerToken[];
    /** The accessible name's addition while tokens show, such as "filtered by bug, docs". */
    filterLabel?: (labels: readonly string[]) => string;
}

/** A token as the design system's badge, in its kind's hue when it has one. */
function TokenChip({ token }: { token: CommandPaletteTriggerToken }) {
    return (
        <BadgeBase title={token.label} hue={token.hue} className="shrink-0 [&_svg]:size-3">
            {token.leading}
            <span className="max-w-32 min-w-0 truncate">{token.label}</span>
        </BadgeBase>
    );
}

/** The trigger's one look, with tokens or without, in every app: a 28px field (16px magnifier, 14px muted word, the key
 *  hint at its end) on the control surface, or, folded, the title bar's 28px icon button. No prop changes it. */
const look = {
    base: 'focus-ring relative flex h-7 shrink-0 cursor-pointer items-center transition-colors [&>svg]:size-4 [&>svg]:shrink-0',
    field: 'border-line bg-surface-control text-fg-muted hover:border-line-hover hover:text-fg-soft gap-2 rounded-lg border px-2.5 text-sm',
    folded: 'hover:bg-fill-hover hover:text-fg w-7 justify-center rounded-md text-(--color-header-icon)',
} as const;

/** lar-server's title bar folds the field below this width (the TitleBar's `@2xl`). */
const WIDE_BAR = 672;

/** The width of the title bar holding `element`, kept as it resizes. */
function useBarWidth(element: RefObject<HTMLElement | null>) {
    const [width, setWidth] = useState(0);

    useLayoutEffect(() => {
        const bar = element.current?.closest('header') ?? element.current?.parentElement;

        if (!bar) return;

        const measure = () => setWidth(bar.getBoundingClientRect().width);

        measure();

        // Where nothing reports resizes (a test's DOM), the first measure stands.
        if (typeof ResizeObserver === 'undefined') return;

        const observer = new ResizeObserver(measure);

        observer.observe(bar);

        return () => observer.disconnect();
    }, [element]);

    return width;
}

/** The title bar's way into the command palette: a quiet field-like button with its shortcut, folding to its
 *  icon when the title bar is narrow. With tokens, it also says what narrows the palette. Both apps draw the same
 *  field: its look has no props. */
export const CommandPaletteTrigger = forwardRef<HTMLButtonElement, CommandPaletteTriggerProps>(
    ({ label, onOpen, shortcut, tokens, filterLabel }, ref) => {
        const button = useRef<HTMLButtonElement>(null);
        const openFromShortcut = useEffectEvent((event: KeyboardEvent) => {
            // An open dialog hides the page behind it, the trigger included.
            if (!isShortcut(event, shortcut) || button.current?.closest('[aria-hidden="true"]')) return;

            event.preventDefault();
            onOpen();
        });

        useImperativeHandle(ref, () => button.current!);
        useEffect(() => {
            const listener = (event: KeyboardEvent) => openFromShortcut(event);

            document.addEventListener('keydown', listener);

            return () => document.removeEventListener('keydown', listener);
        }, []);

        const keys = `${applePlatform ? 'Meta' : 'Control'}+${shortcut.toUpperCase()}`;
        const hint = applePlatform ? `⌘${shortcut.toUpperCase()}` : `Ctrl ${shortcut.toUpperCase()}`;

        if (tokens)
            return (
                <FittedTrigger
                    button={button}
                    label={label}
                    onOpen={onOpen}
                    tokens={tokens}
                    filterLabel={filterLabel}
                    keys={keys}
                    hint={hint}
                />
            );

        return <PlainTrigger button={button} label={label} onOpen={onOpen} keys={keys} hint={hint} />;
    },
);

/** The trigger without tokens: the field at its least width (TriggerFit's), folded on a title bar under 42rem. */
function PlainTrigger({
    button,
    label,
    onOpen,
    keys,
    hint,
}: {
    button: RefObject<HTMLButtonElement | null>;
    label: string;
    onOpen: () => void;
    keys: string;
    hint: string;
}) {
    const folded = useBarWidth(button) < WIDE_BAR;

    return (
        <button
            {...tabbable}
            ref={button}
            type="button"
            data-search-field
            data-folded={folded || undefined}
            aria-haspopup="dialog"
            aria-keyshortcuts={keys}
            onClick={onOpen}
            className={`${look.base} ${folded ? look.folded : `${look.field} w-56`}`}
        >
            <SearchIcon aria-hidden="true" />
            <span className={folded ? 'sr-only' : 'min-w-0 flex-1 truncate text-left'}>{label}</span>
            {folded ? null : (
                <span className="shrink-0 pointer-coarse:hidden">
                    <Kbd>{hint}</Kbd>
                </span>
            )}
        </button>
    );
}

CommandPaletteTrigger.displayName = 'CommandPaletteTrigger';

/** The trigger with tokens, up to 26rem wide: it measures its room and the chips in a hidden copy, then shows what
 *  fits (TriggerFit.ts). */
function FittedTrigger({
    button,
    label,
    onOpen,
    tokens,
    filterLabel,
    keys,
    hint,
}: {
    button: Ref<HTMLButtonElement>;
    label: string;
    onOpen: () => void;
    tokens: readonly CommandPaletteTriggerToken[];
    filterLabel?: (labels: readonly string[]) => string;
    keys: string;
    hint: string;
}) {
    const wrapper = useRef<HTMLDivElement>(null);
    const ghost = useRef<HTMLDivElement>(null);
    const { room, widths } = useTriggerRoom(wrapper, ghost, tokens.map(({ id }) => id).join());
    const { shown, keyHint, folded, width } = fitTrigger(room, widths);
    const hidden = tokens.slice(shown);
    const labels = tokens.map((token) => token.label);

    return (
        <div ref={wrapper} className="relative ml-auto flex max-w-104 min-w-0 flex-1 justify-end">
            <div
                ref={ghost}
                aria-hidden="true"
                className="invisible absolute right-0 flex h-0 w-max gap-1 overflow-hidden"
            >
                {tokens.map((token) => (
                    <TokenChip key={token.id} token={token} />
                ))}
            </div>
            <button
                {...tabbable}
                ref={button}
                type="button"
                data-search-field
                data-folded={folded || undefined}
                aria-haspopup="dialog"
                aria-keyshortcuts={keys}
                aria-description={tokens.length && filterLabel ? filterLabel(labels) : undefined}
                onClick={onOpen}
                style={folded ? undefined : { width }}
                className={`${look.base} ${folded ? look.folded : look.field}`}
            >
                <SearchIcon aria-hidden="true" />
                {folded ? <span className="sr-only">{label} </span> : null}
                {folded ? (
                    tokens.length > 0 && (
                        <span
                            data-search-count
                            className="bg-primary text-2xs text-primary-content absolute -top-0.5 -right-0.5 grid h-3.5 min-w-3.5 place-items-center rounded-full px-0.5 leading-none font-semibold tabular-nums"
                        >
                            {tokens.length}
                        </span>
                    )
                ) : (
                    <>
                        {tokens.length > 0 && (
                            <span className="flex shrink-0 items-center gap-1">
                                {tokens.slice(0, shown).map((token) => (
                                    <TokenChip key={token.id} token={token} />
                                ))}
                                {hidden.length > 0 && (
                                    <BadgeBase
                                        data-search-count
                                        title={hidden.map((token) => token.label).join(', ')}
                                        className="shrink-0 tabular-nums"
                                    >
                                        {shown > 0 ? '+' : ''}
                                        {hidden.length}
                                    </BadgeBase>
                                )}
                            </span>
                        )}
                        <span className="min-w-0 flex-1 truncate text-left">{label}</span>
                        {keyHint && (
                            <span className="shrink-0 pointer-coarse:hidden">
                                <Kbd>{hint}</Kbd>
                            </span>
                        )}
                    </>
                )}
            </button>
        </div>
    );
}
