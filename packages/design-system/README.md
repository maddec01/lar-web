# @lar-works/design-system

Lar's design system: tokens, base styles, generic components and patterns, and the building blocks for an app's own UI
layer, built on React 19, Tailwind CSS 4 and ninna-ui, with lucide icons. Browse it in [Storybook](https://maddec01.github.io/lar-web/).

```sh
pnpm add @lar-works/design-system
```

```css
/* the app's CSS entry */
@import '@lar-works/design-system/styles.css';
```

```tsx
import { Button, DesignSystemProvider } from '@lar-works/design-system';
import { PlusIcon } from '@lar-works/design-system/icons';

<DesignSystemProvider labels={translatedLabels}>
    <Button leftIcon={<PlusIcon />}>Add library</Button>
</DesignSystemProvider>;
```

An app's product compositions, such as a board's rows or a marketing page's device frames, live in the app's own UI
layer (`src/ui`), not here. They compose the public components and `@lar-works/design-system/primitives`: the
styleable bases behind the components (`ButtonBase`, `TextBase`, `StackBase`…, which take a class for the
composition's layout) and the hooks and recipes the components share (`useScrollFade`, `linkRecipe`…). The app's CSS
entry imports `styles.css` with `source(none)`, then its UI layer's own sheets, and scans only that layer
(`@source './ui'`). A composition moves into the design system once a second product needs it.

Icons come from `@lar-works/design-system/icons`, and lucide's `DynamicIcon`, which draws an icon by its name and loads
lucide's name map lazily, from `@lar-works/design-system/icons/dynamic`.

Feature code outside `src/ui` composes components and never styles anything, and `src/ui` draws with the tokens, never
raw colours; `@lar-works/config`'s lint rules enforce both.
`@lar-works/design-system/testing` has helpers for apps' jsdom test setup.

The tests cover logic and behaviour that is easy to break: most run in jsdom, and the few that need a real layout
engine (the scroll fade, a dialog's frame, focus through overlays) run in Chromium (`src/*.browser.test.tsx`). Install
the browser once with `pnpm --filter @lar-works/design-system exec playwright install chromium` (Linux CI uses
`install --with-deps chromium`), and repeat it after upgrading Playwright. `pnpm test` runs both;
`pnpm --filter @lar-works/design-system test:browser` runs only Chromium. Story accessibility is checked in Storybook's
a11y panel; any exception has its reason beside the story's `parameters.a11y.config.rules`.
