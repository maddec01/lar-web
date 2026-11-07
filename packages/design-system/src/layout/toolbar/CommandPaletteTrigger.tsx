import { SearchIcon } from 'lucide-react';
import {
    type CSSProperties,
    forwardRef,
    type ReactNode,
    type Ref,
    useEffect,
    useEffectEvent,
    useImperativeHandle,
    useRef,
} from 'react';

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

const chip =
    'inline-flex h-5 shrink-0 items-center gap-1 rounded-sm bg-base-200 px-1 text-2xs font-medium text-base-800 dark:bg-base-300 dark:text-base-content [&_svg]:size-3';

function TokenChip({ token }: { token: CommandPaletteTriggerToken }) {
    const hued = token.hue !== undefined;

    return (
        <span
            title={token.label}
            className={`${chip} ${hued ? 'kind-badge!' : ''}`}
            style={hued ? ({ '--lar-kind-hue': token.hue } as CSSProperties) : undefined}
        >
            {token.leading}
            <span className="max-w-32 min-w-0 truncate">{token.label}</span>
        </span>
    );
}

/** The title bar's way into the command palette: a quiet field-like button with its shortcut, folding to its
 *  icon when the title bar is narrow. With tokens, it also says what narrows the palette. */
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

        return (
            <button
                {...tabbable}
                ref={button}
                type="button"
                aria-label={label}
                aria-haspopup="dialog"
                aria-keyshortcuts={keys}
                onClick={onOpen}
                className="text-base-600 hover:bg-base-200 hover:text-base-content focus-visible:outline-primary @2xl:border-base-300 @2xl:bg-base-100 @2xl:hover:border-base-400 @2xl:hover:bg-base-100 dark:@2xl:bg-base-200 flex size-7 items-center justify-center gap-2 rounded-lg text-sm transition-colors focus-visible:outline-2 @2xl:w-56 @2xl:justify-start @2xl:border @2xl:px-2.5 [&>svg]:size-4 [&>svg]:shrink-0"
            >
                <SearchIcon />
                <span className="hidden flex-1 text-left @2xl:inline">{label}</span>
                <span className="hidden pointer-fine:@2xl:inline">
                    <Kbd>{hint}</Kbd>
                </span>
            </button>
        );
    },
);

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
        <div ref={wrapper} className="relative ml-auto flex max-w-[26rem] min-w-0 flex-1 justify-end">
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
                aria-label={tokens.length && filterLabel ? `${label}, ${filterLabel(labels)}` : label}
                onClick={onOpen}
                style={folded ? undefined : { width }}
                className={`text-base-700 focus-visible:outline-primary relative flex h-7 shrink-0 cursor-pointer items-center rounded-lg text-xs transition-colors focus-visible:outline-2 ${
                    folded
                        ? 'hover:bg-base-200 hover:text-base-content dark:hover:bg-base-300 w-7 justify-center'
                        : 'border-base-300 bg-base-100 hover:border-base-400 dark:bg-base-200 gap-1 border pr-2 pl-1.5'
                }`}
            >
                <SearchIcon aria-hidden="true" className={`shrink-0 ${folded ? 'size-4' : 'mr-0.5 size-3.5'}`} />
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
                        {tokens.slice(0, shown).map((token) => (
                            <TokenChip key={token.id} token={token} />
                        ))}
                        {hidden.length > 0 && (
                            <span
                                data-search-count
                                title={hidden.map((token) => token.label).join(', ')}
                                className={`${chip} tabular-nums`}
                            >
                                {shown > 0 ? '+' : ''}
                                {hidden.length}
                            </span>
                        )}
                        <span className="ml-0.5 min-w-0 flex-1 truncate text-left">{label}</span>
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
