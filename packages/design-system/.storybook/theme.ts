/** The Storybook theme, resolved once for stories and docs alike. The toolbar's theme global starts empty ("default"),
 *  which means the stories' default theme, never the system preference: the semantic CSS would otherwise follow
 *  prefers-color-scheme while Storybook's docs chrome stays light. */
export type StorybookTheme = 'light' | 'dark';

export const defaultTheme: StorybookTheme = 'light';

export const resolveTheme = (value: unknown): StorybookTheme =>
    value === 'dark' || value === 'light' ? value : defaultTheme;

/** The theme a direct load asks for in its URL (`globals=theme:dark`), before Storybook has sent any globals. */
export function themeFromUrl(search = window.location.search): StorybookTheme {
    const globals = new URLSearchParams(search).get('globals') ?? '';
    const entry = globals.split(';').find((pair) => pair.startsWith('theme:'));

    return resolveTheme(entry?.slice('theme:'.length));
}

/** Puts exactly one of `.light`/`.dark` on <html>, so the semantic CSS never falls back to the system preference. */
export function applyTheme(theme: StorybookTheme, root = document.documentElement) {
    root.classList.remove(theme === 'dark' ? 'light' : 'dark');
    root.classList.add(theme);
}
