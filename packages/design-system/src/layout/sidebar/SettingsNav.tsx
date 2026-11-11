import { SearchIcon } from 'lucide-react';
import { forwardRef, type KeyboardEvent, type ReactNode } from 'react';

import { Kbd } from '../../display/Kbd';
import { SidebarPane } from './SidebarPane';

type DataAttributes = { [key: `data-${string}`]: string | boolean | undefined };

/**
 * Settings' sidebar, T3 Code's: the `search` field (SettingsSearch) over the sections' groups (SidebarNavigationGroup
 * of SidebarNavigationItem, monochrome icons, the open one in the navy `current` wash). `label` names the navigation.
 * The search sits outside the groups' scroller, so on a phone it stays above the sideways row of sections while that
 * row scrolls to the active one. SettingsDialog composes it; a no-match state belongs in the content, not here.
 */
export function SettingsNav({
    label,
    search,
    empty,
    children,
    ...data
}: {
    /** Names the navigation landmark, such as "Settings sections". */
    label: string;
    /** A search field over the sections, a SettingsSearch. */
    search?: ReactNode;
    /** @deprecated Say there is no match in the content (SettingsDialog does, with Clear search); still shown, in a
     *  muted announced line, when given. */
    empty?: string | undefined;
    /** The sections' groups, each a SidebarNavigationGroup. */
    children: ReactNode;
} & DataAttributes) {
    return (
        <div {...data} className="contents">
            <SidebarPane label={label} header={search}>
                {empty && (
                    <p role="status" data-no-match className="text-fg-muted m-0 px-2 py-1 text-xs">
                        {empty}
                    </p>
                )}
                {children}
            </SidebarPane>
        </div>
    );
}

/**
 * Settings' search field, T3 Code's: a 32px field (borderless at rest in dark, the navy edge on focus) with a
 * magnifier, the word "Search…" and the key that focuses it (`/`) at its end while it is empty and unfocused. Escape
 * empties it before it closes anything. SettingsDialog wires the key; elsewhere the caller does.
 */
export const SettingsSearch = forwardRef<
    HTMLInputElement,
    {
        /** What the search holds. */
        value: string;
        /** Called with what the search holds as the reader types. */
        onValueChange: (value: string) => void;
        /** The field's accessible name and placeholder, such as "Search settings". */
        label: string;
        /** The key that focuses it, shown at its end; `/` by default, none when null. */
        shortcut?: string | null;
    }
>(({ value, onValueChange, label, shortcut = '/' }, ref) => {
    const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key !== 'Escape' || !value) return;

        // Escape first empties the search; the dialog's own Escape (SettingsDialog) stands aside for it.
        event.preventDefault();
        onValueChange('');
    };

    return (
        <label
            data-slot="settings-search"
            // T3's: in dark, borderless at rest (a white 4% fill on the sidebar's glass), a touch lighter under the
            // pointer, and the navy focus edge only while typing goes there; in light, the field's hairline.
            className="group border-line-field bg-surface-field text-fg-muted hover:border-line-field-hover dark:hover:bg-fill-hover focus-field relative flex h-8 min-w-0 cursor-text items-center gap-2 rounded-md border px-2.5 transition-colors dark:border-transparent dark:hover:border-transparent"
        >
            <SearchIcon aria-hidden="true" className="size-4 shrink-0" />
            <input
                ref={ref}
                type="search"
                value={value}
                onChange={(event) => onValueChange(event.target.value)}
                onKeyDown={onKeyDown}
                aria-label={label}
                aria-keyshortcuts={shortcut ?? undefined}
                placeholder={label}
                autoComplete="off"
                spellCheck={false}
                className="text-fg placeholder:text-fg-muted h-full min-w-0 flex-1 bg-transparent text-sm outline-none [&::-webkit-search-cancel-button]:appearance-none"
            />
            {shortcut && !value ? (
                <span
                    aria-hidden="true"
                    className="border-line-field grid h-5 min-w-5 shrink-0 place-items-center rounded-sm border px-1 group-focus-within:hidden pointer-coarse:hidden"
                >
                    <Kbd>{shortcut}</Kbd>
                </span>
            ) : null}
        </label>
    );
});

SettingsSearch.displayName = 'SettingsSearch';
