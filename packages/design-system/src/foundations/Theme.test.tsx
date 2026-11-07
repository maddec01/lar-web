import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it } from 'vite-plus/test';

import { createThemeController } from './Theme';

const theme = createThemeController('lar-test-theme');

function themeColors(): Record<string, string> {
    return Object.fromEntries(
        [...document.querySelectorAll<HTMLMetaElement>('meta[name="theme-color"]')].map((meta) => [
            meta.getAttribute('media'),
            meta.content,
        ]),
    );
}

describe('theme preference', () => {
    beforeEach(() => {
        document.head.innerHTML = `
            <meta name="theme-color" content="" media="(prefers-color-scheme: light)" />
            <meta name="theme-color" content="" media="(prefers-color-scheme: dark)" />
        `;
    });

    afterEach(() => {
        window.localStorage.clear();
        document.documentElement.classList.remove('light', 'dark');
        document.head.innerHTML = '';
    });

    it('lets each theme-color follow the system scheme while no theme is chosen', () => {
        theme.initialize();

        expect(document.documentElement.classList.contains('dark')).toBe(false);
        expect(themeColors()).toEqual({
            '(prefers-color-scheme: light)': '#fcfcfc',
            '(prefers-color-scheme: dark)': '#0a0a0a',
        });
    });

    it('points every theme-color at the chosen theme background', () => {
        const { result } = renderHook(() => theme.useTheme());

        act(() => result.current[1]('dark'));

        expect(document.documentElement.classList.contains('dark')).toBe(true);
        expect(window.localStorage.getItem('lar-test-theme')).toBe('dark');
        expect(themeColors()).toEqual({
            '(prefers-color-scheme: light)': '#0a0a0a',
            '(prefers-color-scheme: dark)': '#0a0a0a',
        });

        act(() => result.current[1]('light'));

        expect(document.documentElement.classList.contains('light')).toBe(true);
        expect(themeColors()).toEqual({
            '(prefers-color-scheme: light)': '#fcfcfc',
            '(prefers-color-scheme: dark)': '#fcfcfc',
        });
    });
});
