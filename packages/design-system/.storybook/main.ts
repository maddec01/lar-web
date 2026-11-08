import type { StorybookConfig } from '@storybook/react-vite';
import remarkGfm from 'remark-gfm';

const config: StorybookConfig = {
    framework: '@storybook/react-vite',
    stories: ['../docs/**/*.mdx', '../src/**/*.stories.tsx'],
    addons: [
        // GitHub-flavoured Markdown in the docs pages, for their tables.
        {
            name: '@storybook/addon-docs',
            options: { mdxPluginOptions: { mdxCompileOptions: { remarkPlugins: [remarkGfm] } } },
        },
        '@storybook/addon-a11y',
        '@storybook/addon-themes',
    ],
    core: { disableTelemetry: true },
    // GitHub Pages serves the built Storybook from /lar-web/.
    viteFinal: (config, { configType }) =>
        configType === 'PRODUCTION' ? { ...config, base: process.env.STORYBOOK_BASE ?? config.base } : config,
};

export default config;
