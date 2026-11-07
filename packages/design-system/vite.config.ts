import { test } from '@lar-works/config';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite-plus';

export default defineConfig({
    plugins: [react(), tailwindcss()],
    // The package ships as ES modules with declarations, one file per source module, so apps' bundlers tree-shake it
    // module by module. React, ninna-ui, lucide and the rest stay dependencies the app's bundler resolves.
    pack: {
        entry: ['src/index.ts', 'src/icons.ts', 'src/icons/dynamic.ts', 'src/testing.ts'],
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
        environment: 'jsdom',
        include: ['src/**/*.test.{ts,tsx}'],
        setupFiles: ['./test/setup.ts'],
        testTimeout: 20_000,
        hookTimeout: 20_000,
    },
});
