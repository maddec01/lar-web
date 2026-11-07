import '../src/styles.css';

import { withThemeByClassName } from '@storybook/addon-themes';
import type { Preview } from '@storybook/react-vite';

import { Notifications } from '../src/feedback/Notifications';
import { DesignSystemProvider } from '../src/foundations/DesignSystemProvider';
import { TooltipProvider } from '../src/overlays/Tooltip';

// The palette applies under html[data-theme='minimal']; `.light` and `.dark` pick one, as in the apps.
document.documentElement.dataset.theme = 'minimal';

const preview: Preview = {
    parameters: {
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
                    'Showcase',
                ],
            },
        },
        a11y: { test: 'todo' },
    },
    decorators: [
        (Story) => (
            <DesignSystemProvider>
                <TooltipProvider>
                    <Story />
                    <Notifications />
                </TooltipProvider>
            </DesignSystemProvider>
        ),
        withThemeByClassName({
            themes: { light: 'light', dark: 'dark' },
            defaultTheme: 'light',
            parentSelector: 'html',
        }),
    ],
    tags: ['autodocs'],
};

export default preview;
