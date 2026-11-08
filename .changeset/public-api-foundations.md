---
'@lar-works/design-system': minor
---

Tighten the public API and the foundations.

- Public component props no longer accept `className`, `style` or ninna-ui's look props (`size`, `color`, `variant`,
  `radius`…) where the component owns its look: IconButton, Input (now `presentation` only), Switch and the rest of the
  exported components (overlay compounds, Stack/Inline/Grid, Tooltip parts…); the design system's own compositions use
  the internal `…Base` exports, and `foundations/publicApi.test.ts` fails the type check on a leak. The raw `Box` and
  `Divider` re-exports are removed. Every public prop has a one-line description in the Storybook props table.
- `KindBadge` (new): a badge in a kind's lar-brand hue (an item's bug or feature, a catalog's music). `Badge` no longer
  takes `hue`.
- `Switch`: `busy` now blocks the toggle itself (pointer, label, Space and Enter), not just the callback, keeps the
  focus and sets `aria-busy`. Its props are explicit: `size`, `variant`, `thumbIcon`, `trackLabels` and `description`
  are gone.
- `TimeSeriesChart`: `formatTime` formats sample times in the app's locale (default: the browser's, to the second).
- Elevation: `--shadow-highlight`, `--shadow-pressed` and `--shadow-logo` join the shadow roles; the sign-in card uses
  `--shadow-dialog`; `scales.test.ts` fails on a shadow mixed in a class.
- StatusIndicator's halo is the foundations' `status-halo` / `status-halo-overlay` / `status-cutout` utilities; the
  status light breathes on `--motion-loop-breath`.
- Native controls take the primary `accent-color`; no WebKit tap flash.
- Storybook: GitHub-flavoured Markdown in the docs pages (tables render), and controls are disabled for object or array
  props holding functions or React nodes.
