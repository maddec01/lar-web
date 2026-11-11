import { useSyncExternalStore } from 'react';

export type ThemePreference = 'system' | 'light' | 'dark';

export interface ThemeController {
    /** Applies the stored preference before the first render, so the page never flashes the other theme. */
    initialize: () => void;
    /** The current preference and a setter that stores and applies it, kept in step across tabs. */
    useTheme: () => readonly [ThemePreference, (value: ThemePreference) => void];
}

export function isThemePreference(value: string): value is ThemePreference {
    return value === 'system' || value === 'light' || value === 'dark';
}

/** The page backgrounds, which Safari and installed web apps extend into their own chrome. */
const themeColors = { light: '#fafafa', dark: '#000000' } as const;

export interface ThemeControllerOptions {
    /** The preference while none is stored: `dark` (the default) for a web app, which opens dark; `system` for a
     *  desktop app, which follows the system until the reader picks Light or Dark. */
    fallback?: ThemePreference;
    /** Called with the preference each time it is applied (at `initialize`, on a choice, and from another window),
     *  such as to point a desktop shell's own chrome (Electron's `nativeTheme.themeSource`) at it. */
    onApply?: (preference: ThemePreference) => void;
}

/**
 * The light/dark preference of one app, one controller for every Lar app, with one vocabulary (the design system's
 * theme labels: Follow system, Light, Dark). It is stored under `storageKey` in localStorage and kept in step across
 * tabs and windows. Light or Dark sets `.light` or `.dark` on <html>; Follow system sets neither, so the palette
 * follows `prefers-color-scheme`. Either way the page's `theme-color` metas point at the matching background. The
 * second argument is the fallback preference, or the options.
 */
export function createThemeController(
    storageKey: string,
    options: ThemePreference | ThemeControllerOptions = {},
): ThemeController {
    const { fallback = 'dark', onApply } = typeof options === 'string' ? { fallback: options } : options;
    const changeEvent = `${storageKey}-change`;

    function apply(preference: ThemePreference): void {
        applyThemePreference(preference);
        onApply?.(preference);
    }

    function read(): ThemePreference {
        const stored = window.localStorage.getItem(storageKey);

        return stored && isThemePreference(stored) ? stored : fallback;
    }

    function set(preference: ThemePreference): void {
        window.localStorage.setItem(storageKey, preference);
        apply(preference);
        window.dispatchEvent(new Event(changeEvent));
    }

    function subscribe(onChange: () => void): () => void {
        function handleStorageChange(event: StorageEvent): void {
            if (event.key !== storageKey) return;

            apply(read());
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
        initialize: () => apply(read()),
        useTheme: () => [useSyncExternalStore(subscribe, read, () => fallback), set] as const,
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
