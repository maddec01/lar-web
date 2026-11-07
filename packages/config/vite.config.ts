import { defineConfig } from 'vite-plus';

import { test } from './src/index.js';

export default defineConfig({ test: { ...test, include: ['test/**/*.test.ts'] } });
