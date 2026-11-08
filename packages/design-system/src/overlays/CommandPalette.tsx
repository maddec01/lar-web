/* oxlint-disable react/only-export-components -- The option hook belongs to the palette. */

import { Modal as NinnaModal } from '@ninna-ui/overlays';
import { CheckIcon, SearchIcon, XIcon } from 'lucide-react';
import { createContext, type ReactNode, useContext, useEffect, useId, useRef, useState } from 'react';

import { IconButton } from '../actions/IconButton';
import { ResultList } from '../collections/ResultList';
import { Kbd } from '../display/Kbd';
import { type DesignSystemLabels, useDesignSystemLabels } from '../foundations/DesignSystemProvider';
import { TextBase } from '../typography/Typography';
import { useModalAutoFocus } from './useModalAutoFocus';
import { useScrollFade } from './useScrollFade';

/** A chip before the field for something that narrows the list, such as a filter. */
export interface CommandPaletteToken {
    id: string;
    label: string;
    /** An icon or colour mark before the label. */
    leading?: ReactNode;
    /** A button on the chip that takes it away; the focus stays in the field. */
    remove?: { label: string; onRemove: () => void };
}

interface CommandPaletteProps {
    /** The dialog's accessible title and description; the field says the rest. */
    label: string;
    /** What the palette is for, read as the dialog's description. */
    description: string;
    /** The field's placeholder, such as "Search or jump to…". */
    placeholder: string;
    /** The field's text, for a controlled palette. */
    query: string;
    /** Called with the field's text as the reader types. */
    onQueryChange: (query: string) => void;
    /** Narrows the list to one level, shown as a chip before the field; Backspace in an empty field leaves it. */
    scope?: { label: string; leaveLabel: string; onLeave: () => void };
    /** Chips before the field, such as active filters, which wrap and scroll on their own when there are many. A
     *  palette given tokens, even none, is a filtering search, as wide as its chips need. */
    tokens?: readonly CommandPaletteToken[];
    /** Backspace in an empty field, such as to take the last token away. */
    onBackspaceEmpty?: () => void;
    /** A control after the field, such as Clear. A press on it leaves the focus in the field. */
    trailing?: ReactNode;
    /** The options' values in list order, for the arrow keys and Enter. */
    options: readonly string[];
    /** May return the option the highlight moves to, when choosing changes the list. */
    onSelect: (value: string) => string | void;
    /** Called as the reader closes the palette. */
    onClose: () => void;
    /** Names the list of options for screen readers. */
    listLabel: string;
    /** Marks the list busy while more may arrive; `busyLabel` shows under it meanwhile. */
    busy?: boolean;
    /** What the list says while results are on their way. */
    busyLabel?: ReactNode;
    /** Shown when nothing is listed and nothing is pending. */
    empty?: ReactNode;
    /** This palette's words for the key hints under the list (shown on screens with a keyboard), in place of the
     *  design system's, which DesignSystemProvider translates for the whole app. The palette owns the hints
     *  themselves: ↑↓ move, ↵ select, esc close, and ⌫ remove filter (or back) while a token or scope can go. */
    hints?: Partial<DesignSystemLabels['commandPalette']>;
    /** The options, in CommandPaletteGroups. */
    children: ReactNode;
}

const OptionContext = createContext<{
    listId: string;
    activeValue: string | undefined;
    setActiveValue: (value: string) => void;
    select: (value: string) => void;
} | null>(null);

/** T3 Code's command palette: a field over one keyboard list of grouped options, as a dialog over the page
 *  or, on phones, the whole screen. The arrow keys move through `options`, Enter selects, Escape closes. Tokens
 *  before the field say what narrows the list. */
