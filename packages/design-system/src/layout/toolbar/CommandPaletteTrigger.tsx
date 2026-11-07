import { SearchIcon } from 'lucide-react';
import { useEffect, useEffectEvent, useRef } from 'react';

import { Kbd } from '../../display/Kbd';
import { tabbable } from '../../foundations/KeyboardFocus';
import { applePlatform, isShortcut } from '../../foundations/KeyboardShortcut';

interface CommandPaletteTriggerProps {
    label: string;
    onOpen: () => void;
    /** Key that opens the palette from anywhere, pressed with ⌘ on Apple devices and Ctrl elsewhere. */
    shortcut: string;
}

/** The title bar's way into the command palette: a quiet field-like button with its shortcut, folding to its
 *  icon when the title bar is narrow. */
export function CommandPaletteTrigger({ label, onOpen, shortcut }: CommandPaletteTriggerProps) {
    const button = useRef<HTMLButtonElement>(null);
    const openFromShortcut = useEffectEvent((event: KeyboardEvent) => {
        // An open dialog hides the page behind it, the trigger included.
        if (!isShortcut(event, shortcut) || button.current?.closest('[aria-hidden="true"]')) return;

        event.preventDefault();
        onOpen();
    });

    useEffect(() => {
        const listener = (event: KeyboardEvent) => openFromShortcut(event);

        document.addEventListener('keydown', listener);

        return () => document.removeEventListener('keydown', listener);
    }, []);

    return (
        <button
            {...tabbable}
            ref={button}
            type="button"
            aria-label={label}
            aria-haspopup="dialog"
            aria-keyshortcuts={`${applePlatform ? 'Meta' : 'Control'}+${shortcut.toUpperCase()}`}
            onClick={onOpen}
            className="text-base-600 hover:bg-base-200 hover:text-base-content focus-visible:outline-primary @2xl:border-base-300 @2xl:bg-base-100 @2xl:hover:border-base-400 @2xl:hover:bg-base-100 dark:@2xl:bg-base-200 flex size-7 items-center justify-center gap-2 rounded-lg text-sm transition-colors focus-visible:outline-2 @2xl:w-56 @2xl:justify-start @2xl:border @2xl:px-2.5 [&>svg]:size-4 [&>svg]:shrink-0"
        >
            <SearchIcon />
            <span className="hidden flex-1 text-left @2xl:inline">{label}</span>
            <span className="hidden pointer-fine:@2xl:inline">
                <Kbd>{applePlatform ? `⌘${shortcut.toUpperCase()}` : `Ctrl ${shortcut.toUpperCase()}`}</Kbd>
            </span>
        </button>
    );
}
