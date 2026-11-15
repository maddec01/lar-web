# @lar-works/config

Shared Oxlint rules (including Lar's `lar/*` rules), Oxfmt options, TypeScript configs and test settings for
[Vite+](https://viteplus.dev).

```ts
// vite.config.ts
import { fmt, lint, test } from '@lar-works/config';
import { defineConfig } from 'vite-plus';

export default defineConfig({
    fmt,
    lint: lint({ apps: ['.'] }),
    test: { ...test, environment: 'jsdom' },
});
```

```json
// tsconfig.json
{ "extends": "@lar-works/config/tsconfig/app.json" }
```