export function CommandPalette({
    label,
    description,
    placeholder,
    query,
    onQueryChange,
    scope,
    tokens: givenTokens,
    onBackspaceEmpty,
    trailing,
    options,
    onSelect,
    onClose,
    listLabel,
    busy = false,
    busyLabel,
    empty,
    hints: givenHints,
    children,
}: CommandPaletteProps) {
    const labels = useDesignSystemLabels();
    const hints = { ...labels.commandPalette, ...givenHints };
    const focusProps = useModalAutoFocus();
    const { setViewport, setContent, className } = useScrollFade();
    const listId = useId();
    const input = useRef<HTMLInputElement>(null);
    const [chosen, setActiveValue] = useState<string>();
    // The highlight follows the list: when the chosen option leaves it, the first option takes over.
    const activeValue = chosen !== undefined && options.includes(chosen) ? chosen : options[0];
    const select = (value: string) => {
        const next = onSelect(value);

        if (next) setActiveValue(next);
    };
    // A scope is the one token of a palette that narrows by levels.
    const tokens: readonly CommandPaletteToken[] = scope
        ? [{ id: 'scope', label: scope.label, remove: { label: scope.leaveLabel, onRemove: scope.onLeave } }]
        : (givenTokens ?? []);
    const leaveLast = scope ? scope.onLeave : onBackspaceEmpty;
    // A palette that takes tokens, or a trailing control, is a filtering search, with its field wrapping onto rows
    // under the tokens, from the top. Every palette is one width.
    const rows = givenTokens !== undefined || Boolean(trailing);

    useEffect(() => {
        if (activeValue) document.getElementById(optionId(listId, activeValue))?.scrollIntoView({ block: 'nearest' });
    }, [activeValue, listId]);

    return (
        <NinnaModal open onOpenChange={(open) => !open && onClose()}>
            <NinnaModal.Content
                title={label}
                description={description}
                centered={false}
                {...focusProps}
                data-command-palette
                // The dialog listens for Escape on the document, past the field's own keys; an input method's Escape
                // only ends its composition.
                onEscapeKeyDown={(event) => {
                    if (event.isComposing) event.preventDefault();
                }}
                className={`flex max-h-[min(36rem,calc(100dvh-6rem))] w-[calc(100vw-2rem)] max-w-160 flex-col overflow-hidden p-0 shadow-(--shadow-dialog) max-sm:top-0 max-sm:left-0 max-sm:h-dvh max-sm:max-h-none max-sm:w-full max-sm:max-w-none max-sm:translate-x-0 max-sm:rounded-none! max-sm:border-0 max-sm:pt-[env(safe-area-inset-top)] max-sm:pb-[env(safe-area-inset-bottom)] sm:w-[calc(100vw-2rem)] sm:max-w-160`}
            >
                <div
                    className={`border-line [&>svg]:text-fg-muted flex shrink-0 gap-2 border-b px-4 [&>svg]:size-4 [&>svg]:shrink-0 ${rows ? 'items-start py-2 [&>svg]:mt-2' : 'items-center py-3'}`}
                >
                    <SearchIcon />
                    <div className={`flex min-w-0 flex-1 items-center gap-x-2 ${rows ? 'flex-wrap gap-y-1' : ''}`}>
                        {tokens.length > 0 ? (
                            // Many tokens scroll on their own, so the field stays in view however many there are. Under
                            // a coarse pointer each remove button is 44 px, reaching into the gap between rows.
                            <ul
                                data-scroll-fade="exempt"
                                className={`flex max-w-full min-w-0 shrink-0 items-center gap-1 ${rows ? 'max-h-19 flex-wrap overflow-y-auto overscroll-contain py-1 pointer-coarse:max-h-22 pointer-coarse:gap-y-3 pointer-coarse:py-1.5' : ''}`}
                            >
                                {tokens.map((token) => (
                                    <li
                                        key={token.id}
                                        className={`bg-primary-surface text-primary-fg flex max-w-full min-w-0 shrink-0 items-center gap-1 rounded-md py-0.5 pr-1 pl-2 text-xs font-medium ${rows ? 'pointer-coarse:min-h-8 pointer-coarse:py-0 pointer-coarse:pr-0' : ''}`}
                                    >
                                        {token.leading ? (
                                            <span className="flex shrink-0 items-center [&>svg]:size-3.5">
                                                {token.leading}
                                            </span>
                                        ) : null}
                                        <span className="min-w-0 truncate">{token.label}</span>
                                        {token.remove ? (
                                            <button
                                                type="button"
                                                // A scope's chip leaves with Backspace alone; several tokens' buttons are tab stops.
                                                tabIndex={scope ? -1 : undefined}
                                                aria-label={token.remove.label}
                                                className={`hover:bg-primary-surface-hover grid shrink-0 place-items-center rounded-sm p-0.5 [&>svg]:size-3 ${rows ? 'pointer-coarse:-my-1.5 pointer-coarse:size-11 pointer-coarse:p-0' : ''}`}
                                                onClick={() => {
                                                    token.remove?.onRemove();
                                                    input.current?.focus();
                                                }}
                                            >
                                                <XIcon />
                                            </button>
                                        ) : null}
                                    </li>
                                ))}
                            </ul>
                        ) : null}
                        <input
                            ref={input}
                            role="combobox"
                            aria-label={label}
                            aria-expanded
                            aria-controls={listId}
                            aria-autocomplete="list"
                            aria-activedescendant={activeValue ? optionId(listId, activeValue) : undefined}
                            aria-busy={busy}
                            placeholder={placeholder}
                            value={query}
                            className={`text-fg placeholder:text-fg-muted min-w-0 flex-1 bg-transparent text-base outline-none sm:text-sm ${rows ? 'h-8 min-w-32' : ''}`}
                            onChange={(event) => onQueryChange(event.target.value)}
                            onKeyDown={(event) => {
                                if (event.nativeEvent.isComposing) return;

                                if (event.key === 'Backspace' && !query && leaveLast) {
                                    event.preventDefault();
                                    leaveLast();
                                } else if ((event.key === 'ArrowDown' || event.key === 'ArrowUp') && options.length) {
                                    event.preventDefault();

                                    const index = activeValue ? options.indexOf(activeValue) : -1;
                                    const step = event.key === 'ArrowDown' ? 1 : -1;

                                    setActiveValue(options[(index + step + options.length) % options.length]!);
                                } else if (event.key === 'Enter' && activeValue) {
                                    event.preventDefault();
                                    select(activeValue);
                                }
                            }}
                        />
                    </div>
                    {trailing ? (
                        // Under a coarse pointer the control is 44 px, as a token's remove button is.
                        <div
                            className="flex min-h-8 shrink-0 items-center pointer-coarse:[&_[data-slot=button]]:h-11!"
                            onClick={() => input.current?.focus()}
                        >
                            {trailing}
                        </div>
                    ) : null}
                    <span className="flex sm:hidden">
                        <IconButton aria-label={labels.close} icon={<XIcon />} onClick={onClose} variant="header" />
                    </span>
                </div>
                <div ref={setViewport} className={`min-h-0 flex-1 overflow-y-auto overscroll-contain p-2 ${className}`}>
                    <div ref={setContent} className="flow-root">
                        <OptionContext.Provider value={{ listId, activeValue, setActiveValue, select }}>
                            <ResultList id={listId} label={listLabel} density="compact" aria-busy={busy}>
                                {children}
                            </ResultList>
                        </OptionContext.Provider>
                        <div role="status">
                            {(busy && busyLabel) || (options.length === 0 && empty) ? (
                                <TextBase as="div" tone="muted" className="px-3 py-8 text-center">
                                    {busy && busyLabel ? busyLabel : empty}
                                </TextBase>
                            ) : null}
                        </div>
                    </div>
                </div>
                <div
                    data-slot="command-palette-hints"
                    className="border-line text-2xs text-fg-muted hidden shrink-0 items-center gap-4 border-t px-4 py-2 pointer-fine:flex"
                >
                    <KeyHint keys="↑↓" label={hints.move} />
                    <KeyHint keys="↵" label={hints.select} />
                    <KeyHint keys="esc" label={hints.close} />
                    {tokens.length > 0 && leaveLast ? (
                        <KeyHint keys="⌫" label={scope ? hints.leaveScope : hints.removeFilter} />
                    ) : null}
                </div>
            </NinnaModal.Content>
        </NinnaModal>
    );
}

