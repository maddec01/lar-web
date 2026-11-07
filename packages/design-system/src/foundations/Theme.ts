import { useSyncExternalStore } from 'react';

export type ThemePreference = 'system' | 'light' | 'dark';

export interface ThemeController {
    /** Applies the stored preference before the first render, so the page never flashes the other theme. */
    initialize(): void;
    /** The current preference and a setter that stores and applies it, kept in step across tabs. */
    useTheme(): readonly [ThemePreference, (value: ThemePreference) => void];
}

export function isThemePreference(value: string): value is ThemePreference {
    return value === 'system' || value === 'light' || value === 'dark';
}

/** The page backgrounds, which Safari and installed web apps extend into their own chrome. */
const themeColors = { light: '#fcfcfc', dark: '#0a0a0a' } as const;

/**
 * The light/dark preference of one app, stored under `storageKey` in localStorage. The preference sets `.light` or
 * `.dark` on <html> (nothing follows the system) and points the page's `theme-color` metas at the matching background.
 */
export function createThemeController(storageKey: string): ThemeController {
    const changeEvent = `${storageKey}-change`;

    function read(): ThemePreference {
        const stored = window.localStorage.getItem(storageKey);

        return stored && isThemePreference(stored) ? stored : 'system';
    }

    function set(preference: ThemePreference): void {
        window.localStorage.setItem(storageKey, preference);
        applyThemePreference(preference);
        window.dispatchEvent(new Event(changeEvent));
    }

    function subscribe(onChange: () => void): () => void {
        function handleStorageChange(event: StorageEvent): void {
            if (event.key !== storageKey) return;

            applyThemePreference(read());
            onChange();
        }

        window.addEventListener(changeEvent, onChange);
        window.addEventListener('storage', handleStorageChange);

        return () => {
            window.removeEventListener(changeEvent, onChange);
            window.removeEventListener('storage', handleStorageChange);
        };
    }

    return {
        initialize: () => applyThemePreference(read()),
        useTheme() {
            const preference = useSyncExternalStore(subscribe, read, () => 'system' as const);

            return [preference, set] as const;
        },
    };
}

function applyThemePreference(preference: ThemePreference): void {
    document.documentElement.classList.remove('light', 'dark');

    if (preference !== 'system') document.documentElement.classList.add(preference);

    for (const meta of document.querySelectorAll<HTMLMetaElement>('meta[name="theme-color"]')) {
        const scheme = meta.getAttribute('media')?.includes('dark') ? 'dark' : 'light';

        meta.content = themeColors[preference === 'system' ? scheme : preference];
    }
}
