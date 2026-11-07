import { createThemeController } from '@lar-works/design-system';

/** The app's light/dark preference, kept in localStorage. Rename the key for each app. */
export const { initialize: initializeTheme, useTheme } = createThemeController('lar-app-theme');