/** A key and what it does, in the palette's hints. */
function KeyHint({ keys, label }: { keys: string; label: string }) {
    return (
        <span className="inline-flex items-center gap-1">
            <Kbd>{keys}</Kbd>
            {label}
        </span>
    );
}

/** A labelled run of options in the palette's list. */
export function CommandPaletteGroup({
    label,
    children,
}: {
    /** The group's heading. */
    label: string;
    /** The group's CommandPaletteOptions. */
    children: ReactNode;
}) {
    const labelId = useId();

    return (
        <div role="group" aria-labelledby={labelId} className="flex flex-col gap-1 not-first:pt-2">
            <TextBase as="span" id={labelId} variant="caption" tone="muted" className="px-2 pt-1 text-xs font-medium">
                {label}
            </TextBase>
            {children}
        </div>
    );
}

/** One line of the palette's list: an icon, the name, an optional hint (searched with the name) and meta (on wider
 *  screens), and a tick while `checked`, as a filter that is on. Choosing it keeps the focus in the field.
 *
 *  Rows follow one rule in every app: destinations, commands and filters are this one-line row, with what tells them
 *  apart (a library's kind, a page's count, a ticket's number and state) as `hint` and `meta`. A content search result
 *  that needs artwork and a second line to identify it (an album over its artist) is a two-line `ResultRow` given
 *  `useCommandPaletteOption`, and only those. */
