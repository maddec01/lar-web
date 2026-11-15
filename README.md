# lar-web

The shared web foundation of every Lar web app: [`@lar-works/design-system`](packages/design-system)
([Storybook](https://maddec01.github.io/lar-web/)), [`@lar-works/config`](packages/config) (lint, format, TypeScript
and test settings for [Vite+](https://viteplus.dev)) and [`templates/app`](templates/app), the starting point for a new
app.

Changes ship through changesets: merging the Release workflow's "Version packages" PR publishes to npm; then bump the
packages in each app (`pnpm update @lar-works/design-system @lar-works/config`).
