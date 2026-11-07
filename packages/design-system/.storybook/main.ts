import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
    framework: '@storybook/react-vite',
    stories: ['../docs/**/*.mdx', '../src/**/*.stories.tsx'],
    addons: ['@storybook/addon-docs', '@storybook/addon-a11y', '@storybook/addon-themes'],
    core: { disableTelemetry: true },
    // GitHub Pages serves the built Storybook from /lar-web/.
    viteFinal: (config, { configType }) =>
        configType === 'PRODUCTION' ? { ...config, base: process.env.STORYBOOK_BASE ?? config.base } : config,
};

export default config;
