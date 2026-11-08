import './docs.css';

import { DocsContainer, type DocsContainerProps } from '@storybook/addon-docs/blocks';
import { type PropsWithChildren, useLayoutEffect, useState } from 'react';
import { GLOBALS_UPDATED, SET_GLOBALS } from 'storybook/internal/core-events';
import { themes } from 'storybook/theming';

import { semanticColors } from '../src/foundations/tokens';
import { applyTheme, resolveTheme, type StorybookTheme, themeFromUrl } from './theme';

type ThemeEvent = { globals?: { theme?: string } };
type Channel = DocsContainerProps['context']['channel'];

/** The theme the docs page opens in: Storybook's latest globals, else the URL's, else the default theme. */
function initialTheme(channel: Channel): StorybookTheme {
    const latest: ThemeEvent | undefined = channel.last(GLOBALS_UPDATED)?.[0] ?? channel.last(SET_GLOBALS)?.[0];

    return latest?.globals ? resolveTheme(latest.globals.theme) : themeFromUrl();
}

/** Docs-only MDX pages have no story decorator, so they resolve the theme global themselves: one value, set on <html>
 *  in the first render (before paint) and used for Storybook's docs chrome, so the two can never disagree. */
export function ThemedDocsContainer({ context, children }: PropsWithChildren<DocsContainerProps>) {
    const [theme, setTheme] = useState(() => {
        const resolved = initialTheme(context.channel);

        applyTheme(resolved);

        return resolved;
    });

    useLayoutEffect(() => {
        const update = ({ globals }: ThemeEvent) => {
            if (!globals) return;

            const next = resolveTheme(globals.theme);

            applyTheme(next);
            setTheme(next);
        };
        // An embedded story's theme decorator may set the class itself; follow it.
        const syncClass = () => {
            const { classList } = document.documentElement;

            if (classList.contains('dark') !== classList.contains('light')) {
                setTheme(classList.contains('dark') ? 'dark' : 'light');
            }
        };
        const observer = new MutationObserver(syncClass);

        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
        context.channel.on(GLOBALS_UPDATED, update);
        context.channel.on(SET_GLOBALS, update);
        applyTheme(initialTheme(context.channel));
        syncClass();

        return () => {
            observer.disconnect();
            context.channel.off(GLOBALS_UPDATED, update);
            context.channel.off(SET_GLOBALS, update);
        };
    }, [context]);

    const docsTheme = {
        ...(theme === 'dark' ? themes.dark : themes.light),
        appBg: semanticColors['surface-page'][theme],
        appContentBg: semanticColors['surface-page'][theme],
        textColor: semanticColors.fg[theme],
        textMutedColor: semanticColors['fg-muted'][theme],
        barBg: semanticColors['surface-raised'][theme],
        inputBg: semanticColors['surface-raised'][theme],
        inputTextColor: semanticColors.fg[theme],
    };

    return (
        <DocsContainer context={context} theme={docsTheme}>
            {children}
        </DocsContainer>
    );
}
