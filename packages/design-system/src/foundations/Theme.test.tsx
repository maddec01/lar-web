import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it } from 'vite-plus/test';

import { createThemeController } from './Theme';

const theme = createThemeController('lar-test-theme', 'system');

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
            '(prefers-color-scheme: light)': '#fafafa',
            '(prefers-color-scheme: dark)': '#000000',
        });
    });

    it('points every theme-color at the chosen theme background', () => {
        const { result } = renderHook(() => theme.useTheme());

        act(() => result.current[1]('dark'));

        expect(document.documentElement.classList.contains('dark')).toBe(true);
        expect(window.localStorage.getItem('lar-test-theme')).toBe('dark');
        expect(themeColors()).toEqual({
            '(prefers-color-scheme: light)': '#000000',
            '(prefers-color-scheme: dark)': '#000000',
        });

        act(() => result.current[1]('light'));

        expect(document.documentElement.classList.contains('light')).toBe(true);
        expect(themeColors()).toEqual({
            '(prefers-color-scheme: light)': '#fafafa',
            '(prefers-color-scheme: dark)': '#fafafa',
        });
    });

    it('opens dark when nothing is stored and the app falls back to dark', () => {
        createThemeController('lar-test-dark').initialize();

        expect(document.documentElement.classList.contains('dark')).toBe(true);
    });

    it('tells the app each preference it applies', () => {
        const applied: string[] = [];
        const desktop = createThemeController('lar-test-desktop', {
            fallback: 'system',
            onApply: (preference) => applied.push(preference),
        });
        const { result } = renderHook(() => desktop.useTheme());

        desktop.initialize();
        act(() => result.current[1]('light'));

        expect(applied).toEqual(['system', 'light']);
        expect(result.current[0]).toBe('light');
    });
});
