import { test } from '@lar-works/config';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite-plus';
import { playwright } from 'vite-plus/test/browser-playwright';

export default defineConfig({
    plugins: [react(), tailwindcss()],
    optimizeDeps: { include: ['vite-plus/test/browser/context'] },
    // The package ships as ES modules with declarations, one file per source module, so apps' bundlers tree-shake it
    // module by module. React, ninna-ui, lucide and the rest stay dependencies the app's bundler resolves.
    pack: {
        entry: [
            'src/index.ts',
            'src/board/index.ts',
            'src/showcase/index.ts',
            'src/icons.ts',
            'src/icons/dynamic.ts',
            'src/testing.ts',
        ],
        tsconfig: 'tsconfig.build.json',
        format: ['esm'],
        dts: true,
        unbundle: true,
        sourcemap: true,
        platform: 'browser',
        clean: true,
    },
    test: {
        ...test,
        projects: [
            {
                extends: true,
                test: {
                    name: 'markup',
                    environment: 'jsdom',
                    include: ['src/**/*.test.{ts,tsx}'],
                    exclude: ['src/**/*.browser.test.tsx'],
                    setupFiles: ['./test/setup.ts'],
                },
            },
            {
                extends: true,
                test: {
                    name: 'chromium',
                    include: ['src/**/*.browser.test.tsx'],
                    setupFiles: ['./test/browser-setup.ts'],
                    browser: {
                        enabled: true,
                        headless: true,
                        provider: playwright({ contextOptions: { reducedMotion: 'reduce' } }),
                        instances: [{ browser: 'chromium', viewport: { width: 1280, height: 900 } }],
                    },
                },
            },
        ],
        testTimeout: 20_000,
        hookTimeout: 20_000,
    },
});
