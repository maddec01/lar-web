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
`@lar-works/design-system/showcase.css` instead of `styles.css`.

Apps compose these components and never style anything themselves; `@lar-works/config`'s lint rules enforce it.
`@lar-works/design-system/testing` has helpers for apps' jsdom test setup.
