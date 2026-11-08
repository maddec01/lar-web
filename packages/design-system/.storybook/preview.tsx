import { withThemeByClassName } from '@storybook/addon-themes';
import type { Preview } from '@storybook/react-vite';

import { Notifications } from '../src/feedback/Notifications';
import { DesignSystemProvider } from '../src/foundations/DesignSystemProvider';
import { TooltipProvider } from '../src/overlays/Tooltip';
import styles from '../src/styles.css?inline';
import { disableNodeControls } from './controls';
import { ThemedDocsContainer } from './DocsContainer';
import { applyTheme, defaultTheme, themeFromUrl } from './theme';

// The palette applies under html[data-theme='minimal']; `.light` and `.dark` pick one, as in the apps.
document.documentElement.dataset.theme = 'minimal';
// Before anything renders, so neither a story nor a docs page paints a frame in the system's scheme.
applyTheme(themeFromUrl());

/** Every story and docs page gets styles.css alone, as an app does, so a component never borrows a token an app's own
 *  UI layer adds. */
const sheet = document.createElement('style');

sheet.id = 'lar-design-system-sheet';
sheet.textContent = styles;
document.head.append(sheet);

const preview: Preview = {
    parameters: {
        docs: { container: ThemedDocsContainer },
        layout: 'padded',
        controls: { expanded: true, matchers: { color: /(background|color)$/i } },
        options: {
            storySort: {
                order: [
                    'Introduction',
                    'Foundations',
                    'Typography',
                    'Actions',
                    'Forms',
                    'Display',
                    'Feedback',
                    'Navigation',
                    'Overlays',
                    'Collections',
                    'Layout',
                ],
            },
        },
        a11y: { test: 'error' },
    },
    decorators: [
        // A story that mounts its own Notifications sets `parameters.notifications` to false.
        (Story, { parameters }) => (
            <DesignSystemProvider>
                <TooltipProvider>
                    <Story />
                    {parameters.notifications === false ? null : <Notifications />}
                </TooltipProvider>
            </DesignSystemProvider>
        ),
        withThemeByClassName({
            themes: { light: 'light', dark: 'dark' },
            defaultTheme,
            parentSelector: 'html',
        }),
    ],
    argTypesEnhancers: [disableNodeControls],
    tags: ['autodocs'],
};

export default preview;
