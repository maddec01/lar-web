import { fmt, lint } from '@lar-works/config';
import { defineConfig } from 'vite-plus';

export default defineConfig({
    fmt,
    lint: lint({ apps: ['templates/app'], designSystems: ['packages/design-system'] }),
});
