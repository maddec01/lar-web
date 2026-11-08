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

## Lint rules

`lint({ apps })` checks each app's `src` with Lar's own rules:

- `lar/boundaries` keeps the layers apart: `app` (the composition root), `features/<name>` (other features import only
  its `index.ts`), `services` (data access, never UI), `shared` and `ui`. `src/ui` is the app's UI layer: its own
  compositions of the design system, which import the design system (`/primitives` included), its icons, React, other
  ui files and type-only shared modules, never app state, routing, services or features. Only `src/ui` imports
  `@lar-works/design-system/primitives`.
- `lar/no-visual-recipes` keeps styling out of feature code: no `className`, `style`, raw text or form elements or look
  props outside `src/ui`.
- `lar/no-raw-colours` keeps raw colours (hex, `rgb()`, `hsl()`, `bg-[#…]`) out of `src/ui`: colour comes from the
  design system's tokens.
- `lar/padding-lines` puts blank lines around declarations, blocks and returns.

Package releases publish from the lar-web `release.yml` workflow using npm Trusted Publishing.
