import { withThemeByClassName } from '@storybook/addon-themes';
import type { Preview } from '@storybook/react-vite';

import board from '../src/board.css?inline';
import { Notifications } from '../src/feedback/Notifications';
import { DesignSystemProvider } from '../src/foundations/DesignSystemProvider';
import { TooltipProvider } from '../src/overlays/Tooltip';
import showcase from '../src/showcase.css?inline';
import styles from '../src/styles.css?inline';
import { disableNodeControls } from './controls';
import { ThemedDocsContainer } from './DocsContainer';
import { applyTheme, defaultTheme, themeFromUrl } from './theme';

// The palette applies under html[data-theme='minimal']; `.light` and `.dark` pick one, as in the apps.
document.documentElement.dataset.theme = 'minimal';
// Before anything renders, so neither a story nor a docs page paints a frame in the system's scheme.
applyTheme(themeFromUrl());

/** Each story gets the stylesheet its layer ships in, as an app would: a generic story styles.css alone, so a
 *  component that leans on a board or showcase token shows it here rather than borrowing it; Board stories
 *  board.css and Showcase stories showcase.css. The docs pages start on styles.css. */
const sheets = { styles, board, showcase } as const;

function applySheet(name: keyof typeof sheets) {
    let element = document.getElementById('lar-design-system-sheet');

    if (!element) {
        element = document.createElement('style');
        element.id = 'lar-design-system-sheet';
        document.head.append(element);
    }

    if (element.dataset.sheet !== name) {
        element.textContent = sheets[name];
        element.dataset.sheet = name;
    }
}

export const sheetFor = (title: string): keyof typeof sheets =>
    title.startsWith('Board/') ? 'board' : title.startsWith('Showcase/') ? 'showcase' : 'styles';

applySheet('styles');

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
                    'Showcase',
                    'Board',
                ],
            },
        },
        a11y: { test: 'error' },
    },
    decorators: [
        (Story, { title, parameters }) => {
            applySheet(sheetFor(title));

            if (title.startsWith('Board/') && parameters.layout !== 'fullscreen') {
                return (
                    <div className="mx-auto grid w-full max-w-6xl justify-items-center px-4 py-8 [&>*]:min-w-0">
                        <Story />
                    </div>
                );
            }

            return <Story />;
        },
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