export function CommandPaletteOption({
    value,
    icon,
    name,
    hint,
    meta,
    checked,
    current = false,
}: {
    /** The option's unique value in the list. */
    value: string;
    /** The option's icon, at its start: a lucide icon, bare or wrapped (such as in a hue tint), drawn 16px in the muted tone. */
    icon: ReactNode;
    /** The option's name. */
    name: string;
    /** A short note after the name, searched with it. */
    hint?: string;
    /** Extra detail at the end, shown on wider screens. */
    meta?: string;
    /** Whether a filter's option is on; other options leave it out. */
    checked?: boolean;
    /** The page shown now, as a destination: marked current, in the default text colour. */
    current?: boolean;
}) {
    const context = useContext(OptionContext);

    if (!context) throw new Error('CommandPaletteOption must be used inside CommandPalette');

    return (
        <div
            id={optionId(context.listId, value)}
            role="option"
            aria-selected={context.activeValue === value}
            aria-checked={checked}
            aria-current={current ? 'page' : undefined}
            tabIndex={-1}
            onPointerMove={() => {
                if (context.activeValue !== value) context.setActiveValue(value);
            }}
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => context.select(value)}
            className="text-fg-soft aria-[current=page]:text-fg aria-selected:bg-primary-surface aria-selected:text-fg aria-selected:ring-primary-ring flex h-8 cursor-pointer items-center gap-2 rounded-md px-2 text-sm aria-selected:ring-1 aria-selected:ring-inset aria-[current=page]:font-medium pointer-coarse:h-11"
        >
            {/* One 16px icon box for every row: a bare svg and a wrapped one (a hue tint, a tone mark) get the same size
                and muted tone, so a wrapped icon never outgrows a bare one. */}
            <span
                aria-hidden="true"
                data-slot="palette-icon"
                className="text-fg-muted [&_.kind-icon]:text-fg-muted flex size-4 shrink-0 items-center justify-center [&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:text-current"
            >
                {icon}
            </span>
            <span title={name} className="min-w-0 flex-1 truncate">
                {name}
            </span>
            {hint ? (
                <span className="text-fg-muted max-w-40 shrink-0 truncate text-xs tabular-nums">{hint}</span>
            ) : null}
            {meta ? (
                <span className="text-fg-muted max-w-56 shrink-0 truncate text-xs max-sm:hidden">{meta}</span>
            ) : null}
            {checked ? <CheckIcon aria-hidden="true" className="text-primary-fg size-3.5 shrink-0" /> : null}
        </div>
    );
}

/** Props for a palette option, such as a `ResultRow`: its id, highlight and pointer tracking. */
export function useCommandPaletteOption(value: string) {
    const context = useContext(OptionContext);

    if (!context) throw new Error('useCommandPaletteOption must be used inside CommandPalette');

    return {
        id: optionId(context.listId, value),
        selected: context.activeValue === value,
        tabIndex: -1,
        onPointerMove: () => {
            if (context.activeValue !== value) context.setActiveValue(value);
        },
    };
}

function optionId(listId: string, value: string) {
    return `${listId}-${encodeURIComponent(value)}`;
}
