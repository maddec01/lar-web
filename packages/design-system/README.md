# @lar-works/design-system

Lar's design system: tokens, base styles and generic components (React 19, Tailwind CSS 4, ninna-ui, lucide).
Browse it in [Storybook](https://maddec01.github.io/lar-web/).

```sh
pnpm add @lar-works/design-system
```

The [app template](https://github.com/maddec01/lar-web/tree/main/templates/app) shows the setup: `src/main.tsx`
imports `@lar-works/design-system/styles.css`, and `src/app/providers` wraps the app in `DesignSystemProvider`. An
app with its own UI layer imports the sheet with `source(none)`, then its own sheets and `@source './ui';`.
