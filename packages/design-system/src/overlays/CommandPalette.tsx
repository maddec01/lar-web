/* oxlint-disable react/only-export-components -- The option hook belongs to the palette. */

import { Modal as NinnaModal } from '@ninna-ui/overlays';
import { SearchIcon, XIcon } from 'lucide-react';
import { createContext, type ReactNode, useContext, useEffect, useId, useRef, useState } from 'react';

import { IconButton } from '../actions/IconButton';
import { ResultList } from '../collections/ResultList';
import { useDesignSystemLabels } from '../foundations/DesignSystemProvider';
import { Text } from '../typography/Typography';
import { useModalAutoFocus } from './useModalAutoFocus';
import { useScrollFade } from './useScrollFade';

interface CommandPaletteProps {
    /** The dialog's accessible title and description; the field says the rest. */
    label: string;
    description: string;
    placeholder: string;
    query: string;
    onQueryChange: (query: string) => void;
    /** Narrows the list to one level, shown as a chip before the field; Backspace in an empty field leaves it. */
    scope?: { label: string; leaveLabel: string; onLeave: () => void };
    /** The options' values in list order, for the arrow keys and Enter. */
    options: readonly string[];
    onSelect: (value: string) => void;
    onClose: () => void;
    listLabel: string;
    busy?: boolean;
    /** Shown when nothing is listed. */
    empty?: ReactNode;
    /** Quiet key hints under the list, on screens with a keyboard. */
    footer?: ReactNode;
    children: ReactNode;
}

const OptionContext = createContext<{
    listId: string;
    activeValue: string | undefined;
    setActiveValue: (value: string) => void;
} | null>(null);

/** T3 Code's command palette: a field over one keyboard list of grouped options, as a dialog over the page
 *  or, on phones, the whole screen. The arrow keys move through `options`, Enter selects, Escape closes. */
export function CommandPalette({
    label,
    description,
    placeholder,
    query,
    onQueryChange,
    scope,
    options,
    onSelect,
    onClose,
    listLabel,
    busy = false,
    empty,
    footer,
    children,
}: CommandPaletteProps) {
    const labels = useDesignSystemLabels();
    const focusProps = useModalAutoFocus();
    const { setViewport, setContent, className } = useScrollFade();
    const listId = useId();
    const input = useRef<HTMLInputElement>(null);
    const [chosen, setActiveValue] = useState<string>();
    // The highlight follows the list: when the chosen option leaves it, the first option takes over.
    const activeValue = chosen !== undefined && options.includes(chosen) ? chosen : options[0];

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
                className="flex max-h-[min(36rem,calc(100dvh-6rem))] w-[calc(100vw-2rem)] max-w-2xl flex-col overflow-hidden p-0 shadow-(--lar-shadow-dialog) max-sm:top-0 max-sm:left-0 max-sm:h-dvh max-sm:max-h-none max-sm:w-full max-sm:max-w-none max-sm:translate-x-0 max-sm:rounded-none! max-sm:border-0 max-sm:pt-[env(safe-area-inset-top)]"
            >
                <div className="border-base-300 [&>svg]:text-base-600 flex shrink-0 items-center gap-2 border-b px-4 py-3 [&>svg]:size-4 [&>svg]:shrink-0">
                    <SearchIcon />
                    {scope ? (
                        <span className="bg-primary/12 text-primary flex shrink-0 items-center gap-1 rounded-md py-0.5 pr-1 pl-2 text-xs font-medium">
                            {scope.label}
                            <button
                                type="button"
                                tabIndex={-1}
                                aria-label={scope.leaveLabel}
                                className="hover:bg-primary/15 rounded-sm p-0.5 [&>svg]:size-3"
                                onClick={() => {
                                    scope.onLeave();
                                    input.current?.focus();
                                }}
                            >
                                <XIcon />
                            </button>
                        </span>
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
                        className="text-base-content placeholder:text-base-600 min-w-0 flex-1 bg-transparent text-base outline-none sm:text-sm"
                        onChange={(event) => onQueryChange(event.target.value)}
                        onKeyDown={(event) => {
                            if (event.nativeEvent.isComposing) return;

                            if (event.key === 'Backspace' && !query && scope) {
                                event.preventDefault();
                                scope.onLeave();
                            } else if ((event.key === 'ArrowDown' || event.key === 'ArrowUp') && options.length) {
                                event.preventDefault();

                                const index = activeValue ? options.indexOf(activeValue) : -1;
                                const step = event.key === 'ArrowDown' ? 1 : -1;

                                setActiveValue(options[(index + step + options.length) % options.length]!);
                            } else if (event.key === 'Enter' && activeValue) {
                                event.preventDefault();
                                onSelect(activeValue);
                            }
                        }}
                    />
                    <span className="flex sm:hidden">
                        <IconButton aria-label={labels.close} icon={<XIcon />} onClick={onClose} variant="header" />
                    </span>
                </div>
                <div ref={setViewport} className={`min-h-0 flex-1 overflow-y-auto overscroll-contain p-2 ${className}`}>
                    <div ref={setContent} className="flow-root">
                        <OptionContext.Provider value={{ listId, activeValue, setActiveValue }}>
                            <ResultList id={listId} label={listLabel} density="compact" aria-busy={busy}>
                                {children}
                            </ResultList>
                        </OptionContext.Provider>
                        {options.length === 0 && empty ? (
                            <Text tone="muted" className="px-3 py-8 text-center">
                                {empty}
                            </Text>
                        ) : null}
                    </div>
                </div>
                {footer ? (
                    <div className="border-base-300 text-2xs text-base-700 hidden shrink-0 items-center gap-4 border-t px-4 py-2 pointer-fine:flex">
                        {footer}
                    </div>
                ) : null}
            </NinnaModal.Content>
        </NinnaModal>
    );
}

/** A labelled run of options in the palette's list. */
export function CommandPaletteGroup({ label, children }: { label: string; children: ReactNode }) {
    const labelId = useId();

    return (
        <div role="group" aria-labelledby={labelId} className="flex flex-col gap-1 not-first:pt-2">
            <Text
                as="span"
                id={labelId}
                variant="caption"
                tone="muted"
                className="px-2 pt-1 font-medium tracking-wide uppercase"
            >
                {label}
            </Text>
            {children}
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
    return `${listId}-${value.replace(/[^\w-]/g, '_')}`;
}
