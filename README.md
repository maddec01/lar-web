# lar-web

The shared web foundation of every Lar web app (the website in lar-platform, Lar Server's web app, Lar Factory's
board): one design system, one toolchain configuration and one app structure.

| Package                                              | What it holds                                                                                                                                            |
| ---------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [`@lar-works/design-system`](packages/design-system) | Tokens, base styles and every visual component (React 19, Tailwind CSS 4, ninna-ui), with lucide icons. [Storybook](https://maddec01.github.io/lar-web/) |
| [`@lar-works/config`](packages/config)               | Oxlint rules (with Lar's `lar/*` rules), Oxfmt options, TypeScript configs and test settings for [Vite+](https://viteplus.dev)                           |
| [`templates/app`](templates/app)                     | The starting point for a new Lar web app                                                                                                                 |

## How the apps use it

Apps depend on the published packages (`pnpm add @lar-works/design-system`, `pnpm add -D @lar-works/config`), import
`@lar-works/design-system/styles.css` once, and never style anything themselves: `lar/no-visual-recipes` rejects
`className`, `style`, raw text and form elements and look props in app code, and `lar/boundaries` keeps an app's
layers apart:

```
src/
  main.tsx          entry: styles, theme, providers, router
  app/              composition root: routes, providers, shell, app-level pages
  features/<name>/  one folder per feature; other features import only its index.ts
  services/<name>/  data access and server state; never UI
  shared/           localization, routing, preferences and other app-wide foundations
  test/             test setup and helpers
```

To change how something looks, change it here, release, and bump the package in the app.

## Working here

```sh
pnpm install
pnpm storybook        # every component, light and dark, at http://localhost:6006
pnpm exec vp check    # format, lint and type-check everything
pnpm test             # config rule tests, component tests and a render test of every story
pnpm build            # build the packages
```

Node 24 and pnpm (see `packageManager`). Every component has a colocated `*.stories.tsx`; a new component needs one.

## Releasing

A PR that changes a package adds a changeset (`pnpm changeset`). On `main`, the Release workflow opens a
"Version packages" PR; merging it publishes the new versions to npm (trusted publishing, with provenance) and creates
a GitHub Release for each. Then bump the version in each app (`pnpm update @lar-works/design-system`).
