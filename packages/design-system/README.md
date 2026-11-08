# @lar-works/design-system

Lar's design system: tokens, base styles and every visual component the Lar web apps use, built on React 19,
Tailwind CSS 4 and ninna-ui, with lucide icons. Browse it in [Storybook](https://maddec01.github.io/lar-web/).

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

A website that uses the marketing showcase (`Hero`, device frames, `ServerUnit`…) imports
`@lar-works/design-system/showcase.css` instead of `styles.css`, and Lar Factory's board, which composes the `board`
components (its title bar, counters, desk, loading screen…), imports `@lar-works/design-system/board.css`.

Icons come from `@lar-works/design-system/icons`, and lucide's `DynamicIcon`, which draws an icon by its name and loads
lucide's name map lazily, from `@lar-works/design-system/icons/dynamic`.

Apps compose these components and never style anything themselves; `@lar-works/config`'s lint rules enforce it.
`@lar-works/design-system/testing` has helpers for apps' jsdom test setup.

Story accessibility runs twice: fast markup checks in jsdom, and every story in Chromium with its real stylesheet,
in light and dark, with axe's WCAG AA colour-contrast rule enabled. Install the browser once with
`pnpm --filter @lar-works/design-system exec playwright install chromium` (Linux CI uses `install --with-deps chromium`).
`pnpm test` includes both; `pnpm --filter @lar-works/design-system test:browser` runs only Chromium. The browser version
is pinned by Playwright; after upgrading it, repeat the install. Page-level landmark rules are excluded because stories
are component fixtures. Any component exception must have a reason beside its story's `parameters.a11y.config.rules`.

Chromium uses reduced motion and finishes finite Web Animations before sampling contrast, so entrance fades are checked in
their final visible state. The jsdom suite makes no theme or CSS-contrast claim.
