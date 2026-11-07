# @lar-works/config

The toolchain settings every Lar web repository shares: Oxlint rules (with Lar's own `lar/*` rules for architecture
boundaries, design-system ownership and blank lines), Oxfmt options, TypeScript configs and test settings, for
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

Package releases publish from the lar-web `release.yml` workflow using npm Trusted Publishing.
