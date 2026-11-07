import { fmt, lint, test } from '@lar-works/config';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite-plus';

const appRoot = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
    resolve: { alias: { '@': resolve(appRoot, 'src') } },
    plugins: [react(), tailwindcss()],
    fmt,
    lint: lint({ apps: ['.'] }),
    test: {
        ...test,
        environment: 'jsdom',
        include: ['src/**/*.test.{ts,tsx}'],
        setupFiles: ['./src/test/setup.ts'],
    },
});
