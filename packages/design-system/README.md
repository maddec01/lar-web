# @lar-works/design-system

Lar's design system: tokens, base styles and generic components (React 19, Tailwind CSS 4, ninna-ui, lucide).
Browse it in [Storybook](https://maddec01.github.io/lar-web/).

```sh
pnpm add @lar-works/design-system
```

```css
/* the app's CSS entry; an app with its own UI layer adds `source(none)`, its sheets, then `@source './ui';` */
@import '@lar-works/design-system/styles.css';
```

```tsx
import { Button, DesignSystemProvider } from '@lar-works/design-system';
import { PlusIcon } from '@lar-works/design-system/icons';

<DesignSystemProvider labels={translatedLabels}>
    <Button leftIcon={<PlusIcon />}>Add library</Button>
</DesignSystemProvider>;
```
